/**
 * Static FAQ fallback data — 6 unique questions per service category.
 * Used when MongoDB is not configured, or as initial DB seed.
 */

export type StaticFaqCategory =
    | 'general'
    | 'cloud'
    | 'uiux'
    | 'webdev'
    | 'appdev'
    | 'aimodels'
    | 'seo';

interface StaticFaq {
    question: string;
    answer: string;
}

export const STATIC_FAQS: Record<StaticFaqCategory, StaticFaq[]> = {

    /* ── HOME / GENERAL ── */
    general: [
        {
            question: "What services does Disconnect Agencies offer?",
            answer: "We offer end-to-end digital services: UI/UX design, web & app development, AI automation, cloud solutions, SEO, and ongoing product support.",
        },
        {
            question: "How long does a typical project take?",
            answer: "Most projects are delivered in 3–6 weeks depending on scope. We share a clear timeline at the start and keep you updated throughout.",
        },
        {
            question: "Do you work with startups or only enterprise clients?",
            answer: "We work with everyone — from solo founders to enterprise teams. Our packages are designed to scale with your needs and budget.",
        },
        {
            question: "What is your pricing model?",
            answer: "We offer both project-based and monthly retainer pricing. Book a call and we'll recommend the right plan for your goals.",
        },
        {
            question: "Can I cancel or pause my subscription anytime?",
            answer: "Yes. All plans can be paused or cancelled with 7 days' notice. No hidden fees, no lock-in contracts.",
        },
        {
            question: "Will I own all the work delivered?",
            answer: "100%. Once a project is complete and payment is finalized, you receive full ownership of all files, code, and assets.",
        },
    ],

    /* ── CLOUD / AGENCY ── */
    cloud: [
        {
            question: "What cloud platforms do you specialise in?",
            answer: "We design and deploy on AWS, Google Cloud, and Azure — including infrastructure setup, CI/CD pipelines, and serverless architectures.",
        },
        {
            question: "What is your typical cloud project timeline?",
            answer: "Simple tasks take 1–2 weeks; full cloud migrations or custom platforms typically take 3–6 weeks.",
        },
        {
            question: "Can you help migrate an existing system to the cloud?",
            answer: "Yes. We handle lift-and-shift migrations as well as full cloud-native re-architectures, with zero-downtime deployment strategies.",
        },
        {
            question: "How do you ensure the security of our cloud infrastructure?",
            answer: "We follow best practices including IAM role policies, encrypted storage, VPC isolation, and automated security scans in the CI/CD pipeline.",
        },
        {
            question: "Do you provide post-launch cloud support?",
            answer: "Yes. We offer monitoring, alerting, cost optimisation, and ongoing infrastructure maintenance as part of our support plans.",
        },
        {
            question: "How do you approach a new cloud project?",
            answer: "We start with an architecture review, define the right stack, build in stages with weekly demos, and ship with full documentation.",
        },
    ],

    /* ── UI/UX DESIGN ── */
    uiux: [
        {
            question: "Why not just hire a full-time designer?",
            answer: "A subscription gives you senior-level design talent on demand — no recruitment cost, no downtime, no benefits overhead. Pause or cancel anytime.",
        },
        {
            question: "How many design requests can I submit at once?",
            answer: "One active request is worked on at a time, but you can queue unlimited requests. We prioritise speed without sacrificing quality.",
        },
        {
            question: "What tools do your designers use?",
            answer: "Our primary tool is Figma. We also deliver production-ready assets, component libraries, and developer hand-off specs.",
        },
        {
            question: "How fast will I receive my designs?",
            answer: "Most requests are delivered within 24–48 hours. Complex screens or flows may take slightly longer — we always communicate timelines upfront.",
        },
        {
            question: "What if I'm not happy with the design?",
            answer: "We revise until you're 100% satisfied. Unlimited revisions are included in every plan with no extra charge.",
        },
        {
            question: "Do you offer end-to-end product design, from research to handoff?",
            answer: "Yes — from user research and wireframes through high-fidelity UI and developer-ready Figma files, we cover the full design lifecycle.",
        },
    ],

    /* ── WEB DEVELOPMENT ── */
    webdev: [
        {
            question: "What tech stack do you use for web development?",
            answer: "We primarily build with Next.js, TypeScript, and Tailwind CSS. For backends we use Node.js, PostgreSQL, and serverless APIs.",
        },
        {
            question: "Do you build custom CMS websites?",
            answer: "Yes. We build headless CMS solutions using Sanity, Contentful, or custom admin panels so you can manage content without touching code.",
        },
        {
            question: "How do you ensure the website performs well?",
            answer: "We optimise for Core Web Vitals — image optimisation, code splitting, lazy loading, and server-side rendering are built in from day one.",
        },
        {
            question: "Will my website be responsive on all devices?",
            answer: "Every website we build is fully responsive and tested across mobile, tablet, and desktop breakpoints before delivery.",
        },
        {
            question: "Do you work with international clients?",
            answer: "Absolutely. We work async-first and collaborate across time zones. Communication is clear, documented, and always English.",
        },
        {
            question: "What happens after the website goes live?",
            answer: "We offer post-launch support plans covering bug fixes, performance monitoring, content updates, and ongoing feature development.",
        },
    ],

    /* ── APP DEVELOPMENT ── */
    appdev: [
        {
            question: "What platforms do you build apps for?",
            answer: "We build cross-platform apps for iOS and Android using React Native, as well as progressive web apps (PWAs) for browser-based experiences.",
        },
        {
            question: "How long does it take to build a mobile app?",
            answer: "A typical MVP takes 6–10 weeks. Full-featured apps with custom backends, auth, and third-party integrations take 3–5 months.",
        },
        {
            question: "What backend services do you integrate with?",
            answer: "We integrate with Stripe, Firebase, Supabase, REST APIs, GraphQL, and any third-party SDK your product requires.",
        },
        {
            question: "Do you provide app store submission support?",
            answer: "Yes. We handle App Store and Google Play submissions, including screenshots, metadata, and compliance with store guidelines.",
        },
        {
            question: "Who owns the source code after delivery?",
            answer: "You do. All source code is handed over via a private Git repository upon project completion. No lock-in.",
        },
        {
            question: "Do you offer ongoing maintenance after launch?",
            answer: "Yes. We offer monthly retainer plans covering bug fixes, OS update compatibility, performance improvements, and new feature sprints.",
        },
    ],

    /* ── AI MODELS ── */
    aimodels: [
        {
            question: "What types of AI models can you build?",
            answer: "We build custom LLMs, fine-tuned transformers, computer vision pipelines, recommendation engines, NLP classifiers, and AI chatbots.",
        },
        {
            question: "Do I need a large dataset to get started?",
            answer: "Not always. We leverage transfer learning and pre-trained foundation models to achieve excellent results — even with smaller datasets.",
        },
        {
            question: "How do you keep my training data secure?",
            answer: "All data is processed in isolated, encrypted environments. We sign NDAs and follow SOC2-aligned data handling practices.",
        },
        {
            question: "Can the AI model integrate with my existing system?",
            answer: "Yes. We expose models as REST APIs or SDKs, making them easy to embed into any product, dashboard, or workflow.",
        },
        {
            question: "How do you handle model drift as data changes over time?",
            answer: "We set up automated monitoring and scheduled retraining pipelines to ensure your model stays accurate as real-world data evolves.",
        },
        {
            question: "What is the difference between fine-tuning and prompt engineering?",
            answer: "Prompt engineering customises behaviour without retraining — it's fast and cheap. Fine-tuning trains the model on your data for deeper, more consistent domain-specific performance.",
        },
    ],

    /* ── SEO ── */
    seo: [
        {
            question: "How long does SEO take to show results?",
            answer: "Most clients see meaningful ranking improvements within 3–6 months. Competitive niches may take longer, but gains compound over time.",
        },
        {
            question: "What does your SEO service include?",
            answer: "Technical audits, on-page optimisation, content strategy, keyword research, backlink building, and monthly performance reports.",
        },
        {
            question: "Do you guarantee first-page rankings?",
            answer: "No ethical agency can guarantee specific rankings. What we guarantee is transparent, white-hat strategy that consistently grows organic traffic.",
        },
        {
            question: "Do you create SEO content for us?",
            answer: "Yes. We produce SEO-optimised blog posts, landing pages, metadata, and schema markup as part of our content packages.",
        },
        {
            question: "Do you work with e-commerce sites?",
            answer: "Absolutely. We specialise in Shopify, WooCommerce, and custom e-commerce SEO — from category page optimisation to product schema markup.",
        },
        {
            question: "How is your SEO reporting structured?",
            answer: "Every month you receive a clear report covering keyword rankings, organic traffic, backlink growth, Core Web Vitals, and next-month priorities.",
        },
    ],
};
