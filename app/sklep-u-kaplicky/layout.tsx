import { SiteChrome } from "@/components/site/SiteChrome";

export default function SklepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome accent="orange">{children}</SiteChrome>;
}
