// src/lib/cityIntroTemplates.ts

export const cityIntroTemplates: Record<string, (city: string) => string> = {
  Cloud: (city) =>
    `Disconnect delivers enterprise-grade cloud infrastructure for businesses across ${city}. 
     From CI/CD pipelines to auto-scaling systems and cloud security — our team builds 
     cloud solutions that help ${city}-based teams ship faster and scale without limits.`,

  WebDevelopment: (city) =>
    `Looking for a web development partner in ${city}? Disconnect builds responsive, 
     SEO-ready websites and full-stack web applications tailored for businesses in ${city}. 
     From landing pages to complex platforms — we deliver on time, every time.`,

  AppDevelopment: (city) =>
    `Disconnect helps startups and enterprises in ${city} design, build, and launch 
     high-performance iOS, Android, and cross-platform mobile apps. From MVP to 
     production-ready — we handle everything so your ${city} team can focus on growth.`,

  AIModels: (city) =>
    `Businesses in ${city} are automating smarter with Disconnect. We build custom AI 
     systems, workflow automation, and intelligent agents that eliminate manual work and 
     accelerate decision-making for ${city}-based teams across every industry.`,

  SEO: (city) =>
    `Disconnect helps brands in ${city} cut through search noise and achieve consistent 
     organic visibility. Our data-driven SEO process — from technical audits to content 
     authority — is built to deliver measurable, long-term results for ${city} businesses.`,

  Uiux: (city) =>
    `From wireframes to full design systems — Disconnect delivers professional UI/UX design 
     for product teams in ${city}. Unlimited revisions, fast delivery, and a flat rate 
     that replaces expensive freelancers for ${city}-based startups and enterprises.`,
};
