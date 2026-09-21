import { env } from 'cloudflare:workers';
export function database() { if (!env.DB)
    throw new Error('Persistent storage is not configured.'); return env.DB; }
export function adminIds() { return ((env as unknown as Record<string, string>).ADMIN_USER_IDS || '').split(',').map(v => v.trim()).filter(Boolean); }
