// server/kapa.js
// Official Walrus Documentation Grounding via Kapa.ai

const KAPA_API_URL = 'https://api.kapa.ai/query/v1/projects';
const DEFAULT_PROJECT_ID = process.env.KAPA_PROJECT_ID;
const DEFAULT_API_KEY = process.env.KAPA_API_KEY;

export const KAPA_TOOL = {
  type: 'function',
  function: {
    name: 'search_walrus_docs',
    description:
      'Search the official Walrus documentation (docs.wal.app) for exact CLI syntax, commands, flags, parameters, architecture, epoch math, Oyster API, Walrus Console, and Walrus Skills. Use this to verify technical facts, exact commands, and documentation citations before answering.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The technical question or search keywords to query against the official Walrus documentation.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
};

export async function searchWalrusDocs(query, options = {}) {
  const projectId = options.projectId || DEFAULT_PROJECT_ID;
  const apiKey = options.apiKey || DEFAULT_API_KEY;

  if (!projectId || !apiKey) {
    return {
      ok: false,
      text: 'Kapa docs search is not configured (missing KAPA_PROJECT_ID or KAPA_API_KEY).',
    };
  }

  try {
    const res = await fetch(`${KAPA_API_URL}/${projectId}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.warn(`[kapa] query error (${res.status}):`, errBody);
      return {
        ok: false,
        text: `Official documentation query returned status ${res.status}: ${errBody.slice(0, 300)}`,
      };
    }

    const data = await res.json();
    const answer = data.answer || '';
    const sources = Array.isArray(data.relevant_sources)
      ? data.relevant_sources.map((s) => s.source_url).filter(Boolean)
      : [];

    let text = answer;
    if (sources.length > 0) {
      text += '\n\n**Official Documentation Sources:**\n' + sources.map((url) => `- ${url}`).join('\n');
    }

    return {
      ok: true,
      text,
      answer,
      sources,
    };
  } catch (err) {
    console.error('[kapa] network error:', err.message);
    return {
      ok: false,
      text: `Failed to connect to official docs search: ${err.message}`,
    };
  }
}
