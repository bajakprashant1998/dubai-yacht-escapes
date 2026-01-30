import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TripInput {
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  nationality: string;
  budgetTier: 'low' | 'medium' | 'luxury';
  travelStyle: 'family' | 'couple' | 'adventure' | 'relax' | 'luxury';
  specialOccasion?: string;
  hotelPreference?: number;
  modifications?: string;
}

interface TripRequest {
  action: 'generate' | 'modify' | 'recalculate';
  tripId?: string;
  visitorId: string;
  input: TripInput;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { action, tripId, visitorId, input }: TripRequest = await req.json();

    // Fetch all necessary data for AI context
    const [hotelsRes, carsRes, toursRes, servicesRes, visaRulesRes, configRes] = await Promise.all([
      supabase.from('hotels').select('*').eq('is_active', true),
      supabase.from('car_rentals').select('*').eq('is_active', true),
      supabase.from('tours').select('*').eq('status', 'active'),
      supabase.from('services').select('*').eq('is_active', true),
      supabase.from('visa_nationality_rules').select('*').eq('country_code', input.nationality.toUpperCase()),
      supabase.from('ai_trip_config').select('*'),
    ]);

    const hotels = hotelsRes.data || [];
    const cars = carsRes.data || [];
    const tours = toursRes.data || [];
    const services = servicesRes.data || [];
    const visaRule = visaRulesRes.data?.[0];
    const configs = configRes.data || [];

    // Parse configs
    const getConfig = (key: string) => {
      const config = configs.find(c => c.config_key === key);
      return config?.config_value || {};
    };

    const budgetHotelMapping = getConfig('budget_hotel_mapping');
    const maxActivitiesConfig = getConfig('max_activities_per_day');
    const transportRules = getConfig('transport_rules');
    const upsellRules = getConfig('upsell_rules');

    // Calculate trip duration
    const arrival = new Date(input.arrivalDate);
    const departure = new Date(input.departureDate);
    const totalDays = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Determine transport type
    const totalTravelers = input.adults + input.children;
    let transportType = 'sedan';
    if (totalTravelers >= 6) transportType = 'van';
    else if (totalTravelers >= 3) transportType = 'suv';
    if (input.budgetTier === 'luxury') transportType = 'private luxury';

    // Filter hotels by budget tier
    const targetStars = budgetHotelMapping[input.budgetTier] || 4;
    const suitableHotels = hotels.filter(h => (h.star_rating || 4) >= targetStars - 1 && (h.star_rating || 4) <= targetStars + 1);

    // Build AI prompt
    const systemPrompt = `You are an expert Dubai travel planner AI. Generate a complete, detailed trip itinerary based on the user's preferences.

AVAILABLE INVENTORY:
Hotels (${suitableHotels.length} options):
${suitableHotels.map(h => `- ${h.name} (${h.star_rating}★, ${h.location}, from ${h.price_from} AED/night) ID: ${h.id}`).join('\n')}

Cars (${cars.length} options):
${cars.map(c => `- ${c.title} (${c.seats} seats, ${c.transmission}, ${c.daily_price} AED/day) ID: ${c.id}`).join('\n')}

Tours/Cruises (${tours.length} options):
${tours.map(t => `- ${t.title} (${t.duration}, ${t.price} AED) ID: ${t.id} - ${t.description?.substring(0, 100)}`).join('\n')}

Activities (${services.length} options):
${services.map(s => `- ${s.title} (${s.duration}, ${s.price} AED) ID: ${s.id} - ${s.description?.substring(0, 100)}`).join('\n')}

TRIP DETAILS:
- Arrival: ${input.arrivalDate}
- Departure: ${input.departureDate}
- Total Days: ${totalDays}
- Adults: ${input.adults}, Children: ${input.children}
- Budget Tier: ${input.budgetTier} (Target hotel stars: ${targetStars})
- Travel Style: ${input.travelStyle}
- Special Occasion: ${input.specialOccasion || 'none'}
- Transport Type: ${transportType}

VISA STATUS:
${visaRule ? (visaRule.visa_required ? `Visa REQUIRED. Documents needed: ${visaRule.documents_required?.join(', ')}` : 'No visa required') : 'Check visa requirements'}

RULES:
1. Day 1: Arrival + hotel check-in + max 1 light activity (evening preferred)
2. Last Day: Free time for packing + airport transfer (no major activities)
3. Middle Days: Max 2 major activities per day with proper time gaps
4. Include airport transfers on arrival and departure days
5. Select ONE hotel for the entire stay
6. Select appropriate transport based on ${totalTravelers} travelers
7. Add 2-3 upsell suggestions based on travel style (mark as optional)
8. Price everything in AED
9. Schedule activities with realistic times (9AM-9PM)
10. For families with children, prioritize family-friendly activities
11. For couples, include romantic experiences
12. For adventure style, include thrilling activities
13. For luxury, include premium experiences

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "hotel": { "id": "uuid", "name": "string", "nights": number, "pricePerNight": number },
  "transport": { "type": "sedan|suv|van|private luxury", "dailyRate": number, "totalDays": number },
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "items": [
        {
          "type": "transfer|activity|tour|meal|free_time",
          "itemId": "uuid or null",
          "title": "string",
          "description": "string",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "price": number
        }
      ]
    }
  ],
  "visa": { "required": boolean, "type": "string or null", "price": number, "documents": ["string"] },
  "upsells": [
    { "itemId": "uuid", "title": "string", "description": "string", "price": number, "reason": "string" }
  ],
  "summary": {
    "hotelTotal": number,
    "transportTotal": number,
    "activitiesTotal": number,
    "visaTotal": number,
    "grandTotal": number
  }
}`;

