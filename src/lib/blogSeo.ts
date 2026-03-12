function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > max * 0.7 ? sliced.slice(0, lastSpace) : sliced).replace(/[,\s.]+$/, "");
}

export function normalizeDisconnectBrand(text: string): string {
  if (!text) return "";
  return text
    .replace(/\bdisconnect\s+agencies\b/gi, "Disconnect")
    .replace(/\bdisconnect\s+agency\b/gi, "Disconnect");
}

function keepSingleDisconnectMention(text: string): string {
  let seen = false;
  return text.replace(/\bdisconnect\b/gi, (m) => {
    if (seen) return "we";
    seen = true;
    return m[0] === "d" ? "disconnect" : "Disconnect";
  });
}

export function sanitizeBlogHtmlContent(html: string): string {
  if (!html) return "";
  return normalizeDisconnectBrand(html)
    .replace(/<\s*h1\b/gi, "<h2")
    .replace(/<\s*\/\s*h1\s*>/gi, "</h2>");
}

export function buildProfessionalMetaTitle(title: string, provided?: string): string {
  const base = normalizeDisconnectBrand((provided || title || "").trim());
  const cleaned = base.replace(/\s*\|\s*disconnect\s*$/i, "").trim();
  const short = truncateAtWord(cleaned, 58);
  return `${short} | Disconnect`;
}

export function buildProfessionalMetaDescription(input: {
  provided?: string;
  excerpt?: string;
  content?: string;
  title?: string;
}): string {
  const raw = normalizeDisconnectBrand(
    (input.provided || input.excerpt || stripHtml(input.content || "") || "").trim()
  );

  let desc = raw;
  if (!desc) {
    desc = `${input.title || "This article"} shares practical, professional insights from Disconnect.`;
  }

  desc = desc
    .replace(/\bagency\b/gi, "")
    .replace(/\bagencies\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  desc = keepSingleDisconnectMention(desc);
  desc = truncateAtWord(desc, 155);

  if (!/\bdisconnect\b/i.test(desc)) {
    desc = truncateAtWord(`${desc} by Disconnect.`, 155);
  }

  return desc;
}
