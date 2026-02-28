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

// Helper: validate UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const safeUuid = (id: string | null | undefined): string | null => {
  if (!id) return null;
  return uuidRegex.test(id) ? id : null;
};

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

    // Fetch data in parallel - limit fields to reduce payload
    const [hotelsRes, toursRes, servicesRes, visaRulesRes] = await Promise.all([
      supabase.from('hotels').select('id,name,star_rating,location,price_from').eq('is_active', true).limit(20),
      supabase.from('tours').select('id,title,duration,price,description').eq('status', 'active').limit(30),
      supabase.from('services').select('id,title,duration,price,description').eq('is_active', true).limit(30),
      supabase.from('visa_nationality_rules').select('*').eq('country_code', input.nationality.toUpperCase()).limit(1),
    ]);

    const hotels = hotelsRes.data || [];
    const tours = toursRes.data || [];
    const services = servicesRes.data || [];
    const visaRule = visaRulesRes.data?.[0];

    // Calculate trip duration
    const arrival = new Date(input.arrivalDate);
    const departure = new Date(input.departureDate);
    const totalDays = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalTravelers = input.adults + input.children;

    // Budget-based hotel filter
    const targetStars = input.budgetTier === 'luxury' ? 5 : input.budgetTier === 'medium' ? 4 : 3;
    const suitableHotels = hotels.filter(h => {
      const stars = h.star_rating || 4;
      return stars >= targetStars - 1 && stars <= targetStars + 1;
    }).slice(0, 8);

    // Transport type
    let transportType = 'sedan';
    if (totalTravelers >= 6) transportType = 'van';
    else if (totalTravelers >= 3) transportType = 'suv';
    if (input.budgetTier === 'luxury') transportType = 'private luxury';

    // Build compact inventory strings
    const hotelList = suitableHotels.map(h => `${h.id}|${h.name}|${h.star_rating}★|${h.location}|${h.price_from}AED`).join('\n');
    const tourList = tours.slice(0, 15).map(t => `${t.id}|${t.title}|${t.duration}|${t.price}AED`).join('\n');
    const serviceList = services.slice(0, 15).map(s => `${s.id}|${s.title}|${s.duration}|${s.price}AED`).join('\n');

    const visaStatus = visaRule
      ? (visaRule.visa_required ? `Visa REQUIRED. Documents: ${(visaRule.documents_required || []).join(', ')}` : 'No visa required')
      : 'Assume visa required';

    const systemPrompt = `You are a Dubai travel planner. Generate a JSON trip itinerary.

HOTELS (id|name|stars|location|price):
${hotelList || 'No hotels available - create generic recommendations'}

TOURS (id|name|duration|price):
${tourList || 'No tours - create generic activities'}

ACTIVITIES (id|name|duration|price):
${serviceList || 'No activities - create generic ones'}

TRIP: ${input.arrivalDate} to ${input.departureDate} (${totalDays} days), ${input.adults} adults + ${input.children} children, ${input.budgetTier} budget, ${input.travelStyle} style${input.specialOccasion && input.specialOccasion !== 'none' ? `, occasion: ${input.specialOccasion}` : ''}.
Transport: ${transportType}. Visa: ${visaStatus}.

RULES:
- Day 1: Arrival + check-in + 1 evening activity
- Last day: Free morning + airport transfer
- Middle days: 2-3 activities with realistic times (9AM-9PM)
- Use EXACT UUIDs from inventory for itemId. If no match, set itemId to null.
- Pick ONE hotel for all nights
- Price in AED

Return ONLY this JSON:
{"hotel":{"id":"uuid","name":"str","nights":N,"pricePerNight":N},"transport":{"type":"str","dailyRate":N,"totalDays":N},"days":[{"dayNumber":N,"date":"YYYY-MM-DD","items":[{"type":"transfer|activity|tour|meal|free_time","itemId":"uuid or null","title":"str","description":"str","startTime":"HH:MM","endTime":"HH:MM","price":N}]}],"visa":{"required":bool,"type":"str or null","price":N,"documents":["str"]},"upsells":[{"itemId":"uuid or null","title":"str","description":"str","price":N,"reason":"str"}],"summary":{"hotelTotal":N,"transportTotal":N,"activitiesTotal":N,"visaTotal":N,"grandTotal":N}}`;

    const userMessage = action === 'modify' && input.modifications
      ? `Modify trip: ${input.modifications}`
      : `Generate ${totalDays}-day Dubai itinerary for ${totalTravelers} travelers.`;

    console.log('Calling Lovable AI gateway...');

    // Use Gemini API directly
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Gemini API Error:', aiResponse.status, errorText);
      throw new Error(`Gemini API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      console.error('No content in AI response:', JSON.stringify(aiResult).substring(0, 500));
      throw new Error('No content returned from AI');
    }

    console.log('AI response received, parsing...');

    // Parse AI response
    let tripPlan;
    try {
      let jsonStr = aiContent.trim();
      // Strip markdown code blocks if present
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      tripPlan = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Parse error. First 500 chars:', aiContent.substring(0, 500));
      throw new Error('Failed to parse trip plan from AI');
    }

    console.log('Trip plan parsed, saving to database...');

    // Store the trip plan
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
          ai_model: 'gemini-2.5-flash',
          generated_at: new Date().toISOString(),
          version: 2,
        },
      })
      .select()
      .single();

    if (tripError) {
      console.error('Error saving trip:', tripError);
      throw new Error('Failed to save trip plan');
    }

    // Build trip items array
    const tripItems: any[] = [];

    // Hotel
    if (tripPlan.hotel) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 1,
        item_type: 'hotel',
        item_id: safeUuid(tripPlan.hotel.id),
        title: tripPlan.hotel.name || 'Hotel',
        description: `${tripPlan.hotel.nights || totalDays - 1} nights accommodation`,
        price_aed: (tripPlan.hotel.pricePerNight || 0) * (tripPlan.hotel.nights || totalDays - 1),
        quantity: tripPlan.hotel.nights || totalDays - 1,
        is_optional: false,
        is_included: true,
        sort_order: 0,
        metadata: { pricePerNight: tripPlan.hotel.pricePerNight },
      });
    }

    // Transport
    if (tripPlan.transport) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 1,
        item_type: 'car',
        title: `${tripPlan.transport.type || transportType} Transport`,
        description: `${tripPlan.transport.totalDays || totalDays} days private transport`,
        price_aed: (tripPlan.transport.dailyRate || 0) * (tripPlan.transport.totalDays || totalDays),
        quantity: tripPlan.transport.totalDays || totalDays,
        is_optional: false,
        is_included: true,
        sort_order: 1,
        metadata: { dailyRate: tripPlan.transport.dailyRate, type: tripPlan.transport.type },
      });
    }

    // Daily items
    if (tripPlan.days && Array.isArray(tripPlan.days)) {
      for (const day of tripPlan.days) {
        if (!day.items || !Array.isArray(day.items)) continue;
        for (let i = 0; i < day.items.length; i++) {
          const item = day.items[i];
          tripItems.push({
            trip_id: savedTrip.id,
            day_number: day.dayNumber || 1,
            item_type: item.type === 'tour' ? 'tour' : item.type === 'transfer' ? 'transfer' : 'activity',
            item_id: safeUuid(item.itemId),
            title: item.title || 'Activity',
            description: item.description || '',
            start_time: item.startTime || null,
            end_time: item.endTime || null,
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

    // Visa
    if (tripPlan.visa?.required) {
      tripItems.push({
        trip_id: savedTrip.id,
        day_number: 0,
        item_type: 'visa',
        title: `UAE ${tripPlan.visa.type || 'Tourist'} Visa`,
        description: (tripPlan.visa.documents || []).join(', '),
        price_aed: tripPlan.visa.price || 0,
        quantity: input.adults + input.children,
        is_optional: false,
        is_included: true,
        sort_order: 0,
        metadata: { documents: tripPlan.visa.documents },
      });
    }

    // Upsells
    if (tripPlan.upsells && Array.isArray(tripPlan.upsells)) {
      for (const upsell of tripPlan.upsells) {
        tripItems.push({
          trip_id: savedTrip.id,
          day_number: 0,
          item_type: 'upsell',
          item_id: safeUuid(upsell.itemId),
          title: upsell.title || 'Extra',
          description: upsell.reason || upsell.description || '',
          price_aed: upsell.price || 0,
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
        // Don't throw - trip is saved, items are secondary
      }
    }

    console.log('Trip saved successfully:', savedTrip.id);

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
