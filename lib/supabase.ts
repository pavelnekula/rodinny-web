import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True, pokud jsou nastavené proměnné prostředí (jinak stránka zobrazí upozornění). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Klient pro veřejné (anon) operace — v Supabase zapni RLS a politiky pro SELECT/INSERT.
 * S prázdným URL/klíčem nevolaj `.from()` (vrací chybu); použij `isSupabaseConfigured`.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
