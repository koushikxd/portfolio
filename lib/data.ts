export const EXPERIENCE = [
  {
    company: "Steps AI",
    role: "Software Development Engineer",
    date: "Mar 2026 - Aug 2026",
    description:
      "Rebuilt their entire frontend, helped ship reliable customer-facing ecommerce AI agents, and handled everything across the stack including backend and cloud.",
  },
  {
    company: "Techintelli Solutions (Callensights)",
    role: "Software Development Engineer",
    date: "Mar 2025 - Mar 2026",
    description:
      "Built an AI-powered ATS platform (Callensights) and an AI student companion app from the ground up.",
  },
  {
    company: "Vertocity",
    role: "Founding Engineer",
    date: "Mar 2024 - Feb 2025",
    description:
      "Joined as an Intern and later worked as Founding engineer who built the frontend infrastructure from scratch.",
  },
];

type Project = {
  name: string;
  description: string;
  language: string;
  image: string;
  /** Where the name links: the live site, or the repo if there isn't one */
  url: string;
  /** Repo, listed separately only when `url` is a live site */
  source?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Relay",
    description:
      "Multiplayer AI for IT companies. One agent works privately with each employee and with the whole team in Slack, carrying the right memory, files, and permissions into every room.",
    language: "TypeScript",
    url: "https://relayy-ai.vercel.app/",
    image: "/projects/relay.png",
  },
  {
    name: "Maple",
    description:
      "AI-driven performance analysis and regression detection for k6, prometheus etc",
    language: "TypeScript, Rust",
    url: "https://github.com/koushikxd/Maple",
    image: "/projects/maple.png",
  },
  {
    name: "Skills",
    description:
      "Agent skills made for my coding agents. Research, design specs, PR babysitting, browser verification and more, installable with one command.",
    language: "Markdown",
    url: "https://www.skills.sh/koushikxd/skills",
    source: "https://github.com/koushikxd/Skills",
    image: "/projects/skills.png",
  },
];

export const HANDLES = {
  x: "koushik_xd",
  github: "koushikxd",
};

export const SOCIALS = {
  x: `https://x.com/${HANDLES.x}`,
  github: `https://github.com/${HANDLES.github}`,
  email: "koushikblitz@gmail.com",
};
