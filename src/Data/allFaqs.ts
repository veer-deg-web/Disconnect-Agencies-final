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
            question: "Who is Disconnect Agencies for?",
            answer: "We partner with visionary founders, growing startups, and established enterprises looking to elevate their digital presence through design, development, and AI.",
        },
        {
            question: "How do we communicate during a project?",
            answer: "We set up a dedicated Slack/Discord channel for your team. You'll get weekly async updates, transparent progress tracking, and direct access to the team working on your product.",
        },
        {
            question: "Do you offer post-launch support and maintenance?",
            answer: "Absolutely. We provide dedicated retainer plans to keep your digital products updated, secure, and continuously improving after the initial launch.",
        },
        {
            question: "What makes your approach different?",
            answer: "We combine high-end design aesthetics with robust engineering and cutting-edge AI. We don't just build, we strategize and partner with you for long-term success.",
        },
        {
            question: "Can we hire you for just design or just development?",
            answer: "Yes! While we love end-to-end projects, our modular services mean you can hire us strictly for UI/UX, Web Dev, or any specialized service like AI integration.",
        },
        {
            question: "How do we get started?",
            answer: "Simply book a discovery call. We'll discuss your goals, do a quick audit of your current setup, and provide a tailored proposal and roadmap.",
        },
    ],

    cloud: [
        {
            question: "Why should we migrate our infrastructure to the cloud?",
            answer: "Cloud migration offers unparalleled scalability, reduced hardware maintenance costs, enhanced disaster recovery, and the ability to deploy applications globally with minimal latency.",
        },
        {
            question: "Which cloud providers do you work with?",
            answer: "Our team has deep expertise in architecting and managing infrastructure on Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure.",
        },
        {
            question: "Can you help optimize our current cloud spending?",
            answer: "Yes! Cloud cost optimization is one of our specialties. We run thorough audits to identify underutilized resources, optimize instance types, and implement auto-scaling to lower your monthly bills.",
        },
        {
            question: "How do you handle data security in the cloud?",
            answer: "Security is built-in, not bolted on. We implement zero-trust architectures, end-to-end encryption, regular vulnerability scanning, and strict identity and access management (IAM) protocols.",
        },
        {
            question: "Do you set up CI/CD pipelines?",
            answer: "Absolutely. We automate your software delivery process with robust Continuous Integration and Continuous Deployment (CI/CD) pipelines using tools like GitHub Actions, GitLab CI, or Jenkins.",
        },
        {
            question: "What is your approach to serverless architecture?",
            answer: "We highly recommend serverless (like AWS Lambda or Vercel) for workloads with variable traffic. It minimizes operational overhead and ensures you only pay for the compute time you actually use.",
        },
    ],

    /* ── UI/UX DESIGN ── */
    uiux: [
        {
            question: "What is your design process like?",
            answer: "We start with deep discovery and wireframing, move into high-fidelity UI design, and finish with interactive prototyping and thorough developer handoff.",
        },
        {
            question: "Do you do user research and usability testing?",
            answer: "Yes, we believe great design is data-driven. We conduct user interviews, competitor analysis, and usability tests to ensure intuitive experiences.",
        },
        {
            question: "Can you redesign our existing application?",
            answer: "Definitely. We often take outdated platforms and completely revamp their user experience and visual interface to increase engagement and conversion rates.",
        },
        {
            question: "Do you provide design systems?",
            answer: "Every major project includes a comprehensive design system in Figma. This ensures consistency, speeds up development, and makes future updates seamless.",
        },
        {
            question: "What deliverables will I receive?",
            answer: "You'll get organized Figma files, interactive prototypes, exportable assets, and a documented design system ready for your developers to implement.",
        },
        {
            question: "How do you handle feedback and revisions?",
            answer: "We work collaboratively. During design sprints, we present concepts and gather your feedback, refining the designs until they perfectly align with your vision.",
        },
    ],

    webdev: [
        {
            question: "Do you build custom websites or use templates?",
            answer: "We build 100% custom, bespoke web applications tailored specifically to your brand's unique needs and performance goals. We do not rely on pre-made themes.",
        },
        {
            question: "What technologies do you use for frontend development?",
            answer: "We specialize in modern, high-performance frameworks like React, Next.js, and Vue.js, paired with Tailwind CSS for rapid, scalable styling and Framer Motion for premium animations.",
        },
        {
            question: "How do you ensure my website performs well?",
            answer: "We optimize everything from day one: server-side rendering (SSR), static site generation (SSG), lazy-loading images, edge caching, and strict adherence to Google's Core Web Vitals.",
        },
        {
            question: "Is eCommerce development included in your services?",
            answer: "Yes! We build highly scalable headless eCommerce solutions using Shopify Plus, Medusa, or completely custom Node.js/PostgreSQL backends tailored to high-volume sales.",
        },
        {
            question: "Can I update the website content myself?",
            answer: "Yes, we integrate user-friendly Headless CMS platforms (like Sanity, Strapi, or Contentful) so your marketing team can update text, images, and blogs without knowing how to code.",
        },
        {
            question: "Do you provide website hosting?",
            answer: "While we don't act as a traditional hosting company, we handle the complete deployment and management of your application on premium platforms like Vercel, AWS, or DigitalOcean.",
        },
    ],

    appdev: [
        {
            question: "Do you build natively for iOS and Android?",
            answer: "We use React Native and Expo to build high-performance, cross-platform applications. This allows us to maintain a single codebase for both iOS and Android, saving you time and money without sacrificing quality.",
        },
        {
            question: "Can you help bring my app idea to life from scratch?",
            answer: "Absolutely. We offer end-to-end product development: starting from user research and wireframing, to UX/UI design, development, and finally deployment to the App Store and Google Play.",
        },
        {
            question: "What backend do you use for mobile apps?",
            answer: "We typically pair our mobile apps with scalable backends using Node.js, PostgreSQL, and GraphQL, or robust Backend-as-a-Service (BaaS) platforms like Supabase or Firebase depending on your product's scale.",
        },
        {
            question: "How do you handle app updates and bug fixes?",
            answer: "Through our retainer plans, we provide continuous maintenance, ensuring your app stays compatible with the latest iOS and Android OS updates while rapidly addressing any user-reported bugs.",
        },
        {
            question: "Will you handle the App Store submission process?",
            answer: "Yes, we handle the entire submission, review, and approval process for both the Apple App Store and Google Play, ensuring all compliance and metadata requirements are perfectly met.",
        },
        {
            question: "Do you build Progressive Web Apps (PWAs)?",
            answer: "Yes. If your business model benefits more from a browser-accessible app that feels native (offline support, push notifications), we can architect an incredibly fast PWA as an alternative to store deployment.",
        },
    ],

    aimodels: [
        {
            question: "Can you build a custom AI chatbot for our internal data?",
            answer: "Yes! We specialize in Retrieval-Augmented Generation (RAG) systems. We can securely connect LLMs to your private Notion, Google Drive, or custom databases so your team can chat with your own data.",
        },
        {
            question: "Are you utilizing OpenAI exclusively?",
            answer: "No, we are model-agnostic. While we frequently utilize OpenAI's GPT-4, we also build and fine-tune open-source models using HuggingFace, Llama 3, and Mistral depending on your privacy, cost, and performance requirements.",
        },
        {
            question: "How do you ensure AI outputs are reliable?",
            answer: "We implement rigorous evaluation frameworks, strict system prompts, and output guardrails to minimize hallucinations and ensure the AI's responses are deterministic, safe, and aligned with your brand guidelines.",
        },
        {
            question: "Can AI help automate our business workflows?",
            answer: "Absolutely. We build autonomous agents and complex automation pipelines that can read emails, process invoices, summarize meetings, and trigger actions in your existing CRM or project management tools.",
        },
        {
            question: "Do you offer computer vision or image generation services?",
            answer: "Yes, beyond text/LLMs, we integrate advanced computer vision models for object detection and tracking, as well as fine-tuned Stable Diffusion models for custom, automated image generation.",
        },
        {
            question: "How much does it cost to run a custom AI model?",
            answer: "Costs vary heavily based on usage and architecture. API-based models (like OpenAI) are pay-per-token, while self-hosted open-source models incur fixed GPU hosting costs. We will architect the most cost-efficient path for your scale.",
        },
    ],

    seo: [
        {
            question: "Why do I need specialized SEO services?",
            answer: "Having a beautiful website isn't enough if users can't find it. Specialized SEO ensures your site ranks highly for high-intent keywords, driving organic, sustainable traffic that converts into paying customers.",
        },
        {
            question: "What is the difference between On-Page and Technical SEO?",
            answer: "On-Page SEO involves optimizing your content, keywords, and meta tags. Technical SEO focuses on the backend: site speed, mobile responsiveness, XML sitemaps, and ensuring search engines can flawlessly crawl your site.",
        },
        {
            question: "Do you offer backlink building?",
            answer: "Yes. We execute strategic, white-hat outreach campaigns to secure high-quality backlinks from authoritative domains in your industry, significantly boosting your domain authority.",
        },
        {
            question: "How do you track and report SEO progress?",
            answer: "We provide totally transparent, custom analytics dashboards. You'll receive monthly reports detailing your keyword ranking improvements, organic traffic growth, and conversion metrics.",
        },
        {
            question: "Can you recover my site from a Google penalty?",
            answer: "Yes. If your traffic has suddenly dropped due to an algorithmic update or manual penalty, we perform deep diagnostic audits to identify the root cause and execute a comprehensive recovery strategy.",
        },
        {
            question: "Is Local SEO included in your services?",
            answer: "Absolutely. For brick-and-mortar businesses or service areas, we optimize your Google Business Profile, manage local citations, and generate geo-targeted content to ensure you dominate local search results.",
        },
    ],
};
