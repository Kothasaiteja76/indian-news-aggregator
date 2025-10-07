import { useState } from 'react';
import { ExternalLink, Calendar, StickyNote, X, Share2 } from 'lucide-react';
import { NewsArticle } from '../types';
import { addNote } from '../utils/notesStorage';
import { shareArticle } from '../utils/shareUtils';

interface NewsCardProps {
  article: NewsArticle;
  onNoteAdded: () => void;
}

export default function NewsCard({ article, onNoteAdded }: NewsCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote({
        articleUrl: article.url,
        articleTitle: article.title,
        content: noteContent.trim(),
      });
      setNoteContent('');
      setShowNoteInput(false);
      onNoteAdded();
      alert('Note saved successfully! 📝\nYou can view all notes by clicking the notes button in the header.');
    }
  };

  const handleShare = async () => {
    await shareArticle(article);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            {article.source.name}
          </span>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(article.publishedAt)}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {article.description}
          </p>
        )}

        <div className="flex gap-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Read More
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Share Button - FIXED COLOR */}
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            title="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Add Note Button */}
          <button
            onClick={() => setShowNoteInput(!showNoteInput)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            title="Add note"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>

        {showNoteInput && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Add a note
              </label>
              <button
                onClick={() => setShowNoteInput(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your thoughts about this article..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteContent.trim()}
              className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Save Note
            </button>
          </div>
        )}
      </div>
    </article>
  );
}