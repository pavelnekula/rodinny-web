import type { Metadata } from "next";
import Link from "next/link";
import { WineOrderForm } from "@/components/sklep-u-kaplicky/WineOrderForm";

/**
 * Údaje převzaté z Google Map (profil místa po přesměrování z krátkého odkazu).
 * Krátký odkaz: https://maps.app.goo.gl/qEx7BNZjUKY4hXLp6
 * Úplná adresa stránky místa (pro otevření v prohlížeči / sdílení):
 */
const MAPS_SHORT_URL = "https://maps.app.goo.gl/qEx7BNZjUKY4hXLp6";
const MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Sklep+U+Kapli%C4%8Dky/@48.7643234,16.0777828,17z/data=!3m1!4b1!4m6!3m5!1s0x476d519073047747:0x8694bf2b27237de7!8m2!3d48.7643234!4d16.0803631!16s%2Fg%2F11shcz11kl";

/** Název místa tak, jak je uveden na Google Mapách */
const PLACE_TITLE_GOOGLE = "Sklep U Kapličky";

/** Souřadnice středu značky z Google Map (parametry !8m2!3d !4d v URL místa) */
const LAT = 48.7643234;
const LNG = 16.0803631;

/**
 * Adresa podle polohy značky (reverzní geokód OpenStreetMap Nominatim u souřadnic výše).
 * Jedná se o nejbližší adresní bod k bodu z Map, nikoli o oficiální údaj z Google.
 */
const ADDRESS_LINES = [
  "Dyjákovičky ev. č. 40",
  "669 02 Dyjákovičky",
  "okres Znojmo, Jihomoravský kraj, Česko",
] as const;

/** Vložená mapa (stejný střed jako značka na Mapách) */
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${LAT},${LNG}&z=17&hl=cs&ie=UTF8&output=embed`;

export const metadata: Metadata = {
  title: "Sklep u Kapličky | Rodinný web",
  description: `${PLACE_TITLE_GOOGLE} – Dyjákovičky u Znojma. Mapa a odkazy na Google Mapy.`,
};

const infoCard =
  "app-card app-card-interactive p-6 transition-transform hover:-translate-y-0.5";

export default function SklepUKaplickyPage() {
  return (
    <div className="mx-auto max-w-3xl py-2 sm:py-4">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-app-accent underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
          aria-label="Zpět na hlavní stránku"
        >
          ← Zpět domů
        </Link>

        <header className="mt-10 border-b border-app-divider pb-10 sm:mt-12 sm:pb-12">
          <h1 className="app-title-gradient text-4xl font-bold tracking-[-0.05em] sm:text-5xl md:text-6xl md:tracking-[-0.08em]">
            Sklep u Kapličky 🏚️
          </h1>
          <p className="mt-6 text-xl font-normal leading-relaxed text-app-muted sm:text-2xl">
            Naše oblíbené místo
          </p>
        </header>

        <article className="mt-14 border-t border-app-divider pt-14 sm:mt-16 sm:pt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-app-fg">
            Historie místa
          </h2>
          <div className="mt-8 space-y-6 text-lg font-light leading-[1.75] text-app-muted">
            <p>
              Zde bude příběh místa – kdy vzniklo, kdo ho postavil, jaké má pro
              nás místo v srdci…
            </p>
            <p className="text-base">
              Podle záznamu na{" "}
              <a
                href={MAPS_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-app-accent underline-offset-2 hover:underline"
              >
                Google Mapách
              </a>{" "}
              se místo jmenuje „{PLACE_TITLE_GOOGLE}“ a leží u obce Dyjákovičky
              v okrese Znojmo (souřadnice středu značky {LAT}, {LNG}).
            </p>
          </div>
        </article>

        <section className="mt-16 border-t border-app-divider pt-16 sm:mt-20 sm:pt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-app-fg">
            Praktické informace
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-app-muted">
            Níže jsou údaje zkopírované z polohy a názvu místa na Google Mapách;
            adresu doplňuje odhad z mapy okolí (OpenStreetMap). Kontakt, otevírací
            dobu a fotky v plné kvalitě máš vždy aktuální v profilu na Mapách.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>📍</span> Název (Google Mapy)
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                {PLACE_TITLE_GOOGLE}
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>📍</span> Adresa (podle polohy značky)
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                {ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>🧭</span> GPS (střed značky z Google Map)
              </p>
              <p className="mt-2 font-mono text-sm font-light text-app-muted">
                {LAT}, {LNG}
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>🚗</span> Příjezd
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                Zadej do navigace „{PLACE_TITLE_GOOGLE}“ nebo souřadnice{" "}
                {LAT}, {LNG}. Detail trasy a parkování ověř v aplikaci{" "}
                <a
                  href={MAPS_SHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-app-accent underline-offset-2 hover:underline"
                >
                  Google Mapy
                </a>
                .
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>📞</span> Kontakt
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                Telefon, e-mail a web (pokud jsou u místa vyplněné) jsou v profilu
                na{" "}
                <a
                  href={MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-app-accent underline-offset-2 hover:underline"
                >
                  této stránce místa
                </a>{" "}
                – otevři odkaz a rozklikni sekci kontaktu.
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>🕐</span> Otevírací doba
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                Aktuální hodiny (pokud je provozovatel v Mapách vyplnil) najdeš u
                profilu místa po kliknutí na odkaz níže – na web je nelze spolehlivě
                přenést bez pravidelné aktualizace.
              </p>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>🗺️</span> Mapa (vložená)
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-app-muted">
                Stejné středové souřadnice jako značka na Google Mapách.
              </p>
              <div className="mt-4 overflow-hidden rounded-[12px] border border-app-border">
                <iframe
                  title="Mapa – Sklep u Kapličky (střed podle Google Map)"
                  src={MAP_EMBED_SRC}
                  className="h-[min(50vh,22rem)] w-full sm:h-[26rem]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </li>

            <li className={infoCard}>
              <p className="text-sm font-medium text-app-fg">
                <span aria-hidden>🖼️</span> Fotky
              </p>
              <p className="mt-2 font-light leading-relaxed text-app-muted">
                Fotografie z profilu místa (uživatelské i oficiální) Google
                neumožňuje vložit na web jako statické soubory bez API klíče –
                zobrazíš je po otevření místa v Mapách (záložka s fotkami u
                profilu).
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a
                  href={MAPS_SHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit text-sm font-medium text-app-accent underline-offset-2 hover:underline"
                >
                  Krátký odkaz (sdílení) →
                </a>
                <a
                  href={MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit text-sm font-medium text-app-accent underline-offset-2 hover:underline"
                >
                  Úplná stránka místa v Mapách →
                </a>
              </div>
            </li>
          </ul>
        </section>

        <section className="mt-16 border-t border-app-divider pt-16 sm:mt-20 sm:pt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-app-fg">
            Objednat víno
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-app-muted">
            Vyberte vína a typ lahví, způsob dopravy a kontakt. Cena se přepočítá
            automaticky.
          </p>
          <WineOrderForm />
        </section>
    </div>
  );
}