    const userMessage = action === 'modify' && input.modifications
      ? `Current trip needs modification: ${input.modifications}. Update the itinerary accordingly.`
      : `Generate a complete ${totalDays}-day Dubai trip itinerary for ${totalTravelers} travelers (${input.adults} adults, ${input.children} children) with ${input.budgetTier} budget and ${input.travelStyle} travel style.${input.specialOccasion && input.specialOccasion !== 'none' ? ` Special occasion: ${input.specialOccasion}.` : ''}`;

    // Call Gemini API directly
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      throw new Error('No content returned from AI');
    }

    // Parse AI response (handle markdown code blocks)
    let tripPlan;
    try {
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      tripPlan = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Failed to parse trip plan from AI');
    }

    // Store the trip plan in database
    const { data: savedTrip, error: tripError } = await supabase
      .from('trip_plans')
      .insert({
        visitor_id: visitorId,
        status: 'draft',
        destination: 'Dubai',
        arrival_date: input.arrivalDate,
        departure_date: input.departureDate,
        travelers_adults: input.adults,
        travelers_children: input.children,
        nationality: input.nationality,
        budget_tier: input.budgetTier,
        travel_style: input.travelStyle,
        special_occasion: input.specialOccasion || 'none',
        hotel_preference: input.hotelPreference?.toString(),
        total_price_aed: tripPlan.summary?.grandTotal || 0,
        display_currency: 'AED',
        display_price: tripPlan.summary?.grandTotal || 0,
        metadata: {
          ai_model: 'gemini-2.0-flash',
          generated_at: new Date().toISOString(),
          version: 1,
        },
      })
      .select()
      .single();

    if (tripError) {
      console.error('Error saving trip:', tripError);
      throw new Error('Failed to save trip plan');
    }

    // Store trip items
    const tripItems = [];

    // Add hotel
    if (tripPlan.hotel) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 1,
        item_type: 'hotel',
        item_id: tripPlan.hotel.id || null,
        title: tripPlan.hotel.name,
        description: `${tripPlan.hotel.nights} nights accommodation`,
        price_aed: tripPlan.hotel.pricePerNight * tripPlan.hotel.nights,
        quantity: tripPlan.hotel.nights,
        is_optional: false,
        is_included: true,
        sort_order: 0,
        metadata: { pricePerNight: tripPlan.hotel.pricePerNight },
      });
    }

    // Add transport
    if (tripPlan.transport) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 1,
        item_type: 'car',
        title: `${tripPlan.transport.type} Transport`,
        description: `${tripPlan.transport.totalDays} days private transport`,
        price_aed: tripPlan.transport.dailyRate * tripPlan.transport.totalDays,
        quantity: tripPlan.transport.totalDays,
        is_optional: false,
        is_included: true,
        sort_order: 1,
        metadata: { dailyRate: tripPlan.transport.dailyRate, type: tripPlan.transport.type },
      });
    }

    // Add daily items
    if (tripPlan.days) {
      for (const day of tripPlan.days) {
        for (let i = 0; i < day.items.length; i++) {
          const item = day.items[i];
          tripItems.push({
            trip_id: savedTrip.id,
            day_number: day.dayNumber,
            item_type: item.type === 'tour' ? 'tour' : item.type === 'transfer' ? 'transfer' : 'activity',
            item_id: item.itemId || null,
            title: item.title,
            description: item.description,
            start_time: item.startTime,
            end_time: item.endTime,
            price_aed: item.price || 0,
            quantity: 1,
            is_optional: false,
            is_included: true,
            sort_order: i + 10,
            metadata: {},
          });
        }
      }
    }

    // Add visa if required
    if (tripPlan.visa?.required) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 0,
        item_type: 'visa',
        title: `UAE ${tripPlan.visa.type || 'Tourist'} Visa`,
        description: tripPlan.visa.documents?.join(', '),
        price_aed: tripPlan.visa.price || 0,
        quantity: input.adults + input.children,
        is_optional: false,
        is_included: true,
        sort_order: 0,
        metadata: { documents: tripPlan.visa.documents },
      });
    }

    // Add upsells
    if (tripPlan.upsells) {
      for (const upsell of tripPlan.upsells) {
        tripItems.push({
          trip_id: savedTrip.id,
          day_number: 0,
          item_type: 'upsell',
          item_id: upsell.itemId || null,
          title: upsell.title,
          description: upsell.reason || upsell.description,
          price_aed: upsell.price,
          quantity: 1,
          is_optional: true,
          is_included: false,
          sort_order: 100,
          metadata: {},
        });
      }
    }

    // Insert all trip items
    if (tripItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('trip_items')
        .insert(tripItems);

      if (itemsError) {
        console.error('Error saving trip items:', itemsError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        tripId: savedTrip.id,
        plan: tripPlan,
        visaRequired: visaRule?.visa_required || false,
        visaDocuments: visaRule?.documents_required || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Trip planner error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
