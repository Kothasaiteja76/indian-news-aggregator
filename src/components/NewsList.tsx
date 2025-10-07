import { NewsArticle } from '../types';
import NewsCard from './NewsCard';

interface NewsListProps {
  articles: NewsArticle[];
  loading: boolean;
  onNoteAdded: () => void;
}

export default function NewsList({ articles, loading, onNoteAdded }: NewsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-300 dark:bg-gray-700" />
            <div className="p-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          No articles found. Try a different category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <NewsCard 
          key={`${article.url}-${index}-${article.publishedAt}`} 
          article={article} 
          onNoteAdded={onNoteAdded} 
        />
      ))}
    </div>
  );
}