import type { Metadata } from "next";
import { SiteChrome } from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Fyzika pro Teodora | Nekulovi",
  description:
    "Výuka fyziky pro prima osmiletého gymnázia — výklad, cvičení, pexeso, převody jednotek.",
};

export default function FyzikaTeodorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome accent="green">{children}</SiteChrome>;
}
