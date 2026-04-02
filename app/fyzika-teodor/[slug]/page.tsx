import { notFound } from "next/navigation";
import { FYZIKA_TOPICS } from "@/data/fyzika";
import { LectureDoc } from "@/components/fyzika-teodor/LectureDoc";

export function generateStaticParams() {
  return FYZIKA_TOPICS.map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function FyzikaTopicPage({ params }: Props) {
  const { slug } = await params;
  if (!FYZIKA_TOPICS.some((t) => t.slug === slug)) {
    notFound();
  }
  return <LectureDoc slug={slug} />;
}
