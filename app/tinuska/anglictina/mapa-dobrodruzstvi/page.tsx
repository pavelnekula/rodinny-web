import { AdventureMapApp } from "@/components/tinuska/anglictina/modes/AdventureMapApp";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mapa dobrodružství | Angličtina Tinuška",
  description: "Šplhej na horu slovíček podle kategorie.",
};

export default function MapaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-[#ffffff] text-[#6b7280]">
          Načítání…
        </div>
      }
    >
      <AdventureMapApp />
    </Suspense>
  );
}
