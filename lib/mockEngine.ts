import { AnalysisResult, AnalyzeRequest, Claim, ClaimStatus } from './types';

// Keyword-based scoring to make mock feel realistic
function scoreInput(input: string): number {
  const lowerInput = input.toLowerCase();

  const highRiskKeywords = [
    'fake', 'hoax', 'conspiracy', 'lie', 'mislead', 'false', 'wrong',
    'forward this', 'share this', 'urgent', 'breaking', 'exposed',
    'they don\'t want you to know', 'secret', 'hidden truth',
    'whatsapp', 'viral', 'shocking', 'must see'
  ];

  const safeKeywords = [
    'according to', 'study shows', 'research', 'published', 'government',
    'official', 'reuters', 'verified', 'fact-check', 'scientist',
    'data shows', 'evidence', 'peer-reviewed'
  ];

  let score = 60;
  highRiskKeywords.forEach(kw => { if (lowerInput.includes(kw)) score -= 15; });
  safeKeywords.forEach(kw => { if (lowerInput.includes(kw)) score += 5; });
  score = Math.max(8, Math.min(97, score));
  return Math.round(score);
}

function extractClaims(input: string, trustScore: number): Claim[] {
  // Split by sentences or natural breaks
  const rawSentences = input
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 5);

  // If too short / URL, generate synthetic claims
  const syntheticFallbacks = [
    'The content makes a strong causal claim without citing peer-reviewed sources.',
    'Statistical figures referenced could not be independently verified.',
    'The narrative implies governmental suppression of information.',
    'The source of the original information is anonymous or unattributed.',
    'The content promotes a single, unverified perspective on a complex issue.',
  ];

  const sentences = rawSentences.length >= 2 ? rawSentences : syntheticFallbacks.slice(0, 3);

  return sentences.map((s, i) => {
    let status: ClaimStatus;
    let confidence: number;
    const rand = (trustScore + i * 11) % 100;
    if (rand > 65)      { status = 'True';       confidence = 70 + Math.round(Math.random() * 25); }
    else if (rand > 45) { status = 'Opinion';    confidence = 50 + Math.round(Math.random() * 20); }
    else if (rand > 25) { status = 'Misleading'; confidence = 55 + Math.round(Math.random() * 30); }
    else                { status = 'False';      confidence = 75 + Math.round(Math.random() * 20); }
    confidence = Math.min(99, confidence);
    return { id: i + 1, text: s, status, confidence };
  });
}

const FACTUAL_RESPONSES: Record<number, { correctedFact: string }> = {
  0: { correctedFact: 'The information contains significant factual inaccuracies. Independent verification by multiple reputable agencies found no supporting evidence for the core claim.' },
  1: { correctedFact: 'While partially accurate, critical context is missing. The complete picture, as verified by scientific literature, paints a significantly different narrative than presented.' },
  2: { correctedFact: 'The original statement is largely accurate according to verified government data and peer-reviewed research from recognized academic institutions.' },
};

const TRUSTED_SOURCES = [
  { name: 'Reuters Fact-Check', url: 'https://www.reuters.com/fact-check/', logo: 'R' },
  { name: 'PTI Fact Check', url: 'https://www.ptinews.com/category/pti-fact-check/', logo: 'P' },
  { name: 'Alt News', url: 'https://www.altnews.in/', logo: 'A' },
  { name: 'WHO Infodemic', url: 'https://www.who.int/emergencies/infodemic/', logo: 'W' },
  { name: 'BOOM Live', url: 'https://www.boomlive.in/', logo: 'B' },
  { name: 'Snopes', url: 'https://www.snopes.com/', logo: 'S' },
  { name: 'FactCheck.org', url: 'https://www.factcheck.org/', logo: 'F' },
  { name: 'India Today Fact Check', url: 'https://www.indiatoday.in/fact-check', logo: 'I' },
];

