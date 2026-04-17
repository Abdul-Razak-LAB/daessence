import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppChat } from "@/components/WhatsAppChat";

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
  description: "Natural, African-origin skincare with aloe vera for gentle cleansing and glow support.",
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
