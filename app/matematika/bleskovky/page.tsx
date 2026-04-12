import { BleskovkyGame } from "@/components/matematika/BleskovkyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bleskovky | Matematika",
  description: "Co nejvíc příkladů za minutu.",
};

export default function BleskovkyPage() {
  return <BleskovkyGame />;
}
