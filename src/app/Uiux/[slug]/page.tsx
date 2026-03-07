import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seoCities } from "@/Data/seoCities";
import { buildCitySeo } from "@/lib/citySeo";
import UIUXPage from "../page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const serviceSlug = "ui-ux-design";
const serviceName = "UI UX Design";

export function generateStaticParams(): { slug: string }[] {
  return seoCities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return (
    buildCitySeo({ serviceSlug, serviceName, citySlug: slug })?.metadata ?? {
      title: "Page Not Found | Disconnect",
      robots: { index: false, follow: false },
    }
  );
}

export default async function UiuxCityPage({ params }: PageProps) {
  const { slug } = await params;
  const seo = buildCitySeo({ serviceSlug, serviceName, citySlug: slug });
  if (!seo) notFound();

  return (
    <>
      {seo.schemas.map((schema, index) => (
        <script
          key={`seo-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <section className="sr-only">
        <h1>Leading {serviceName.toLowerCase()} company in {seo.city.name}</h1>
        <h2>City-focused technology delivery</h2>
        <p>
          Disconnect helps businesses in {seo.city.name} build scalable digital products including high-performance
          websites, mobile apps, SaaS platforms, and AI integrations.
        </p>
      </section>
      <UIUXPage />
    </>
  );
}

export const dynamicParams = true;
