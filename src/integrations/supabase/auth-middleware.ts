import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
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

function readEnv(key: string): string | undefined {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv && metaEnv[key]) return metaEnv[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return undefined;
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const rawUrl = readEnv('VITE_SUPABASE_URL') || readEnv('SUPABASE_URL');
    const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);

    const rawKey =
      readEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
      readEnv('SUPABASE_PUBLISHABLE_KEY') ||
      readEnv('VITE_SUPABASE_ANON_KEY') ||
      readEnv('SUPABASE_ANON_KEY') ||
      DEFAULT_SUPABASE_KEY;
    const SUPABASE_PUBLISHABLE_KEY = rawKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

    const request = getRequest();

    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      throw new Error('Unauthorized: No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    if (token.split('.').length !== 3) {
      throw new Error('Unauthorized: Invalid token');
    }

    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error('Unauthorized: Invalid token');
    }

    if (!data.claims.sub) {
      throw new Error('Unauthorized: No user ID found in token');
    }

    return next({
      context: {
        supabase,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  },
);
