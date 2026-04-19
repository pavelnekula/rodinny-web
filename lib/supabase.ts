import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * True, pokud jsou nastavené proměnné prostředí (bezpečné pro build i SSR).
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
);

/* Placeholder jen kvůli importu modulu při buildu bez .env — dotazy vždy chraň přes isSupabaseConfigured. */
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.placeholder";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PLACEHOLDER_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || PLACEHOLDER_KEY;

/**
 * Hlavní Supabase klient (anon klíč).
 * Na produkci musí být nastavené skutečné URL a klíč z dashboardu.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

/**
 * Vrací stejný klient jako `supabase` — po předchozí kontrole `isSupabaseConfigured`.
 * @throws pokud chybí env (aby se omylem nevolal placeholder proti špatnému projektu).
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return supabase;
}
