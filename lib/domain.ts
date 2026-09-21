import { z } from 'zod';
export const categories = ['All', 'Everyday life', 'Work', 'Travel', 'Money', 'Learning', 'Building'] as const;
export type Entry = {
    id: string;
    kind: 'connector' | 'workflow' | 'request';
    title: string;
    description: string;
    category: string;
    author: string;
    body: string;
    protocol: string;
    endpoint: string;
    docsUrl: string;
    auth: string;
    permissions: string;
    privacyUrl: string;
    termsUrl: string;
    supportUrl: string;
    status: string;
    createdAt: string;
    votes: number;
    comments: number;
    saved: boolean;
    voted: boolean;
    owned: boolean;
    source: string;
};
export type Viewer = {
    signedIn: boolean;
    admin: boolean;
};
const publicUrl = z.string().max(2048).refine(v => { try {
    const u = new URL(v);
    return u.protocol === 'https:' && !u.username && !u.password && !u.search && !u.hash && !['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
}
catch {
    return false;
} }, 'Use an HTTPS URL without credentials, query parameters, or fragments.');
const optionalUrl = z.union([z.literal(''), publicUrl]);
export const entryInput = z.object({ kind: z.enum(['connector', 'workflow', 'request']), title: z.string().trim().min(5).max(100), description: z.string().trim().min(15).max(300), category: z.enum(['Everyday life', 'Work', 'Travel', 'Money', 'Learning', 'Building']), author: z.string().trim().min(2).max(40), body: z.string().trim().min(20).max(6000), protocol: z.enum(['MCP', 'OpenAPI', 'Prompt']).default('Prompt'), endpoint: optionalUrl.default(''), docsUrl: optionalUrl.default(''), auth: z.enum(['None', 'OAuth', 'API key', 'Other']).default('None'), permissions: z.string().trim().max(1000).default(''), privacyUrl: optionalUrl.default(''), termsUrl: optionalUrl.default(''), supportUrl: optionalUrl.default('') }).strict().superRefine((v, ctx) => { if (v.kind === 'connector') {
    for (const field of ['endpoint', 'docsUrl', 'permissions'] as const) {
        if (!v[field])
            ctx.addIssue({ code: 'custom', path: [field], message: 'Required for a connector.' });
    }
    if (v.protocol === 'Prompt')
        ctx.addIssue({ code: 'custom', path: ['protocol'], message: 'Choose MCP or OpenAPI.' });
} });
export const interactionInput = z.object({ entryId: z.string().min(1).max(100), type: z.enum(['save', 'vote']), active: z.boolean() }).strict();
export const commentInput = z.object({ entryId: z.string().min(1).max(100), author: z.string().trim().min(2).max(40), body: z.string().trim().min(2).max(1500) }).strict();
export const moderationInput = z.object({ id: z.string().min(1).max(100), status: z.enum(['published', 'rejected']) }).strict();
export function filterEntries(entries: Entry[], q = '', category = 'All', kind = 'all') { const query = q.toLowerCase().trim(); return entries.filter(e => (kind === 'all' || e.kind === kind) && (category === 'All' || e.category === category) && (!query || [e.title, e.description, e.category, e.protocol, e.author].join(' ').toLowerCase().includes(query))); }
export function submissionPacket(entry: Partial<Entry>) { return { format: 'muse-community-submission-draft', version: 1, approvalStatus: 'Not submitted to Muse; independent draft', overview: { connectorName: entry.title, developer: entry.author, description: entry.description, examplePrompt: entry.body }, technical: { connectionType: entry.protocol, apiUrl: entry.endpoint, documentation: entry.docsUrl, authentication: entry.auth, accessRequirements: entry.permissions }, policies: { privacy: entry.privacyUrl, terms: entry.termsUrl, support: entry.supportUrl }, manualSteps: ['Verify current official Muse submission requirements.', 'Provide publisher contact and a 512×512 icon if required.', 'Complete provider authentication and permissions testing.', 'Submit through the official review process; retain evidence before claiming approval.'] }; }
export function importOpenAPI(value: unknown) { const doc = z.object({ openapi: z.string().startsWith('3.'), info: z.object({ title: z.string().max(100), description: z.string().optional() }), servers: z.array(z.object({ url: publicUrl })).min(1), paths: z.record(z.unknown()).optional() }).passthrough().parse(value); return { title: doc.info.title, description: (doc.info.description || '').slice(0, 300), endpoint: doc.servers[0].url, protocol: 'OpenAPI' as const }; }
