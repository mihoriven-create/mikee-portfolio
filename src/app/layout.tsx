import type { Metadata, Viewport } from "next";
import { Inter, Kanit } from "next/font/google";
import { site, siteUrl } from "@/data/site";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Michael John Buencamino — CRM & Technical Operations Specialist. CRM administration, workflow automation, AI Voice and Conversation AI, API and webhook integrations, and backend operations for US-based businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "CRM Specialist",
    "GoHighLevel",
    "Workflow Automation",
    "Conversation AI",
    "AI Voice",
    "API Integrations",
    "Webhooks",
    "Technical Operations",
    "Zoho CRM",
    "Michael John Buencamino",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${site.name} — ${site.title}`,
    description,
    url: "/",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kanit.variable} ${inter.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="focus-ring sr-only z-[100] rounded-full bg-gold px-5 py-3 font-display text-sm uppercase tracking-widest text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
