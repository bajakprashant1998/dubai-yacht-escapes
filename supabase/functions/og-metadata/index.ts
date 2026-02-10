import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Betterview Tourism";
const BASE_URL = "https://rentalyachtindubai.com";
const DEFAULT_IMAGE = `${BASE_URL}/betterview-logo.png`;
const DEFAULT_DESCRIPTION =
  "Discover Dubai with Betterview Tourism. Premium yacht charters, desert safaris, theme parks, city tours, and unforgettable experiences.";

// Static page metadata
const STATIC_PAGES: Record<string, { title: string; description: string; image?: string }> = {
  "/": {
    title: "Dubai Tours, Yacht Charters & Experiences",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about Betterview Tourism – Dubai's trusted travel partner since 2015 offering premium tours, yacht charters, and unforgettable experiences.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Get in touch with Betterview Tourism for bookings, inquiries, and custom Dubai travel packages. Available 24/7.",
  },
  "/experiences": {
    title: "Activities & Experiences",
    description:
      "Explore top Dubai activities — desert safaris, water sports, theme parks, city tours, and adventure experiences.",
  },
  "/combo-packages": {
    title: "Combo Packages",
    description:
      "Save big with Betterview combo packages. Curated multi-day Dubai experiences with hotels, transport, and activities included.",
  },
  "/car-rentals": {
    title: "Car Rentals",
    description:
      "Rent luxury and economy cars in Dubai. Self-drive and chauffeur options with competitive daily, weekly, and monthly rates.",
  },
  "/hotels": {
    title: "Hotels",
    description:
      "Book premium hotels in Dubai. From budget-friendly stays to 5-star luxury resorts with exclusive Betterview rates.",
  },
  "/visa-services": {
    title: "Visa Services",
    description:
      "Easy UAE visa processing for tourists and business travelers. Fast approvals, competitive pricing, and expert support.",
  },
  "/blog": {
    title: "Travel Blog",
    description:
      "Dubai travel tips, guides, and inspiration from Betterview Tourism. Plan your perfect Dubai trip with expert advice.",
  },
  "/plan-trip": {
    title: "Plan Your Trip",
    description:
      "Use our AI-powered trip planner to create a personalized Dubai itinerary. Tailored to your budget, interests, and travel style.",
  },
  "/gallery": {
    title: "Photo Gallery",
    description:
      "Browse stunning photos from Betterview Tourism experiences. Yacht cruises, desert safaris, city tours, and more.",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about Dubai tours, bookings, payments, cancellations, and travel tips.",
  },
  "/travel-tips": {
    title: "Travel Tips",
    description:
      "Essential Dubai travel tips — best times to visit, what to pack, cultural etiquette, and money-saving advice.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Betterview Tourism privacy policy. Learn how we protect your personal data and booking information.",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description: "Betterview Tourism terms and conditions for bookings, cancellations, and service usage.",
  },
  "/cancellation-policy": {
    title: "Cancellation Policy",
    description: "Betterview Tourism cancellation and refund policy for tours, activities, and travel packages.",
  },
};

function buildOgHtml(meta: { title: string; description: string; image: string; url: string; type?: string }): string {
  const fullTitle = `${meta.title} | ${SITE_NAME}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="${escapeHtml(meta.url)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="${meta.type || "website"}" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${escapeHtml(meta.image)}" />
  <meta property="og:url" content="${escapeHtml(meta.url)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${escapeHtml(meta.image)}" />

  <!-- Redirect non-crawlers to the real page -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.url)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(meta.url)}">${escapeHtml(fullTitle)}</a>...</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let meta: { title: string; description: string; image: string; url: string; type?: string };

    // Check static pages first
    if (STATIC_PAGES[path]) {
      const page = STATIC_PAGES[path];
      meta = {
        title: page.title,
        description: page.description,
        image: page.image || DEFAULT_IMAGE,
        url: `${BASE_URL}${path}`,
      };
    }
    // Dynamic: Blog post /blog/:slug
    else if (/^\/blog\/[^/]+$/.test(path) && !path.startsWith("/blog/category/")) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("blog_posts")
        .select("title, excerpt, meta_title, meta_description, featured_image")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.title,
          description: data.meta_description || data.excerpt || DEFAULT_DESCRIPTION,
          image: data.featured_image || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
          type: "article",
        };
      } else {
        meta = { title: "Blog Post", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Combo package /combo-packages/:slug
    else if (/^\/combo-packages\/[^/]+$/.test(path)) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("combo_packages")
        .select("name, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.name,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Combo Package", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Tour detail /dubai/:category/:slug
    else if (/^\/dubai\/[^/]+\/[^/]+$/.test(path) && !path.startsWith("/dubai/services/")) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("tours")
        .select("title, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.title,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Dubai Tour", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Service detail /dubai/services/:category/:slug
    else if (/^\/dubai\/services\/[^/]+\/[^/]+$/.test(path)) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("services")
        .select("title, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.title,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Dubai Experience", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Visa service /visa-services/:slug
    else if (/^\/visa-services\/[^/]+$/.test(path)) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("visa_services")
        .select("title, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.title,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Visa Service", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Car rental /car-rentals/:cat/:slug
    else if (/^\/car-rentals\/[^/]+\/[^/]+$/.test(path)) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("car_rentals")
        .select("title, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.title,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Car Rental", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Dynamic: Hotel /hotels/:cat/:slug
    else if (/^\/hotels\/[^/]+\/[^/]+$/.test(path)) {
      const slug = path.split("/").pop()!;
      const { data } = await supabase
        .from("hotels")
        .select("name, description, meta_title, meta_description, image_url")
        .eq("slug", slug)
        .single();

      if (data) {
        meta = {
          title: data.meta_title || data.name,
          description: data.meta_description || data.description || DEFAULT_DESCRIPTION,
          image: data.image_url || DEFAULT_IMAGE,
          url: `${BASE_URL}${path}`,
        };
      } else {
        meta = { title: "Hotel", description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE, url: `${BASE_URL}${path}` };
      }
    }
    // Fallback
    else {
      meta = {
        title: "Dubai Tours, Yacht Charters & Experiences",
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: `${BASE_URL}${path}`,
      };
    }

    // Make sure image is absolute URL
    if (meta.image && !meta.image.startsWith("http")) {
      meta.image = `${BASE_URL}${meta.image}`;
    }

    const html = buildOgHtml(meta);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("OG metadata error:", error);
    return new Response(
      buildOgHtml({
        title: "Betterview Tourism",
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: BASE_URL,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
});
