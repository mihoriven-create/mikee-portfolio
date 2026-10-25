export type Role = {
  title: string;
  company: string;
  period: string;
  current?: boolean;
  points: string[];
  partners?: string[];
};

// Source of truth: résumé (myresume.pdf).
export const experience: Role[] = [
  {
    title: "CRM & Technical Operations Specialist",
    company: "American Financial Services, LLC",
    period: "July 2025 – Present",
    current: true,
    points: [
      "Manage CRM operations across GoHighLevel, Zoho CRM, and partner platforms, including pipelines, calendars, workflow automations, lead routing, and opportunity management.",
      "Design, build, and optimize SMS, email, AI, and workflow automations that improve lead nurturing, appointment booking, follow-up campaigns, and operational efficiency.",
      "Configure and support AI Voice and Conversation AI workflows, including call routing, booking logic, AI summaries, notifications, and CRM integrations.",
      "Troubleshoot CRM systems, APIs, webhooks, third-party integrations, digital forms, PDF workflows, and backend processes through root cause analysis.",
      "Develop and maintain automation solutions using Zapier, Google Apps Script, and native CRM workflows.",
      "Manage Microsoft 365, Outlook, and Adobe Acrobat Sign, including email administration, fillable PDF forms, e-signature workflows, and document automation.",
      "Building a custom deal intake web application with Next.js, GitHub, and Vercel, featuring private file storage and GoHighLevel integration (in development).",
      "Built a DSCR loan calculator in Jotform using form calculation fields.",
      "Collaborate with cross-functional teams to document processes, implement new systems, and improve CRM performance, automation reliability, and operational workflows.",
      "Support CRM operations and backend automation for partner organizations, ensuring efficient funding workflows and system optimization.",
    ],
    partners: ["One Finance Source", "Term Loan Solution", "Alliance Capital Enterprises Inc."],
  },
  {
    title: "Marketing Operations Assistant",
    company: "Finance Parrot",
    period: "May 2025 – July 2025",
    points: [
      "Supported daily operations, executive tasks, and project coordination.",
      "Managed website updates, SEO improvements, lead generation initiatives, and cold email outreach campaigns.",
      "Monitored campaign performance and provided administrative support.",
    ],
  },
  {
    title: "Executive Assistant to CEO",
    company: "One Virtual Desk",
    period: "February 2024 – May 2025",
    points: [
      "Supported executive operations, project coordination, and business processes across multiple departments.",
      "Built and managed GoHighLevel workflows, CRM automations, lead capture systems, and follow-up campaigns.",
      "Maintained CRM data, pipelines, and client communication processes to improve lead management and conversion.",
      "Managed websites, SEO initiatives, and client support requests.",
      "Supported recruitment, sales, marketing, and client success operations.",
    ],
  },
  {
    title: "Content Management Specialist",
    company: "StratHauz",
    period: "November 2023 – January 2024",
    points: [
      "Assisted with website management, SEO, and lead generation.",
      "Conducted keyword research and supported content marketing efforts.",
    ],
  },
  {
    title: "Field Service Technician (IT)",
    company: "Self-Employed",
    period: "January 2018 – Present",
    current: true,
    points: [
      "Provide technical support for hardware, software, and networking.",
      "Install, configure, and maintain IT equipment and systems.",
    ],
  },
];

export const education = {
  school: "Western Institute of Technology",
  program: "Information Technology",
  // Shown on the résumé only.
  level: "Undergraduate",
  period: "2015 – 2020",
};
