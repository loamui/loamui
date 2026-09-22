import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { components, getComponent } from "@/renderer/registry";
import { DocPage } from "@/renderer/components/DocPage";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) return {};
  return {
    title: doc.name,
    description: doc.description,
  };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) notFound();
  return <DocPage doc={doc} />;
}
