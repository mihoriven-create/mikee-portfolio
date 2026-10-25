import type { Screenshot } from "./projects";

export type ClientFeedback = {
  author: string;
  role?: string;
  company: string;
  logo: string;
  current?: boolean;
  // Only words the client actually wrote or approved. Leave undefined until they do.
  quote?: string;
  // Michael's own description of the engagement, shown (without quote marks) while there is no quote.
  scope?: string;
};

// Client feedback: Yannick's is from the original Wix portfolio; Todd's and Ryan's were supplied by Michael.
// Order matters: the middle card is the featured one.
export const clients: ClientFeedback[] = [
  {
    author: "Yannick",
    company: "Finance Parrot",
    logo: "/logos/finance-parrot.webp",
    quote:
      "I truly appreciate the effort, professionalism, and dedication you’ve brought to the work. Thank you for everything you’ve contributed so far.",
  },
  {
    author: "Todd T.",
    company: "American Financial Services, LLC",
    logo: "/logos/american-financial-services.webp",
    quote:
      "Mikee has been an important part of our technical operations, helping us improve our CRM systems, automate workflows, and streamline our business processes. His ability to troubleshoot technical issues, integrate different platforms, and develop practical solutions has helped our team operate more efficiently. He consistently demonstrates initiative, attention to detail, and a strong commitment to improving the systems we rely on.",
  },
  {
    author: "Ryan P.",
    company: "One Finance Source",
    logo: "/logos/one-finance-source-logo.webp",
    quote:
      "Great at solving technical problems and building CRM automations. His dedication and technical skills have made our workflows more efficient.",
  },
];

export type WorkSample = {
  title: string;
  author: string;
  quote?: string;
  screenshot: Screenshot;
};

// Conversations and project updates shown on the Wix "Work Samples & Professional Feedback" section.
export const workSamples: WorkSample[] = [
  {
    title: "Workflow Development & Problem Solving",
    author: "Robert M",
    quote: "Thank you so much Mikee... great problem solving on that!",
    screenshot: {
      src: "/work/feedback-robert-m.webp",
      alt: "Slack thread: Mikee shares a new contact-notes workflow and Robert M thanks him for the problem solving",
      width: 1553,
      height: 837,
    },
  },
  {
    title: "Reporting & Lead Qualification",
    author: "Katrina F",
    quote:
      "We have 2 Funding Agreements signed & in underwriting and 1 with inaccurate information, 1 No show we are following up on and 1 call scheduled today. Great job on qualifying leads and I love the reports!! Very thorough and helpful in call preparation.",
    screenshot: {
      src: "/work/feedback-katrina-f.webp",
      alt: "Slack message from Katrina F praising lead qualification and reports",
      width: 1595,
      height: 322,
    },
  },
  {
    title: "Website & System Updates",
    author: "Bob H",
    quote: "Everything Looks Great! Thanks for getting this done for me. It is very much appreciated!",
    screenshot: {
      src: "/work/feedback-bob-h.webp",
      alt: "Slack thread: Mikee reports website fixes and Bob H confirms everything looks great",
      width: 1185,
      height: 904,
    },
  },
  {
    title: "CRM Troubleshooting & Workflow Investigation",
    author: "John T",
    screenshot: {
      src: "/work/feedback-john-t.webp",
      alt: "Slack thread: Mikee traces where automated messages originate in the CRM workflow",
      width: 983,
      height: 791,
    },
  },
];
