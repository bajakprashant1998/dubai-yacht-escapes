import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, visitorId, messages, currentPage, recentlyViewed } = await req.json();

    if (!message || !conversationId) {
      throw new Error("Missing required fields: message, conversationId");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch comprehensive context data
    const [toursResult, servicesResult, combosResult, locationsResult, settingsResult] = await Promise.all([
      supabase.from("tours").select("id, title, slug, price, original_price, duration, category, description, rating, review_count, image_url").eq("status", "active").limit(30),
      supabase.from("services").select("id, title, slug, price, original_price, duration, description, rating, review_count, image_url").eq("is_active", true).limit(30),
      supabase.from("combo_packages").select("id, name, slug, final_price_aed, base_price_aed, discount_percent, duration_days, description, image_url, highlights").eq("is_active", true).limit(15),
      supabase.from("locations").select("name, description, address").eq("is_active", true),
      supabase.from("site_settings").select("key, value").in("key", ["contact_phone", "contact_email", "whatsapp_number"]),
    ]);

    const tours = toursResult.data || [];
    const services = servicesResult.data || [];
    const combos = combosResult.data || [];
    const locations = locationsResult.data || [];
    const settings = settingsResult.data || [];

    // Build rich knowledge context
    const toursInfo = tours.map((t) => 
      `- [TOUR:${t.id}] ${t.title} | ${t.price} AED${t.original_price ? ` (was ${t.original_price})` : ''} | ${t.duration || 'flexible'} | ${t.category} | ⭐${t.rating || 4.5} (${t.review_count || 0} reviews) | slug: ${t.slug}`
    ).join("\n");

    const servicesInfo = services.map((s) =>
      `- [SVC:${s.id}] ${s.title} | ${s.price} AED${s.original_price ? ` (was ${s.original_price})` : ''} | ${s.duration || 'flexible'} | ⭐${s.rating || 4.5} | slug: ${s.slug}`
    ).join("\n");

    const combosInfo = combos.map((c) =>
      `- [COMBO:${c.id}] ${c.name} | ${c.final_price_aed} AED (save ${c.discount_percent}%) | ${c.duration_days} days | slug: ${c.slug}${c.highlights ? ` | highlights: ${(c.highlights as string[]).slice(0, 3).join(', ')}` : ''}`
    ).join("\n");

    const locationsInfo = locations.map((l) => `- ${l.name}: ${l.description || "No description"}`).join("\n");
    
    const contactInfo = settings.reduce((acc, s) => {
      acc[s.key] = typeof s.value === "object" ? JSON.stringify(s.value) : s.value;
      return acc;
    }, {} as Record<string, string>);

    // Build browsing context
    let browsingContext = "";
    if (currentPage) {
      browsingContext += `\nVisitor is currently on page: ${currentPage}`;
    }
    if (recentlyViewed && recentlyViewed.length > 0) {
      browsingContext += `\nRecently viewed items: ${recentlyViewed.join(", ")}`;
    }

    // Build conversation history for context
    const conversationHistory = (messages || []).slice(-10).map((m: { sender_type: string; content: string }) => ({
      role: m.sender_type === "visitor" ? "user" : "assistant",
      content: m.content,
    }));

    const systemPrompt = `You are a luxury concierge AI assistant for "Luxury Dhow Escapes" - a premium yacht, dhow cruise, and tourism company in Dubai.

## Your Personality
- Warm, professional, and helpful
- Knowledgeable about Dubai's waterways, attractions, and luxury experiences
- Proactively recommends relevant experiences based on the conversation

## Available Tours & Experiences
${toursInfo || "No tours available."}

## Available Services & Activities
${servicesInfo || "No services available."}

## Combo Packages (Multi-Day Deals)
${combosInfo || "No combo packages available."}

## Locations
${locationsInfo || "Dubai Marina, Burj Khalifa area, and more."}

## Contact Information
- Phone: ${contactInfo.contact_phone || "+971 50 123 4567"}
- Email: ${contactInfo.contact_email || "info@luxurydhowescapes.com"}
- WhatsApp: ${contactInfo.whatsapp_number || "+971 50 123 4567"}

## Browsing Context
${browsingContext || "No browsing context available."}

## CRITICAL: Recommendation Tool
When the visitor asks about tours, activities, pricing, or what to do — you MUST use the "recommend_experiences" tool to return structured recommendation cards. Include 1-4 relevant items. Always pair it with a warm conversational message.

When recommending, consider:
- The visitor's budget if mentioned
- Group size (families, couples, solo)
- Interests (adventure, relaxation, luxury, culture)
- Current page they're browsing (for contextual suggestions)
- Recently viewed items (for cross-selling complementary experiences)
- Combo packages for multi-day visitors

## Guidelines
- Keep text responses concise (2-3 sentences) — let the recommendation cards do the heavy lifting
- Be enthusiastic but not pushy
- For complex queries or complaints, suggest connecting with a live agent
- Use emojis sparingly (🛥️, ✨, 🌅, 🏜️)
- Don't make up tours/services not in the above lists
- If unsure, offer to connect them with a human agent
- When a visitor seems interested, encourage booking via the website`;

    // Tool definition for structured recommendations
    const tools = [
      {
        type: "function",
        function: {
          name: "recommend_experiences",
          description: "Return structured recommendation cards for tours, services, or combo packages. Use whenever the visitor asks about experiences, pricing, or what to do in Dubai.",
          parameters: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The conversational response text to display above the recommendation cards"
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["tour", "service", "combo"], description: "The type of recommendation" },
                    id: { type: "string", description: "The ID from the catalog (e.g., the UUID after TOUR:, SVC:, or COMBO:)" },
                    title: { type: "string", description: "Display title" },
                    price: { type: "number", description: "Price in AED" },
                    original_price: { type: "number", description: "Original price if discounted (optional)" },
                    duration: { type: "string", description: "Duration text" },
                    rating: { type: "number", description: "Rating out of 5" },
                    slug: { type: "string", description: "URL slug for linking" },
                    reason: { type: "string", description: "One-line reason why this is recommended for the visitor" }
                  },
                  required: ["type", "id", "title", "price", "slug", "reason"],
                  additionalProperties: false
                }
              }
            },
            required: ["message", "recommendations"],
            additionalProperties: false
          }
        }
      }
    ];

    // Call Lovable AI Gateway with tool calling
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        tools,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        const fallbackMessage = "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to explore our tours or call us directly.";
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          sender_type: "bot",
          sender_name: "Luxury Dhow Escapes",
          content: fallbackMessage,
        });
        return new Response(JSON.stringify({ success: true, fallback: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const choice = aiResponse.choices?.[0];

    let botContent = "";
    let recommendations: unknown[] = [];

    // Check if the model used tool calling
    if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function?.name === "recommend_experiences") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          botContent = args.message || "Here are some experiences I'd recommend:";
          recommendations = args.recommendations || [];
        } catch (e) {
          console.error("Failed to parse tool call arguments:", e);
          botContent = choice?.message?.content || "I'd love to help you find the perfect experience!";
        }
      }
    } else {
      botContent = choice?.message?.content || "I apologize, I couldn't process that. Please try again or contact us directly.";
    }

    // Build metadata with recommendations
    const metadata: Record<string, unknown> = {};
    if (recommendations.length > 0) {
      metadata.recommendations = recommendations;
    }

    // Save bot response to database
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "bot",
      sender_name: "Luxury Dhow Escapes",
      content: botContent,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
    });

    return new Response(JSON.stringify({ success: true, message: botContent, recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat bot error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
