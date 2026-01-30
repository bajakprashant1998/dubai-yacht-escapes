import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BASE_URL = "https://rentalyachtindubai.com";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing standard Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

async function generateSitemap() {
  console.log("Starting sitemap generation...");

  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split("T")[0];

  // 1. Static Routes
  const staticRoutes = [
    { path: "", priority: "1.0", changefreq: "daily" as const },
    { path: "/experiences", priority: "0.9", changefreq: "daily" as const },
    { path: "/combo-packages", priority: "0.9", changefreq: "weekly" as const },
    { path: "/car-rentals", priority: "0.8", changefreq: "weekly" as const },
    { path: "/hotels", priority: "0.8", changefreq: "weekly" as const },
    { path: "/visa-services", priority: "0.8", changefreq: "weekly" as const },
    { path: "/gallery", priority: "0.7", changefreq: "weekly" as const },
    { path: "/blog", priority: "0.8", changefreq: "daily" as const },
    { path: "/about", priority: "0.6", changefreq: "monthly" as const },
    { path: "/contact", priority: "0.6", changefreq: "monthly" as const },
    { path: "/faq", priority: "0.6", changefreq: "monthly" as const },
    { path: "/travel-tips", priority: "0.6", changefreq: "monthly" as const },
    { path: "/trip-planner", priority: "0.7", changefreq: "weekly" as const },
    { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" as const },
    { path: "/terms-of-service", priority: "0.3", changefreq: "yearly" as const },
    { path: "/cancellation-policy", priority: "0.3", changefreq: "yearly" as const },
  ];

  staticRoutes.forEach((route) => {
    urls.push({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  // 2. Fetch Service Categories
  const { data: serviceCategories, error: scError } = await supabase
    .from("service_categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (scError) {
    console.error("Error fetching service categories:", scError);
  } else if (serviceCategories) {
    serviceCategories.forEach((cat) => {
      urls.push({
        loc: `${BASE_URL}/dubai/services/${cat.slug}`,
        lastmod: cat.updated_at?.split("T")[0] || today,
        changefreq: "daily",
        priority: "0.8",
      });
    });
  }

  // 3. Fetch Services
  const { data: services, error: svcError } = await supabase
    .from("services")
    .select("slug, updated_at, category_id, service_categories(slug)")
    .eq("is_active", true);

  if (svcError) {
    console.error("Error fetching services:", svcError);
  } else if (services) {
    services.forEach((service: any) => {
      const categorySlug = service.service_categories?.slug || "general";
      urls.push({
        loc: `${BASE_URL}/dubai/services/${categorySlug}/${service.slug}`,
        lastmod: service.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    });
  }

  // 4. Fetch Tour Categories (for yacht/dhow routes)
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (catError) {
    console.error("Error fetching categories:", catError);
  } else if (categories) {
    categories.forEach((cat) => {
      urls.push({
        loc: `${BASE_URL}/dubai/${cat.slug}`,
        lastmod: cat.updated_at?.split("T")[0] || today,
        changefreq: "daily",
        priority: "0.9",
      });
    });
  }

  // 5. Fetch Tours
  const { data: tours, error: tourError } = await supabase
    .from("tours")
    .select("slug, seo_slug, updated_at, category")
    .eq("status", "active");

  if (tourError) {
    console.error("Error fetching tours:", tourError);
  } else if (tours && tours.length > 0) {
    tours.forEach((tour: any) => {
      const tourSlug = tour.seo_slug || tour.slug;
      const categorySlug = tour.category || "general";
      urls.push({
        loc: `${BASE_URL}/dubai/${categorySlug}/${tourSlug}`,
        lastmod: tour.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.8",
      });
    });
  }

  // 6. Fetch Combo Packages
  const { data: combos, error: comboError } = await supabase
    .from("combo_packages")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (comboError) {
    console.error("Error fetching combo packages:", comboError);
  } else if (combos) {
    combos.forEach((combo) => {
      urls.push({
        loc: `${BASE_URL}/combo-packages/${combo.slug}`,
        lastmod: combo.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.8",
      });
    });
  }

  // 7. Fetch Car Rentals
  const { data: cars, error: carError } = await supabase
    .from("car_rentals")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (carError) {
    console.error("Error fetching car rentals:", carError);
  } else if (cars) {
    cars.forEach((car) => {
      urls.push({
        loc: `${BASE_URL}/car-rentals/${car.slug}`,
        lastmod: car.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    });
  }

  // 8. Fetch Car Categories
  const { data: carCategories, error: carCatError } = await supabase
    .from("car_categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (carCatError) {
    console.error("Error fetching car categories:", carCatError);
  } else if (carCategories) {
    carCategories.forEach((cat) => {
      urls.push({
        loc: `${BASE_URL}/car-rentals?category=${cat.slug}`,
        lastmod: cat.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    });
  }

  // 9. Fetch Hotels
  const { data: hotels, error: hotelError } = await supabase
    .from("hotels")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (hotelError) {
    console.error("Error fetching hotels:", hotelError);
  } else if (hotels) {
    hotels.forEach((hotel) => {
      urls.push({
        loc: `${BASE_URL}/hotels/${hotel.slug}`,
        lastmod: hotel.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    });
  }

  // 10. Fetch Visa Services
  const { data: visas, error: visaError } = await supabase
    .from("visa_services")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (visaError) {
    console.error("Error fetching visa services:", visaError);
  } else if (visas) {
    visas.forEach((visa) => {
      urls.push({
        loc: `${BASE_URL}/visa-services/${visa.slug}`,
        lastmod: visa.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.7",
      });
    });
  }

  // 11. Fetch Blog Posts
  const { data: posts, error: postError } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  if (postError) {
    console.error("Error fetching blog posts:", postError);
  } else if (posts) {
    posts.forEach((post) => {
      urls.push({
        loc: `${BASE_URL}/blog/${post.slug}`,
        lastmod: post.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.6",
      });
    });
  }

  // 12. Fetch Blog Categories
  const { data: blogCategories, error: blogCatError } = await supabase
    .from("blog_categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  if (blogCatError) {
    console.error("Error fetching blog categories:", blogCatError);
  } else if (blogCategories) {
    blogCategories.forEach((cat) => {
      urls.push({
        loc: `${BASE_URL}/blog/category/${cat.slug}`,
        lastmod: cat.updated_at?.split("T")[0] || today,
        changefreq: "weekly",
        priority: "0.6",
      });
    });
  }

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urls.forEach((url) => {
    xml += `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  // Ensure public directory exists
  const publicDir = path.resolve(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Write sitemap.xml
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
  console.log(`✅ Sitemap generated with ${urls.length} URLs at public/sitemap.xml`);

  // Create robots.txt
  const robotsTxtPath = path.join(publicDir, "robots.txt");
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(robotsTxtPath, robotsContent);
  console.log("✅ robots.txt generated/updated successfully");
}

generateSitemap();
