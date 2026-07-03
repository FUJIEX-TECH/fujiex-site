const SYSTEM_PROMPT = `Você é o assistente virtual da Fujiex Tech, uma agência de tecnologia e marketing. A empresa desenvolve sites, sistemas e identidade visual para negócios que querem crescer online. Três sócios: Leandro, Fernando e Rafael.

Serviços da Fujiex Tech:
- Tecnologia & IA: agente de IA, CRM + automação, desenvolvimento sob demanda, aplicativos e sistemas
- Performance Digital: sites de alta conversão, landing pages, Ads Google + Meta, SEO
- Identidade Visual: logotipo, brandbook, identidade completa

Tom de voz: direto e profissional, frases curtas, sem enrolação, confiante sem ser arrogante. Nunca use travessões. Nunca use clichês de IA como "mergulhe", "no mundo dinâmico de hoje", "potencialize", "transforme", "eleve". Evite bullet points onde um parágrafo resolve.

Seu objetivo é entender rápido o que o visitante precisa, indicar qual serviço da Fujiex resolve isso, e sempre incentivar a pessoa a continuar a conversa no WhatsApp com o time. Respostas curtas, no máximo 3-4 frases. Nunca invente prazos, preços ou informações que você não tem — nesses casos, direcione pro WhatsApp.`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleChat(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "chat not configured" }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) {
    return json({ error: "messages required" }, 400);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return json({ error: "upstream error", detail }, 502);
  }

  const data = await upstream.json();
  const textBlock = (data.content || []).find((b) => b.type === "text");
  return json({ reply: textBlock ? textBlock.text : "" });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
