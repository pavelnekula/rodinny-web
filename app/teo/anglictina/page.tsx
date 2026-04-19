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
    <div className="mx-auto max-w-3xl py-2 sm:py-4">
        <Link
          href="/teo"
          className="text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
        >
          ← Zpět na výuku Tea
        </Link>

        <header className="mt-8 border-b border-app-divider pb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-app-muted">
            English · Animal project
          </p>
          <h1 className="app-title-gradient mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            The giraffe 🦒
          </h1>
          <p className="mt-4 text-lg font-normal leading-relaxed text-app-muted">
            Základní otázky k druhu zvířete – rychlé odpovědi v angličtině (a česky
            pod tím).
          </p>
        </header>

        <div className="app-card mt-10 p-5">
          <p className="text-sm font-semibold text-app-fg">Rychlý přehled</p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed text-app-muted">
            <li>
              <span className="font-medium text-app-fg">Habitat:</span>{" "}
              African savanna & grasslands
            </li>
            <li>
              <span className="font-medium text-app-fg">Food:</span> leaves
              (herbivore)
            </li>
            <li>
              <span className="font-medium text-app-fg">Status:</span>{" "}
              Vulnerable (IUCN)
            </li>
          </ul>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((block) => (
            <section key={block.qEn}>
              <h2 className="text-xl font-semibold tracking-tight text-app-fg">
                {block.qEn}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-app-fg">
                {block.aEn}
              </p>
              <p className="mt-3 border-l-2 border-app-divider pl-4 text-base leading-relaxed text-app-muted">
                {block.cs}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-app-divider pt-8 text-sm text-app-muted">
          <p>
            Tip: Nahlas si přečti český překlad a pak zkus stejnou odpověď říct
            anglicky podle textu nad ním.
          </p>
        </footer>
    </div>
  );
}
