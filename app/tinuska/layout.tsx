import { SiteChrome } from "@/components/site/SiteChrome";

export default function TinuskaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome accent="purple">{children}</SiteChrome>;
}
