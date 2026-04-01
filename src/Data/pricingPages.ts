// ─── Pricing Detail Pages — Central Data
// Each slug maps to one full-page pricing config.

export type PlanDetail = {
  name: string;
  price: string;
  bestFor: string;
  features: string[];
  outcome: string;
  highlight?: boolean;
};

export type ServicePricingPage = {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  intro: string;
  accent: string;
  gradient: string[];
  plans: PlanDetail[];
  process: string[];
  maintenance: {
    includedMonths: string;
    yearlyRate: string;
    included: string[];
    notIncluded: string[];
  };
  transparency: string;
  cta: {
    heading: string;
    sub: string;
    buttonText: string;
    href: string;
  };
};

export const pricingPages: ServicePricingPage[] = [
  /* ──────────────────────────────────────
     CLOUD
  ────────────────────────────────────── */
  {
    slug: "cloud",
    title: "Cloud Infrastructure",
    subtitle: "Secure, scalable, and production-ready systems.",
    tagline: "We don't sell features. We build systems — and maintain them.",
    intro:
      "Your infrastructure is the backbone of everything. We design and deploy cloud systems that hold up under real load — not just demo conditions. Whether you're shipping an MVP or running high-scale traffic, we build foundations that don't crack.",
    accent: "#DBFE49",
    gradient: ["#84cc16", "#DBFE49", "#a3e635"],
    plans: [
      {
        name: "Starter",
        price: "From $3,999",
        bestFor: "MVPs and early-stage products",
        features: [
          "Basic deployment setup",
          "Hosting configuration",
          "CI/CD pipeline (basic)",
          "Deployment support",
          "2+ months monitoring included",
        ],
        outcome: "A stable, production-ready foundation your app can rely on.",
        highlight: false,
      },
      {
        name: "Core",
        price: "From $7,999",
        bestFor: "Growing products and SaaS platforms",
        features: [
          "Everything in Starter",
          "Scalable infrastructure design",
          "Monitoring & alerting systems",
          "Load balancing",
          "2+ months maintenance included",
        ],
        outcome:
          "A system that handles growth and traffic spikes without breaking.",
        highlight: false,
      },
      {
        name: "Vision",
        price: "From $14,999",
        bestFor: "High-scale and enterprise systems",
        features: [
          "Everything in Core",
          "Enterprise-level architecture",
          "Auto-scaling systems",
          "Security hardening & redundancy",
          "Disaster recovery planning",
          "2+ months premium maintenance included",
        ],
        outcome:
          "A fully resilient, enterprise-grade infrastructure built for any load.",
        highlight: true,
      },
    ],
    process: [
      "Infrastructure planning & audit",
      "Architecture design & review",
      "Setup & environment configuration",
      "Load testing & optimization",
      "Deployment & handoff",
    ],
    maintenance: {
      includedMonths: "2+ months",
      yearlyRate: "40% of project cost",
      included: ["Monitoring", "Performance optimization", "Security updates"],
      notIncluded: ["New feature development", "Major system redesigns"],
    },
    transparency:
      "Final pricing depends on complexity, cloud provider, scale, and integrations required. We provide a fixed quote post-discovery.",
    cta: {
      heading: "Let's build your infrastructure the right way.",
      sub: "No lock-in. No surprises. Just a system that works.",
      buttonText: "Book a Call",
      href: "/book-call?category=cloud",
    },
  },

  /* ──────────────────────────────────────
     WEB DEVELOPMENT
  ────────────────────────────────────── */
  {
    slug: "web-development",
    title: "Web Development",
    subtitle: "From business websites to scalable platforms.",
    tagline: "Built for performance. Designed for growth.",
    intro:
      "Every web project we take on is engineered for real-world usage — not just aesthetics. We focus on speed, scalability, and clean code that lasts. Your site or platform will look great and perform even better.",
    accent: "#FF7B00",
    gradient: ["#FF512F", "#FF7B00", "#FFB347"],
    plans: [
      {
        name: "Starter",
        price: "$4,999",
        bestFor: "Business websites and landing pages",
        features: [
          "Custom website design & development",
          "Responsive layout",
          "Basic backend or CMS integration",
          "SEO-ready structure",
          "Deployment",
          "2+ months maintenance included",
        ],
        outcome:
          "A clean, fast, and professional online presence that converts.",
        highlight: false,
      },
      {
        name: "Advanced",
        price: "$8,999",
        bestFor: "Platforms and dynamic systems",
        features: [
          "Everything in Starter",
          "Dashboard and dynamic feature development",
          "Authentication system",
          "API integrations",
          "Scalable backend architecture",
          "2+ months maintenance included",
        ],
        outcome:
          "A powerful system ready for real users, real data, and real growth.",
        highlight: true,
      },
    ],
    process: [
      "Strategy & planning session (up to 7 days)",
      "UI/UX alignment and wireframing",
      "Development sprint",
      "Testing & QA",
      "Deployment & post-launch support",
    ],
    maintenance: {
      includedMonths: "2+ months",
      yearlyRate: "40% of project cost",
      included: [
        "Bug fixes",
        "Performance monitoring",
        "Security updates",
        "Uptime monitoring",
      ],
      notIncluded: ["New page or feature development", "Major redesigns"],
    },
    transparency:
      "Pricing is fixed per plan. Scope changes or additional integrations may be quoted separately before implementation.",
    cta: {
      heading: "Let's build your system.",
      sub: "One team. End-to-end ownership. Zero handoff confusion.",
      buttonText: "Book a Call",
      href: "/book-call?category=webdev",
    },
  },

  /* ──────────────────────────────────────
     APP DEVELOPMENT
  ────────────────────────────────────── */
  {
    slug: "app-development",
    title: "App Development",
    subtitle: "From MVP to full-scale products.",
    tagline: "We take full ownership — from idea to deployment.",
    intro:
      "We develop mobile and web applications that are built to scale from day one. No shortcuts on architecture, no cutting corners on UX. You get a production-grade product — with a team that actually understands what production means.",
    accent: "#5869E3",
    gradient: ["#5869E3", "#7C8CF8", "#A5B4FC"],
    plans: [
      {
        name: "Starter",
        price: "From $7,999",
        bestFor: "MVPs and proof-of-concept builds",
        features: [
          "Core feature development",
          "Basic backend setup",
          "UI integration",
          "Deployment",
          "2+ months maintenance included",
        ],
        outcome:
          "A working, deployable product ready to validate with real users.",
        highlight: false,
      },
      {
        name: "Core",
        price: "From $12,999",
        bestFor: "Growing applications with real users",
        features: [
          "Everything in Starter",
          "API integrations",
          "Advanced backend logic",
          "Performance optimization",
          "2+ months maintenance included",
        ],
        outcome:
          "A product that scales with your users and handles the unexpected.",
        highlight: false,
      },
      {
        name: "Vision",
        price: "From $19,999",
        bestFor: "Full product builds from idea to launch",
        features: [
          "Complete system architecture",
          "Full frontend + backend development",
          "Database architecture & design",
          "Deployment & scaling configuration",
          "Full ownership from concept to launch",
          "2+ months premium maintenance included",
        ],
        outcome:
          "Your complete product — shipped, stable, and ready for the world.",
        highlight: true,
      },
    ],
    process: [
      "Product discovery & scope definition",
      "Architecture & tech stack planning",
      "UI/UX design alignment",
      "Development sprints",
      "QA, testing & performance review",
      "Deployment & launch support",
    ],
    maintenance: {
      includedMonths: "2+ months",
      yearlyRate: "40% of project cost",
      included: [
        "App monitoring",
        "Bug fixes",
        "Security patches",
        "Performance tuning",
      ],
      notIncluded: ["Feature additions", "New screen development"],
    },
    transparency:
      "Complexity, platform (iOS/Android/Web), and third-party integrations affect scope and pricing. A detailed quote is provided after our discovery call.",
    cta: {
      heading: "Let's build your app.",
      sub: "Real products. Real timelines. Real ownership.",
      buttonText: "Start Project",
      href: "/book-call?category=appdev",
    },
  },

  /* ──────────────────────────────────────
     AI & AUTOMATION
  ────────────────────────────────────── */
  {
    slug: "ai",
    title: "AI & Automation",
    subtitle: "Turn manual work into intelligent systems.",
    tagline: "Stop managing processes. Start running systems.",
    intro:
      "We build AI integrations and automation workflows that eliminate repetitive work, surface insights, and scale your operations. Not chatbots for the sake of it — real systems that change how your business runs.",
    accent: "#7C3AED",
    gradient: ["#7C3AED", "#A78BFA", "#22D3EE"],
    plans: [
      {
        name: "Starter",
        price: "From $5,999",
        bestFor: "Teams automating their first workflows",
        features: [
          "Basic automation workflows",
          "API-based AI integrations",
          "Deployment support",
          "2+ months maintenance included",
        ],
        outcome:
          "Your first high-impact automation — live and saving you hours weekly.",
        highlight: false,
      },
      {
        name: "Core",
        price: "From $11,999",
        bestFor: "Businesses ready to automate core operations",
        features: [
          "Everything in Starter",
          "Custom AI logic design",
          "Data handling & pipeline setup",
          "Workflow automation systems",
          "Priority execution",
          "2+ months maintenance included",
        ],
        outcome:
          "A fully automated workflow system running at the core of your operations.",
        highlight: false,
      },
      {
        name: "Vision",
        price: "From $18,999",
        bestFor: "Enterprise-level AI transformation",
        features: [
          "Everything in Core",
          "Advanced AI system design",
          "Multi-layer automation architecture",
          "End-to-end workflow transformation",
          "On-site strategy session",
          "2+ months premium maintenance included",
        ],
        outcome:
          "A business that runs smarter — with less manual effort at every level.",
        highlight: true,
      },
    ],
    process: [
      "Workflow audit & automation mapping",
      "AI integration strategy",
      "Data pipeline & system design",
      "Build & testing",
      "Deployment & team onboarding",
    ],
    maintenance: {
      includedMonths: "2+ months",
      yearlyRate: "40% of project cost",
      included: [
        "Workflow monitoring",
        "Pipeline health checks",
        "Bug fixes & integration upkeep",
        "Security updates",
      ],
      notIncluded: [
        "New automation workflows",
        "New AI integrations",
      ],
    },
    transparency:
      "AI complexity, data volume, and third-party API usage vary per project. Pricing is confirmed post-discovery.",
    cta: {
      heading: "Automate your business.",
      sub: "The best automation isn't a tool — it's a system built around your business.",
      buttonText: "Get Started",
      href: "/book-call?category=ai",
    },
  },

  /* ──────────────────────────────────────
     UI/UX DESIGN
  ────────────────────────────────────── */
  {
    slug: "ui-ux",
    title: "UI/UX Design",
    subtitle: "Design systems that users love.",
    tagline: "Great design isn't decoration. It's how your product communicates.",
    intro:
      "We design interfaces that are intuitive, scalable, and conversion-focused. Every screen is built around how real users think and interact — not trends. You get a design system that works in production, not just in mockups.",
    accent: "#FF7B00",
    gradient: ["#FF512F", "#FF7B00", "#FFB347"],
    plans: [
      {
        name: "UI/UX Design",
        price: "$2,999",
        bestFor: "Products that need a complete design system",
        features: [
          "User research & competitor analysis",
          "Low-to-high fidelity wireframing",
          "Design system (colors, typography, components)",
          "Full UI screens (web + app)",
          "Responsive layouts",
          "Developer handoff (Figma + documentation)",
        ],
        outcome:
          "A complete, production-ready design system — delivered and handed off.",
        highlight: true,
      },
    ],
    process: [
      "Research & discovery",
      "Wireframing (low fidelity)",
      "Design system setup",
      "High fidelity UI screens",
      "Responsive adaptation",
      "Developer handoff & documentation",
    ],
    maintenance: {
      includedMonths: "Not applicable",
      yearlyRate: "$1,199/year (optional)",
      included: [
        "Design file updates",
        "Minor component additions",
        "Version management",
      ],
      notIncluded: ["Full redesigns", "New product flows", "Development work"],
    },
    transparency:
      "This is a flat-rate design engagement. Additional screens or flows beyond scope can be added at an agreed rate.",
    cta: {
      heading: "Start designing with intention.",
      sub: "A design system that ships fast and scales with your product.",
      buttonText: "Get Design",
      href: "/book-call?category=uiux",
    },
  },

  /* ──────────────────────────────────────
     SEO
  ────────────────────────────────────── */
  {
    slug: "seo",
    title: "SEO Optimization",
    subtitle: "Rank higher. Stay competitive. Grow consistently.",
    tagline: "SEO isn't a one-time setup. It's an ongoing system.",
    intro:
      "We build SEO systems — not one-off reports. Every month we optimize, track, and improve your search presence. The results compound over time, and we give you full visibility into what's working.",
    accent: "#3755CD",
    gradient: ["#3755CD", "#5B73E8", "#93A8FF"],
    plans: [
      {
        name: "Monthly",
        price: "$2,999/month",
        bestFor: "Businesses testing SEO or in early growth",
        features: [
          "Technical SEO optimization",
          "On-page improvements (continuous)",
          "Keyword tracking & optimization",
          "Performance monitoring",
          "Monthly reporting",
          "Competitor tracking",
        ],
        outcome:
          "Steady search visibility growth with full monthly reporting.",
        highlight: false,
      },
      {
        name: "Yearly",
        price: "$29,999/year",
        bestFor: "Businesses serious about long-term SEO growth",
        features: [
          "Everything in Monthly",
          "Long-term SEO strategy",
          "Priority optimization & execution",
          "Faster implementation cycles",
          "Dedicated SEO support",
        ],
        outcome:
          "A compound SEO system that saves ~$6,000 annually and drives serious growth.",
        highlight: true,
      },
    ],
    process: [
      "SEO audit & baseline report",
      "Strategy & keyword mapping",
      "Technical fixes & on-page optimization",
      "Ongoing content & link strategy",
      "Monthly reporting & adjustment",
    ],
    maintenance: {
      includedMonths: "Ongoing (part of plan)",
      yearlyRate: "Included in subscription",
      included: [
        "Monthly optimization cycles",
        "Technical health monitoring",
        "Keyword ranking updates",
      ],
      notIncluded: [
        "Large-scale content production",
        "Paid link building",
        "Paid media management",
      ],
    },
    transparency:
      "SEO results are not guaranteed — no agency can promise rankings. What we guarantee is consistent, high-quality work every month.",
    cta: {
      heading: "Start ranking today.",
      sub: "The best time to invest in SEO was yesterday. The second best time is now.",
      buttonText: "Start SEO",
      href: "/book-call?category=seo",
    },
  },
];

export const getPricingPage = (slug: string): ServicePricingPage | undefined =>
  pricingPages.find((p) => p.slug === slug);
