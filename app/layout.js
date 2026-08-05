import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { appConfig } from "@/lib/config";

const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Da Essence | Organic African Soap with Aloe Vera",
  description: "Natural African-origin skincare with aloe vera for gentle cleansing, hydration, and glow support.",
  metadataBase: new URL(appConfig.appBaseUrl),
  openGraph: {
    title: "Da Essence | Organic African Soap",
    description: "Organic African soap infused with aloe vera for calm, balanced skin and modern wellness routines.",
    url: appConfig.appBaseUrl,
    siteName: appConfig.appName,
    images: [
      {
        url: "/assets/blacksoap.jpg",
        width: 1200,
        height: 630,
        alt: "Da Essence Organic African Soap",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Da Essence",
    description: "Organic African soap with aloe vera for gentle cleansing and glow.",
    images: ["/assets/blacksoap.jpg"],
  },
  icons: {
    icon: "/assets/cropped-favicon.png",
    shortcut: "/assets/cropped-favicon.png",
    apple: "/assets/cropped-favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppChat />
      </body>
    </html>
  );
}
