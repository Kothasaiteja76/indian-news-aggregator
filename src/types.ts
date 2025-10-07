export type Category = 'general' | 'business' | 'technology' | 'sports' | 'entertainment' | 'health' | 'science';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  content: string | null;
}

export interface Note {
  id: string;
  articleUrl: string;
  articleTitle: string;
  content: string;
  createdAt: string;
}