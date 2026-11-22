// src/routes/api/chat/+server.ts
import { json, error } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import {
   ANTHROPIC_API_KEY, EMBED_URL, CF_CLIENT_ID, CF_CLIENT_SECRET
} from '$env/static/private';
import chunks from '$lib/chunks.json'; // [{ text: string, vector: number[] }]
import type { RequestHandler } from './$types';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const QUERY_PREFIX = 'Represent this sentence for searching relevant passages: ';
const UNSURE_MESSAGE = `Sorry, I'm not too sure about that one. Feel free to check with regular Alex at me@alexlutz.com`;

async function embed(text: string): Promise<number[]> {
   const res = await fetch(`${EMBED_URL}/embed`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'CF-Access-Client-Id': CF_CLIENT_ID,
         'CF-Access-Client-Secret': CF_CLIENT_SECRET
      },
      body: JSON.stringify({ inputs: [QUERY_PREFIX + text] })
   });
   if (!res.ok) throw error(502, 'Embedding service unavailable');
   return (await res.json())[0];
}

const dot = (a: number[], b: number[]) =>
   a.reduce((sum, x, i) => sum + x * b[i], 0);

export const POST: RequestHandler = async ({ request }) => {
   const { message } = await request.json();
   if (typeof message !== 'string' || !message.trim() || message.length > 500) {
      throw error(400, 'Invalid message');
   }

   const q = await embed(message);
   const top = chunks
      .map((c) => ({ text: c.text, score: dot(q, c.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

   if (top[0].score < .2)
      return json({ answer: UNSURE_MESSAGE });

   const reply = await anthropic.messages.create({
      model: 'claude-haiku-5-5',
      max_tokens: 200,
      system:
         `Your name is Little Alex. You answer questions about Alex's portfolio. Use only the context below. ` +
         `If it doesn't cover the question, say you don't know. Avoid using more than 150 words.\n\n` +
         `<context>\n${top.map((c) => c.text).join('\n---\n')}\n</context>`,
      messages: [{ role: 'user', content: message }]
   });

   const block = reply.content[0];
   return json({ answer: block.type === 'text' ? block.text : UNSURE_MESSAGE });
}
