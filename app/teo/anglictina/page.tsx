import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Angličtina – žirafa | Teo",
  description:
    "Základní otázky o druhu zvířete: žirafa – habitat, potrava, ohrožení.",
};

const sections = [
  {
    qEn: "What animal did you choose?",
    aEn:
      "I chose the giraffe. It is the tallest land animal in the world and it has a very long neck and long legs.",
    cs: "Vybral jsem žirafu. Je to nejvyšší suchozemské zvíře, má velmi dlouhý krk a nohy.",
  },
  {
    qEn: "Where does it live?",
    aEn:
      "Giraffes live in Africa. They like open grasslands and savannas with trees, especially acacia trees.",
    cs: "Žijí v Africe. Vyhovují jim otevřené savany a trávníky se stromy, hlavně akácie.",
  },
  {
    qEn: "What does it eat?",
    aEn:
      "Giraffes are herbivores. They eat mostly leaves, buds, and twigs from tall trees. They use their long tongue to pull leaves from branches.",
    cs: "Jsou býložravci. Jedí hlavně listy, pupeny a větvičky z vysokých stromů. Dlouhým jazykem si trhají listy.",
  },
  {
    qEn: "How is it threatened?",
    aEn:
      "The giraffe is vulnerable. That means it is at risk. Big problems are losing habitat (fewer trees and space), illegal hunting, and drought. People work to protect giraffes in national parks and reserves.",
    cs: "Žirafa je ohrožený druh (kategorie zranitelná). Hrozí jí úbytek prostředí, pytláctví a sucho. Chrání se v národních parcích a rezervacích.",
  },
] as const;

export default function TeoAnglictinaPage() {
  return (
    <div className="min-h-full bg-[#ffffff] text-[#1a1a1a]">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <Link
          href="/teo"
          className="text-sm font-medium text-[#3b82f6] underline-offset-4 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
        >
          ← Zpět na výuku Tea
        </Link>

        <header className="mt-8 border-b border-[#e5e7eb] pb-10">
          <p className="text-sm font-medium uppercase tracking-wide text-[#6b7280]">
            English · Animal project
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The giraffe 🦒
          </h1>
          <p className="mt-4 text-lg font-light leading-relaxed text-[#6b7280]">
            Základní otázky k druhu zvířete – rychlé odpovědi v angličtině (a česky
            pod tím).
          </p>
        </header>

        <div className="mt-10 rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#1a1a1a]">Rychlý přehled</p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed text-[#6b7280]">
            <li>
              <span className="font-medium text-[#1a1a1a]">Habitat:</span>{" "}
              African savanna & grasslands
            </li>
            <li>
              <span className="font-medium text-[#1a1a1a]">Food:</span> leaves
              (herbivore)
            </li>
            <li>
              <span className="font-medium text-[#1a1a1a]">Status:</span>{" "}
              Vulnerable (IUCN)
            </li>
          </ul>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((block) => (
            <section key={block.qEn}>
              <h2 className="text-xl font-semibold tracking-tight text-[#1a1a1a]">
                {block.qEn}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#1a1a1a]">
                {block.aEn}
              </p>
              <p className="mt-3 border-l-2 border-[#e5e7eb] pl-4 text-base leading-relaxed text-[#6b7280]">
                {block.cs}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-[#e5e7eb] pt-8 text-sm text-[#6b7280]">
          <p>
            Tip: Nahlas si přečti český překlad a pak zkus stejnou odpověď říct
            anglicky podle textu nad ním.
          </p>
        </footer>
      </div>
    </div>
  );
}
