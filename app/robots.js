import { appConfig } from "@/lib/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${appConfig.appBaseUrl}/sitemap.xml`,
  };
}
