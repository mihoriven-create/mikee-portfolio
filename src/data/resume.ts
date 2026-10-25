// Résumé-only content. Roles, education, and projects are shared with the website
// (see experience.ts and projects.ts) so the PDF and the site never drift apart.

export const resumeSummary =
  "CRM & Technical Operations Specialist with experience supporting US-based businesses by managing CRM systems, workflow automations, and backend operations. Experienced in building and improving CRM workflows, automating processes, integrating systems through APIs and webhooks, troubleshooting technical issues, and building custom web tools that help teams work more efficiently.";

export const coreCompetencies = [
  "CRM Administration & Configuration",
  "Workflow Automation",
  "AI Voice & Conversation AI",
  "API & Webhook Integrations",
  "Custom Web Applications",
  "Lead Management & Distribution",
  "Sales Pipeline Management",
  "Backend Operations",
  "Technical Troubleshooting",
  "Business Process Optimization",
  "Process Documentation & SOPs",
  "Data Management & Reporting",
  "Email System Administration",
  "Campaign Management",
  "Project Coordination",
  "Cross-Functional Collaboration",
];

export const technicalSkills: { label: string; items: string[] }[] = [
  { label: "CRM Platforms", items: ["GoHighLevel (GHL)", "Zoho CRM", "HubSpot", "ActiveCampaign", "ReSimpli"] },
  { label: "Automation & AI", items: ["Zapier", "Google Apps Script", "REST API Integration", "Webhooks", "OpenAI (ChatGPT)", "GHL AI Agents"] },
  { label: "Web Development", items: ["Next.js", "GitHub", "Vercel", "Basic HTML & CSS"] },
  { label: "Communication", items: ["Zoho Voice", "LeadConnector", "Microsoft Outlook", "Instantly AI", "Mailchimp"] },
  { label: "Forms & Documents", items: ["Jotform", "Adobe Acrobat Sign", "Google Forms", "Google Sheets", "Microsoft Excel", "Google Drive"] },
  { label: "Web Platforms", items: ["WordPress", "Wix", "Shopify", "Investor Carrot", "Google Analytics", "Google Search Console"] },
  { label: "Project & Collaboration", items: ["ClickUp", "Asana", "Monday.com", "Notion", "Slack", "Google Workspace", "Microsoft 365", "Teams", "Zoom", "Loom"] },
];

export const references: { name: string; role: string; company?: string; phone: string; email: string }[] = [
  { name: "Todd Teich", role: "CEO", company: "American Financial Services, LLC", phone: "+1 651 888 8289", email: "toddt@americanfsllc.com" },
  { name: "Sky Evangelista", role: "Operations Manager", phone: "+63 945 775 6673", email: "sky.mtsd@gmail.com" },
];

// Used for the résumé's Portfolio link when the PDF is exported from a local build.
export const fallbackPortfolioUrl = "https://mikee-portfolio-sepia.vercel.app";
