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

function createSupabaseAdminClient() {
  const rawUrl = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);
  const rawServiceKey =
    process.env['SUPABASE_SERVICE_ROLE_KEY'] ||
    process.env['SUPABASE_PUBLISHABLE_KEY'] ||
    process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
    DEFAULT_SUPABASE_KEY;
  const SUPABASE_KEY = rawServiceKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
