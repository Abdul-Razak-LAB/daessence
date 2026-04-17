import { appConfig } from "@/lib/config";

export default function sitemap() {
  const base = appConfig.appBaseUrl;
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/products/organic-african-soap-aloe-vera`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about/entrepreneurship-training`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/policies`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
