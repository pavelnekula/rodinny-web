import { DelitelnostHub } from "@/components/matematika/delitelnost/DelitelnostHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dělitelnost | Matematika",
  description:
    "Procvičování dělitelnosti — 15 kapitol od násobků po olympijské úlohy.",
};

export default function DelitelnostPage() {
  return <DelitelnostHub />;
}
