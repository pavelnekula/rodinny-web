import { SiteChrome } from "@/components/site/SiteChrome";

export default function TeodorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome accent="purple">{children}</SiteChrome>;
}