function pickSources(score: number) {
  const indices = score > 60
    ? [0, 1, 2]
    : score > 35
    ? [0, 3, 4, 7]
    : [0, 4, 5, 6, 7];
  return indices.map(i => TRUSTED_SOURCES[i]).slice(0, 4);
}

const EXPLANATIONS = {
  low: {
    detailed:
      'This content exhibits multiple hallmarks of misinformation: absence of credible citations, emotional manipulation through alarming language, and an anonymous or unverifiable origin. The core claims contradict established scientific consensus and verified public records. Our NLP models detected high-confidence deceptive framing patterns consistent with coordinated inauthentic behavior on social media platforms.',
    eli10:
      'This message is trying to trick you! It uses scary words to make you feel worried, but it doesn\'t show any real proof. Real news always tells you where it got its information from. This one doesn\'t, which means someone probably made it up to confuse people.',
  },
  mid: {
    detailed:
      'This content contains a mixture of accurate and misleading elements. While some foundational facts are correct, they are presented without crucial context, leading to a distorted overall impression. This technique — known as "misleading by omission" — is a common strategy in online misinformation. The data points cited, while real, are cherry-picked to support a predetermined narrative.',
    eli10:
      'This is like telling only HALF the story. Imagine if someone said "Eating sugar is good for your energy!" — that\'s kind of true, but they forgot to tell you it\'s also bad for your teeth! This message does the same thing — some parts are true but it leaves out important facts.',
  },
  high: {
    detailed:
      'This content has been verified against multiple authoritative databases and peer-reviewed publications. The information aligns with consensus positions from recognised scientific and governmental bodies. Our cross-reference engine found corroborating evidence from 7+ independent sources spanning multiple geographic jurisdictions, significantly increasing confidence in its accuracy.',
    eli10:
      'Great news! This information is mostly TRUE! Smart scientists and news reporters checked it, and they all agree. It\'s like when your teacher and your parents both say the same thing — you can be pretty sure it\'s right.',
  },
};

function getExplanation(score: number) {
  if (score < 35) return EXPLANATIONS.low;
  if (score < 65) return EXPLANATIONS.mid;
  return EXPLANATIONS.high;
}

function getViralityRisk(score: number) {
  // Virality is INVERSE of trustScore — misinformation spreads faster
  const viralScore = Math.round(100 - score * 0.6 + Math.random() * 15);
  const clamped = Math.max(5, Math.min(98, viralScore));
  const level = clamped > 65 ? 'High' : clamped > 35 ? 'Medium' : 'Low';
  const reasons = {
    High: 'This content uses emotionally charged language and lacks verifiable sources, making it highly shareable in echo chambers and messaging groups like WhatsApp.',
    Medium: 'The content has some misleading elements that could propagate in politically active communities, but its partially verifiable nature limits mass virality.',
    Low: 'The factual, well-sourced nature of this content limits its sensationalist appeal, making it less likely to go viral through misinformation channels.',
  };
  return { score: clamped, level: level as 'Low' | 'Medium' | 'High', reason: reasons[level] };
}

const CONTEXT = [
  {
    regional: 'This content appears to target North Indian demographics, referencing cultural and political themes common in UP, Bihar, and Delhi NCR circles.',
    cultural: 'The narrative leverages religious sentiment, a common amplification vector during festival seasons and election cycles in India.',
    sensitivity: 'HIGH — Content touches on religious identity and could contribute to communal tension if widely shared.',
  },
  {
    regional: 'Content analysis suggests a South Indian origin, with themes relevant to Tamil Nadu and Karnataka political discourse.',
    cultural: 'The framing exploits regional pride and linguistic politics, common in dravidian identity-related misinformation campaigns.',
    sensitivity: 'MEDIUM — Primarily politically sensitive; limited immediate risk of communal harm.',
  },
  {
    regional: 'This content appears geographically neutral but is optimised for pan-India mobile sharing via WhatsApp forwards.',
    cultural: 'Uses aspirational health or economic claims, a common persuasion tactic in semi-urban and rural forward chains.',
    sensitivity: 'LOW — Content is misleading but unlikely to incite immediate social discord.',
  },
];

