export type ProjectVisualKind = "intake" | "workflow" | "voice" | "sheets" | "calculator" | "infra";

export type ProjectStatus = "Implemented" | "In development";

export type CaseStudyStep = {
  label: "Challenge" | "Solution" | "Implementation" | "Outcome";
  body: string;
};

export type Screenshot = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  category: string;
  name: string;
  summary: string;
  // Leave undefined when the status has not been confirmed — no badge is shown.
  status?: ProjectStatus;
  steps: CaseStudyStep[];
  stack: string[];
  // Real work screenshots (from the original Wix portfolio). Projects without any
  // fall back to the illustrative `visual`.
  screenshots?: Screenshot[];
  visual: ProjectVisualKind;
  link?: { href: string; label: string };
};

const shot = (name: string, alt: string, width: number, height: number): Screenshot => ({
  src: `/work/${name}.webp`,
  alt,
  width,
  height,
});

// Case-study copy is limited to what the résumé, the original portfolio, and the
// project brief support. No metrics or results are invented.
export const projects: Project[] = [
  {
    slug: "afs-deal-intake",
    category: "Custom Web Application",
    name: "AFS Deal Intake Web Application",
    summary:
      "A custom intake application for American Financial Services that collects deal submissions and documents and connects them to GoHighLevel.",
    status: "In development",
    steps: [
      {
        label: "Challenge",
        body: "Deal submissions needed a dedicated, structured intake path that could accept supporting documents securely and feed directly into CRM operations.",
      },
      {
        label: "Solution",
        body: "A purpose-built web application for deal intake, with private file storage for uploaded documents and an integration that passes submission data into GoHighLevel.",
      },
      {
        label: "Implementation",
        body: "Built with Next.js and modern web technologies, version-controlled on GitHub, and deployed through Vercel. Uploaded files go to private storage rather than public URLs.",
      },
      {
        label: "Outcome",
        body: "Currently in development. Results will be documented once the application is in production use.",
      },
    ],
    stack: ["Next.js", "GitHub", "Vercel", "Private file storage", "GoHighLevel API"],
    visual: "intake",
  },
  {
    slug: "ghl-workflows",
    category: "CRM Automation",
    name: "GoHighLevel CRM Workflows & Lead Nurturing",
    summary:
      "Re-engagement and nurturing systems for aged and inbound business loan leads, using SMS, email, tagging, and follow-up workflows.",
    status: "Implemented",
    steps: [
      {
        label: "Challenge",
        body: "Thousands of inactive leads required a structured follow-up process, and new inbound business loan leads needed immediate, consistent communication through qualification.",
      },
      {
        label: "Solution",
        body: "A scalable re-engagement system plus inbound nurturing workflows that engage leads, collect information, and support appointment booking.",
      },
      {
        label: "Implementation",
        body: "SMS and email sequences, tagging, follow-up workflows, round-robin lead routing, and automated appointment scheduling across multiple CRM environments.",
      },
      {
        label: "Outcome",
        body: "A re-engagement process that consistently follows up with aged leads without manual intervention, and timely communication for every inbound lead.",
      },
    ],
    stack: ["GoHighLevel", "SMS Automation", "Email Automation", "Round-robin Calendars"],
    screenshots: [
      shot("ghl-workflows-list", "GoHighLevel workflow folders for aged leads, call center, leads, deals, and lead management", 1584, 825),
      shot("ghl-aged-lead-campaign", "Aged Lead Campaign workflows: email and SMS, booked, not interested, respond, appointment, and converted", 1588, 820),
      shot("ghl-aged-lead-new-campaign", "Aged Lead New Campaign workflows with 30-day check-in, response, and staged follow-up", 1582, 824),
      shot("ghl-aged-lead-email-sms", "Aged Lead Email & SMS workflow in the GoHighLevel builder", 1800, 843),
      shot("ghl-call-center-workflows", "Call center business loan workflows: outreach, appointment booked, tagging, and response", 1584, 813),
      shot("ghl-call-center-workflows-2", "Business loan call center workflows including staged follow-up and AI test workflow", 1572, 796),
      shot("ghl-bl-outreach-7", "Business loan main workflow with 7-touch outreach sequence", 1800, 839),
      shot("ghl-bl-outreach-10", "Business loan main workflow with 10-touch outreach and monthly check-in", 1800, 846),
      shot("ghl-bl-response", "Business loan response workflow: opportunity update, tagging, notifications, and SMS", 1800, 839),
      shot("ghl-round-robin-assign", "Workflow entry distributing leads to setters with round-robin user assignment", 1800, 909),
      shot("ghl-booked-slack-notification", "Appointment booked workflow sending a Slack notification to the team", 1800, 1012),
    ],
    visual: "workflow",
  },
  {
    slug: "ai-voice",
    category: "AI Systems",
    name: "AI Voice & Conversation AI Implementation",
    summary:
      "AI agents and call intelligence workflows covering call routing, booking logic, AI summaries, notifications, and CRM integration.",
    status: "Implemented",
    steps: [
      {
        label: "Challenge",
        body: "The business needed an AI assistant to handle lead conversations and support qualification, and sales teams needed a faster way to review calls than reading long transcripts.",
      },
      {
        label: "Solution",
        body: "Configured AI Voice and Conversation AI workflows, plus an AI-powered workflow that turns call transcripts into structured summaries inside the CRM.",
      },
      {
        label: "Implementation",
        body: "Prompt development, conversation logic, call routing, booking logic, notifications, dry-run validation, and ongoing monitoring and refinement of AI agents.",
      },
      {
        label: "Outcome",
        body: "Reduced manual note-taking, improved visibility into customer conversations, and improved AI response quality.",
      },
    ],
    stack: ["GHL AI Agents", "Conversation AI", "AI Voice", "OpenAI"],
    screenshots: [
      shot("ai-atlas-working-hours", "Conversation AI workflow switching the AI agent on outside human working hours", 851, 315),
      shot("ai-qualification-summary", "AI qualification summary workflow powered by OpenAI", 851, 315),
      shot("ai-call-disposition", "Multi-trigger call disposition workflow routing outcomes to follow-up actions", 851, 315),
    ],
    visual: "voice",
  },
  {
    slug: "sheets-integrations",
    category: "Integrations",
    name: "Google Sheets, Apps Script & Webhook Integrations",
    summary:
      "Spreadsheet-driven data processes and integrations that connect CRM records with Google Sheets through Apps Script, webhooks, and Zapier.",
    status: "Implemented",
    steps: [
      {
        label: "Challenge",
        body: "GoHighLevel does not natively calculate the days between a contact's creation date and today, so existing records lacked an accurate Lead Age value for reporting.",
      },
      {
        label: "Solution",
        body: "A custom spreadsheet process that calculates Lead Age from each contact's creation date and prepares the values for bulk import.",
      },
      {
        label: "Implementation",
        body: "Spreadsheet formulas and bulk import for historical records, alongside automation built with Google Apps Script, webhooks, REST APIs, and Zapier.",
      },
      {
        label: "Outcome",
        body: "Standardized the Lead Age field across existing contacts, improving reporting accuracy, lead prioritization, and operational visibility.",
      },
    ],
    stack: ["Google Sheets", "Google Apps Script", "Webhooks", "Zapier", "Bulk Import"],
    visual: "sheets",
  },
  {
    slug: "dscr-calculator",
    category: "Forms & Calculators",
    name: "Jotform DSCR Loan Calculator",
    summary:
      "A Debt Service Coverage Ratio (DSCR) loan calculator built in Jotform to support loan scenario conversations.",
    status: "Implemented",
    steps: [
      {
        label: "Challenge",
        body: "Loan conversations often come down to one number, the debt service coverage ratio (DSCR): how well a property’s income covers its loan payments. Working it out by hand each time slows the conversation and makes results harder to keep consistent.",
      },
      {
        label: "Solution",
        body: "A calculator built as a Jotform form. Enter the property and loan figures and the form works out the DSCR automatically, so every scenario is run the same way.",
      },
      {
        label: "Implementation",
        body: "Built in Jotform using form calculation fields that compute the ratio from the figures entered.",
      },
      {
        label: "Outcome",
        body: "A ready-to-use calculator that returns the DSCR as soon as the figures are entered, giving a quick and consistent way to size up a loan scenario.",
      },
    ],
    stack: ["Jotform", "Calculated Fields"],
    visual: "calculator",
  },
  {
    slug: "crm-infrastructure",
    category: "Technical Operations",
    name: "CRM Infrastructure, Troubleshooting & Process Automation",
    summary:
      "Day-to-day backbone work: keeping CRMs, integrations, forms, email, and e-signature workflows reliable for AFS and partner organizations.",
    status: "Implemented",
    steps: [
      {
        label: "Challenge",
        body: "Multiple businesses depend on CRMs, third-party integrations, digital forms, and document workflows that must stay reliable day to day.",
      },
      {
        label: "Solution",
        body: "Ongoing CRM administration, technical troubleshooting, and process automation, supported by documentation and SOPs.",
      },
      {
        label: "Implementation",
        body: "Root-cause analysis across CRMs, APIs, webhooks, and PDF workflows; Microsoft 365 and Outlook administration; Adobe Acrobat Sign fillable forms and e-signature workflows; backend support for One Finance Source, Term Loan Solution, and Alliance Capital Enterprises Inc.",
      },
      {
        label: "Outcome",
        body: "Reliable systems that reduce manual work and keep funding workflows and daily operations running.",
      },
    ],
    stack: ["GoHighLevel", "Zoho CRM", "Microsoft 365", "Adobe Acrobat Sign", "Zapier"],
    screenshots: [
      shot("crm-pipeline-1", "Opportunity pipeline board managed in GoHighLevel (contact details blurred)", 851, 315),
      shot("crm-pipeline-2", "Lead pipeline stages in GoHighLevel (contact details blurred)", 851, 315),
      shot("crm-pipeline-3", "Sales pipeline with qualification and follow-up stages (contact details blurred)", 851, 315),
      shot("crm-pipeline-4", "Aged lead pipeline with response and booking stages (contact details blurred)", 851, 315),
      shot("crm-calendar-availability", "Discovery call calendar availability schedule across team members", 1800, 925),
      shot("crm-calendar-staff", "Calendar staff and meeting location setup optimized for equal distribution", 1800, 927),
      shot("crm-calendar-details", "Discovery call calendar configuration", 851, 315),
      shot("crm-cc-tagging", "Call center tagging workflow with branching paths", 1800, 838),
      shot("crm-response-slack", "Lead response workflow posting Slack alerts with assigned user and contact details", 1800, 846),
    ],
    visual: "infra",
  },
];
