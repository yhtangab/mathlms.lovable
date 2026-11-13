import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://mbyselvthprrfjioyvhu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_6d4BjM4FHDurcIw2BhpeaQ_hsYnu4Ju';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function normalizeSupabaseUrl(rawUrl: string | undefined): string {
  const cleaned = (rawUrl ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return DEFAULT_SUPABASE_URL;
  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    return parsed.origin;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function getEnvVar(key: string): string | undefined {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv && metaEnv[key]) return metaEnv[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return undefined;
}

function createSupabaseClient() {
  const rawUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
  const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);

  const rawKey =
    getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('VITE_SUPABASE_ANON_KEY') ||
    getEnvVar('SUPABASE_ANON_KEY') ||
    DEFAULT_SUPABASE_KEY;
  const SUPABASE_PUBLISHABLE_KEY = rawKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
      },
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
