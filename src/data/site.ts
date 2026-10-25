export const site = {
  name: "Michael John Buencamino",
  shortName: "Mikee",
  title: "CRM & Technical Operations Specialist",
  tagline: "CRM Systems • Workflow Automation • System Integrations • Backend Operations",
  summary:
    "CRM & Technical Operations Specialist with experience supporting US-based businesses by managing CRM systems, workflow automations, and backend operations.",
  location: "Pototan, Iloilo, Philippines",
  email: "mikeecamino@gmail.com",
  phoneDisplay: "+63 956 214 5204",
  phoneTel: "+639562145204",
  resume: "/Michael-John-Buencamino-Resume.pdf",
  resumeFileName: "Michael-John-Buencamino-Resume.pdf",
  calendly: "https://calendly.com/mikeecamino/30min",
  whatsapp: "https://wa.me/639562145204",
  linkedin: "https://www.linkedin.com/in/michael-john-buencamino-46b1a92b7/",
} as const;

export const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Hello Michael — from your portfolio")}`;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;
