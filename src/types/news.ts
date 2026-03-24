// src/types/news.ts

export type NewsSource = 'steam' | 'dayz' | 'forum';
export type NewsCategory = 'update' | 'event' | 'status-report' | 'changelog' | 'announcement' | 'other';

export interface DayZNewsItem {
  id: string;
  title: string;
  url: string;
  publishedAt: string; // ISO string
  summary: string;
  source: NewsSource;
  category: NewsCategory;
  image?: string;
}
