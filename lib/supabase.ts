import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * True, pokud jsou nastavené proměnné prostředí.
 * Na Vercelu musí být doplněné v Project Settings → Environment Variables.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
);

let cached: SupabaseClient | null = null;

/**
 * Klient pro veřejné (anon) operace — v Supabase zapni RLS a politiky pro SELECT/INSERT.
 * Nevolat bez `isSupabaseConfigured` — jinak vyhodí výjimku.
 * Lazy init: prázdné URL při buildu na Vercelu bez env dřív shodilo celý build („supabaseUrl is required“).
 */
export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !key) {
    throw new Error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  if (!cached) {
    cached = createClient(url, key);
  }
  return cached;
}
