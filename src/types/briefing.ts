export interface BriefItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  summary?: BriefSummary;
}

export interface BriefSummary {
  headline: string;
  bullets: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
}

export interface MacroIndicator {
  label: string;
  value: string;
  change: number; // % 변화
  unit: string;
}

export interface SectorData {
  sector: string;
  change: number;
  volume: number;
}
