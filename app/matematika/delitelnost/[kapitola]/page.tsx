import { DelitelnostSession } from "@/components/matematika/delitelnost/DelitelnostSession";
import { KAPITOLY, getKapitola, type KapitolaId } from "@/data/delitelnost";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const IDS = new Set<string>(KAPITOLY.map((k) => k.id));

export function generateStaticParams(): { kapitola: string }[] {
  return KAPITOLY.map((k) => ({ kapitola: k.id }));
}

type PageProps = { params: Promise<{ kapitola: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { kapitola } = await params;
  const k = getKapitola(kapitola);
  if (!k) return { title: "Kapitola | Dělitelnost" };
  return {
    title: `${k.nazev} | Dělitelnost`,
    description: k.popis,
  };
}

export default async function DelitelnostKapitolaPage({ params }: PageProps) {
  const { kapitola } = await params;
  if (!IDS.has(kapitola)) notFound();
  return <DelitelnostSession kapitolaId={kapitola as KapitolaId} />;
}
