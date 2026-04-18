// TypeScript interfaces for the Mitra AI analysis pipeline

export type Language = 'en' | 'hi' | 'ta';
export type InputType = 'text' | 'url' | 'media';
export type ClaimStatus = 'True' | 'False' | 'Misleading' | 'Opinion';
export type ViralityLevel = 'Low' | 'Medium' | 'High';

export interface Claim {
  id: number;
  text: string;
  status: ClaimStatus;
  confidence?: number; // 0–100
}

export interface TrustedSource {
  name: string;
  url: string;
  logo: string;
}

export interface FactVerification {
  correctedFact: string;
  sources: TrustedSource[];
}

export interface Explanation {
  detailed: string;
  eli10: string;
}

export interface ViralityRisk {
  score: number;
  level: ViralityLevel;
  reason: string;
}

export interface ContextAnalysis {
  regional: string;
  cultural: string;
  sensitivity: string;
}

export interface CounterMessage {
  text: string;
  whatsappText: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputType: InputType;
  language: Language;
  originalInput: string;

  // 9-step pipeline
  claims: Claim[];
  trustScore: number;
  factVerification: FactVerification;
  explanation: Explanation;
  viralityRisk: ViralityRisk;
  contextAnalysis: ContextAnalysis;
  counterMessage: CounterMessage;

  // Processing metadata
  processingTime: number;
  modelVersion: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  sublabel: string;
  status: 'pending' | 'active' | 'done';
  duration: number;
}

export interface AnalyzeRequest {
  input: string;
  type: InputType;
  language: Language;
}