function getCounterMessage(score: number, language: string) {
  const tag = score < 35 ? 'FALSE' : score < 65 ? 'MISLEADING' : 'TRUE';
  const en = {
    text: `🚫 FACT CHECK [${tag}]: The viral claim circulating about this topic has been reviewed by multiple independent fact-checkers including Reuters, Alt News, and BOOM Live. ${score < 50 ? 'The information is inaccurate or missing critical context.' : 'The information has been verified as largely accurate.'} Before sharing, please verify with trusted sources. #MitraAI #FactCheck #StopMisinformation`,
    whatsappText: `*MITRA AI FACT CHECK* ✅\n\nStatus: *${tag}*\n\n${score < 50 ? '❌ This message contains false or misleading information.' : '✅ This message has been verified as accurate.'}\n\nVerified by: Reuters, Alt News, BOOM Live\n\n🔗 Full analysis: https://mitra-ai.vercel.app\n\n_Please don\'t forward unverified messages. #FactCheck_`,
  };
  const hi = {
    text: `🚫 तथ्य जांच [${tag}]: इस वायरल दावे की कई स्वतंत्र संस्थाओं द्वारा जांच की गई है। ${score < 50 ? 'यह जानकारी गलत या भ्रामक है।' : 'यह जानकारी सत्यापित है।'} कृपया शेयर करने से पहले विश्वसनीय स्रोतों से जांचें। #MitraAI`,
    whatsappText: `*मित्र AI तथ्य जांच* ✅\n\nस्थिति: *${tag}*\n\n${score < 50 ? '❌ इस संदेश में गलत जानकारी है।' : '✅ यह संदेश सत्यापित है।'}\n\nसत्यापित: Reuters, Alt News\n\n#FactCheck #StopMisinformation`,
  };
  const ta = {
    text: `🚫 உண்மை சோதனை [${tag}]: இந்த வைரல் கூற்று பல சுயாதீன நிறுவனங்களால் சரிபார்க்கப்பட்டது. ${score < 50 ? 'இந்தத் தகவல் தவறானது.' : 'இந்தத் தகவல் சரிபார்க்கப்பட்டது.'} #MitraAI #FactCheck`,
    whatsappText: `*மித்ரா AI உண்மை சோதனை* ✅\n\nநிலை: *${tag}*\n\n${score < 50 ? '❌ இந்த செய்தியில் தவறான தகவல் உள்ளது.' : '✅ இந்த செய்தி சரிபார்க்கப்பட்டது.'}\n\n#FactCheck`,
  };

  const msgs = { en, hi, ta };
  return msgs[language as 'en' | 'hi' | 'ta'] || en;
}

export function generateAnalysis(req: AnalyzeRequest): AnalysisResult {
  const trustScore = scoreInput(req.input);
  const claims = extractClaims(req.input, trustScore);
  const factIdx = trustScore < 35 ? 0 : trustScore < 65 ? 1 : 2;
  const contextIdx = Math.floor(Math.random() * CONTEXT.length);

  return {
    id: `mitra-${Date.now()}`,
    timestamp: new Date().toISOString(),
    inputType: req.type,
    language: req.language,
    originalInput: req.input,

    claims,
    trustScore,
    factVerification: {
      correctedFact: FACTUAL_RESPONSES[factIdx].correctedFact,
      sources: pickSources(trustScore),
    },
    explanation: getExplanation(trustScore),
    viralityRisk: getViralityRisk(trustScore),
    contextAnalysis: CONTEXT[contextIdx],
    counterMessage: getCounterMessage(trustScore, req.language),

    processingTime: Math.round(2400 + Math.random() * 1200),
    modelVersion: 'mitra-v2.1.0-multimodal',
  };
}
