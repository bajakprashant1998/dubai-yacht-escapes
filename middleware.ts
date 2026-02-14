// Social crawler bot user agents
const CRAWLER_USER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Slackbot",
  "TelegramBot",
  "Discordbot",
  "Pinterest",
  "Embedly",
  "Quora Link Preview",
  "Showyoubot",
  "outbrain",
  "vkShare",
  "W3C_Validator",
  "redditbot",
  "Applebot",
  "rogerbot",
  "Baiduspider",
];

// Paths to skip (assets, API routes, admin pages)
const SKIP_PATTERNS = [
  /^\/_next\//,
  /^\/api\//,
  /^\/admin/,
  /^\/auth/,
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|mp4|woff|woff2|ttf|eot|json|xml|txt)$/,
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Skip asset/API/admin paths
  if (SKIP_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return;
  }

  const userAgent = request.headers.get("user-agent") || "";

  if (!isCrawler(userAgent)) {
    return;
  }

  // Redirect crawler to the OG metadata edge function
  const ogUrl = new URL(
    `https://gvcwbwwznkgomejehzab.supabase.co/functions/v1/og-metadata`
  );
  ogUrl.searchParams.set("path", pathname);

  // Use fetch to proxy the request (rewrite behavior)
  const response = await fetch(ogUrl);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
