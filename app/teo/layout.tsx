import { SiteChrome } from "@/components/site/SiteChrome";

export default function TeoLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome accent="green">{children}</SiteChrome>;
}
