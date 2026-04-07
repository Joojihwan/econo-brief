import type { BriefSummary } from './briefing';

export interface SummarizeRequest {
  articles: Array<{
    title: string;
    body: string; // 첫 2문단만
  }>;
}

export interface SummarizeResponse {
  summaries: BriefSummary[];
  cachedAt: string;
}
