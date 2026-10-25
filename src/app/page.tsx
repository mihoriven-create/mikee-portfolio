import { MotionConfig } from "framer-motion";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Navbar } from "@/components/sections/Navbar";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { site, siteUrl } from "@/data/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  email: `mailto:${site.email}`,
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Iloilo", addressCountry: "PH" },
  knowsAbout: ["CRM Administration", "Workflow Automation", "GoHighLevel", "Conversation AI", "API Integrations", "Webhooks"],
};

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <SmoothScroll />
      <Navbar />
      <main id="main" className="overflow-x-clip bg-ink">
        <Hero />
        <Marquee />
        <About />
        <Expertise />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
    </MotionConfig>
  );
}
