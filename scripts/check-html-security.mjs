// Fails if any HTML page is missing the CSP/referrer meta tags, contains inline
// scripts or on*= handlers, or has target="_blank" links without rel="noopener".
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKIP = new Set(['.git', 'node_modules', '.vercel']);
const files = [];
(function walk(dir) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name)) continue;
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (name.endsWith('.html')) files.push(p);
    }
})('.');

const problems = [];
for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const fail = msg => problems.push(`${file}: ${msg}`);
    if (!/<meta http-equiv="Content-Security-Policy" content="[^"]*script-src 'self';/.test(html)) fail('missing CSP meta tag');
    if (!/<meta name="referrer"/.test(html)) fail('missing referrer meta tag');
    if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) fail('inline <script> block');
    if (/\son[a-z]+\s*=\s*["']/i.test(html)) fail('inline on* event handler');
    for (const a of html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) || []) {
        if (!/rel="[^"]*noopener/.test(a)) fail(`target="_blank" without rel="noopener": ${a.slice(0, 80)}`);
    }
}

if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
}
console.log(`HTML security check passed (${files.length} files)`);
