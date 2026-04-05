import { QuizDuelApp } from "@/components/tinuska/anglictina/modes/QuizDuelApp";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Kvízový souboj | Angličtina Tinuška",
  description: "Rychlý kvíz s časem a streakem.",
};

export default function KvizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[#ffffff] text-[#6b7280]">
          Načítání…
        </div>
      }
    >
      <QuizDuelApp />
    </Suspense>
  );
}
