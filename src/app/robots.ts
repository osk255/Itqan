import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Open to all crawlers, including OAI-SearchBot (ChatGPT search). Whether to
 * block AI-training crawlers such as GPTBot is the client's decision
 * (docs/CLIENT_QUESTIONS.md #5); until then the live site's default (allow) is kept.
 * Preview deploys are kept out of search by the X-Robots-Tag header in netlify.toml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // The brand sheet and form stub carry noindex; they are not blocked here so crawlers can read it.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
