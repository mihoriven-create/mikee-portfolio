export type Expertise = {
  name: string;
  description: string;
  tools: string[];
};

// Sourced from the résumé's core competencies, technical skills, and AFS responsibilities.
export const expertise: Expertise[] = [
  {
    name: "CRM Administration & Configuration",
    description:
      "Pipelines, calendars, custom fields, contacts, user permissions, and opportunity management across GoHighLevel, Zoho CRM, and partner platforms.",
    tools: ["GoHighLevel", "Zoho CRM", "HubSpot", "ActiveCampaign", "ReSimpli"],
  },
  {
    name: "Workflow Automation",
    description:
      "SMS, email, and workflow automations for lead nurturing, appointment booking, follow-up campaigns, and internal notifications.",
    tools: ["GHL Workflows", "Zapier", "Google Apps Script", "Mailchimp"],
  },
  {
    name: "AI Voice & Conversation AI",
    description:
      "Configuring and supporting AI Voice and Conversation AI — call routing, booking logic, AI summaries, notifications, and CRM integrations.",
    tools: ["GHL AI Agents", "OpenAI (ChatGPT)", "LeadConnector", "Zoho Voice"],
  },
  {
    name: "API & Webhook Integrations",
    description:
      "Connecting CRMs, forms, and spreadsheets through REST APIs and webhooks, and troubleshooting third-party integrations end to end.",
    tools: ["REST APIs", "Webhooks", "Zapier", "Google Sheets"],
  },
  {
    name: "Backend Operations & Troubleshooting",
    description:
      "Root-cause analysis across CRM systems, digital forms, PDF workflows, email administration, and e-signature processes.",
    tools: ["Microsoft 365", "Outlook", "Adobe Acrobat Sign", "Jotform"],
  },
  {
    name: "Lead Management & Distribution",
    description:
      "Lead routing, round-robin calendars, ownership assignment, and aged-lead re-engagement so every lead reaches the right person.",
    tools: ["Round-robin calendars", "Lead routing", "Tagging", "Pipelines"],
  },
  {
    name: "Custom Web Applications",
    description:
      "Building purpose-built web tools that connect directly to CRM operations, version-controlled and deployed with modern tooling.",
    tools: ["Next.js", "GitHub", "Vercel", "HTML & CSS"],
  },
  {
    name: "Business Process Optimization",
    description:
      "Process documentation, SOP development, and cross-functional collaboration to make systems reliable and teams more efficient.",
    tools: ["SOPs", "ClickUp", "Asana", "Notion"],
  },
];

export type ToolGroup = { label: string; tools: string[] };

export const toolGroups: ToolGroup[] = [
  { label: "CRM Platforms", tools: ["GoHighLevel (GHL)", "Zoho CRM", "HubSpot", "ActiveCampaign", "ReSimpli"] },
  { label: "Automation & AI", tools: ["Zapier", "Google Apps Script", "REST API Integration", "Webhooks", "OpenAI (ChatGPT)", "GHL AI Agents"] },
  { label: "Communication", tools: ["Zoho Voice", "LeadConnector", "Microsoft Outlook", "Instantly AI", "Mailchimp"] },
  { label: "Forms & Documents", tools: ["Jotform", "Adobe Acrobat", "Google Forms", "Google Sheets", "Microsoft Excel", "Google Drive"] },
  { label: "Web Platforms", tools: ["WordPress", "Wix", "Shopify", "Investor Carrot", "Google Analytics", "Search Console"] },
  { label: "Project & Collaboration", tools: ["ClickUp", "Asana", "Monday.com", "Notion", "Slack", "Microsoft Teams", "Zoom", "Loom"] },
];

export type ToolLogo = { name: string; logo: string; width: number; height: number };

const tool = (name: string, file: string, width: number, height: number): ToolLogo => ({
  name,
  logo: `/tools/${file}.webp`,
  width,
  height,
});

// The platform logos from the original Wix "Tools & Platform" strip, recoloured for a black background.
// Two rows for the marquee: the top row drifts left, the bottom row drifts right.
export const toolLogoRows: ToolLogo[][] = [
  [
    tool("GoHighLevel", "gohighlevel", 320, 96),
    tool("Zoho CRM", "zoho-crm", 299, 96),
    tool("HubSpot", "hubspot", 96, 96),
    tool("ActiveCampaign", "activecampaign", 99, 96),
    tool("ReSimpli", "resimpli", 154, 96),
    tool("Zapier", "zapier", 210, 96),
    tool("Jotform", "jotform", 320, 65),
    tool("Google Workspace", "google-workspace", 125, 96),
    tool("Microsoft 365", "microsoft-365", 320, 59),
    tool("Slack", "slack", 320, 80),
    tool("ClickUp", "clickup", 320, 78),
  ],
  [
    tool("Zoho Voice", "zoho-voice", 251, 96),
    tool("Instantly", "instantly", 320, 86),
    tool("Mailchimp", "mailchimp", 174, 96),
    tool("Adobe Acrobat", "adobe-acrobat", 99, 96),
    tool("WordPress", "wordpress", 96, 96),
    tool("Wix", "wix", 249, 96),
    tool("Shopify", "shopify", 92, 96),
    tool("Investor Carrot", "investor-carrot", 276, 96),
    tool("Figma", "figma", 320, 91),
    tool("Canva", "canva", 96, 96),
    tool("CapCut", "capcut", 128, 96),
  ],
];
