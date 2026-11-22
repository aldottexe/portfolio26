// scripts/index.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const { EMBED_URL, CF_CLIENT_ID, CF_CLIENT_SECRET } = process.env;
const DIR = 'content';
const OUT = 'src/lib/chunks.json';
const MAX_CHARS = 800;
const BATCH = 16;

// Split on blank lines, then merge small paragraphs up to MAX_CHARS
function chunk(text) {
   const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
   const out = [];
   let cur = '';
   for (const p of paras) {
      if (cur && (cur + '\n\n' + p).length > MAX_CHARS) {
         out.push(cur);
         cur = p;
      } else {
         cur = cur ? cur + '\n\n' + p : p;
      }
   }
   if (cur) out.push(cur);
   return out;
}

async function embed(texts) {
   const res = await fetch(`${EMBED_URL}/embed`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'CF-Access-Client-Id': CF_CLIENT_ID,
         'CF-Access-Client-Secret': CF_CLIENT_SECRET
      },
      body: JSON.stringify({ inputs: texts })
   });
   if (!res.ok) throw new Error(`Embed failed: ${res.status} ${await res.text()}`);
   return res.json();
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.md'));
const pieces = [];
for (const f of files) {
   const text = await readFile(path.join(DIR, f), 'utf8');
   for (const c of chunk(text)) pieces.push({ source: f, text: c });
}

const result = [];
for (let i = 0; i < pieces.length; i += BATCH) {
   const batch = pieces.slice(i, i + BATCH);
   // No query prefix here: that's only for search queries, not stored chunks
   const vectors = await embed(batch.map((p) => p.text));
   batch.forEach((p, j) =>
      result.push({ ...p, vector: vectors[j].map((x) => Math.round(x * 1e5) / 1e5) })
   );
   console.log(`Embedded ${Math.min(i + BATCH, pieces.length)}/${pieces.length}`);
}

await writeFile(OUT, JSON.stringify(result));
console.log(`Wrote ${result.length} chunks to ${OUT}`);
