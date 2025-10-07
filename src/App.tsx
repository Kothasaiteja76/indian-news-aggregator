import { useState, useEffect, useMemo } from 'react';
import { Newspaper, Download, BookMarked, RefreshCw, LayoutGrid, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { NewsArticle, Note, Category } from './types';
import { fetchNews } from './utils/newsAggregator';
import { loadNotes } from './utils/notesStorage';
import { generateNewsPDF } from './utils/pdfGenerator';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import NewsList from './components/NewsList';
import Notes from './components/Notes';

function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [isDark, setIsDark] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]); // ← This starts empty
  const [showNotes, setShowNotes] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);


  const categories: Category[] = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Helper function to get newspaper websites
  const getNewspaperWebsite = (newspaperName: string): string => {
    const websites: { [key: string]: string } = {
      'Times of India': 'https://timesofindia.indiatimes.com',
      'The Hindu': 'https://www.thehindu.com',
      'Hindustan Times': 'https://www.hindustantimes.com',
      'NDTV': 'https://www.ndtv.com',
      'Indian Express': 'https://indianexpress.com',
      'India Today': 'https://www.indiatoday.in',
      'Republic World': 'https://www.republicworld.com',
      'News18': 'https://www.news18.com',
      'Mint': 'https://www.livemint.com',
      'Business Standard': 'https://www.business-standard.com',
      'Odisha TV': 'https://odishatv.in',
      'Economic Times': 'https://economictimes.indiatimes.com'
    };
    return websites[newspaperName] || `https://www.google.com/search?q=${encodeURIComponent(newspaperName)}`;
  };

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDarkMode = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const savedNotes = loadNotes();
    setNotes(savedNotes);
    console.log(`📝 Loaded ${savedNotes.length} notes on app start`);
  }, []); 


  // Load news data when category changes
  useEffect(() => {
    loadNewsData();
  }, [selectedCategory]);

  const loadNewsData = async () => {
    setLoading(true);
    setError(null);
    console.log(`🔄 Loading REAL ${selectedCategory} news...`);
    
    try {
      const data = await fetchNews(selectedCategory);
      setArticles(data);
      setLastRefresh(new Date());
      console.log(`✅ Loaded ${data.length} REAL ${selectedCategory} articles`);
    } catch (error: any) {
      console.error('❌ Error loading real data:', error);
      setError('Failed to load real news data. Please check your API keys and internet connection.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadNewsData();
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleThemeToggle = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNotesChange = () => {
    const savedNotes = loadNotes();
    setNotes(savedNotes);
    console.log(`📝 Notes updated, now have ${savedNotes.length} notes`);
  };

  const handleDownloadPDF = () => {
    generateNewsPDF(filteredArticles, notes, selectedCategory);
  };

  const handleReadArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return articles;

    const term = searchTerm.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.description?.toLowerCase().includes(term) ||
        article.source.name.toLowerCase().includes(term)
    );
  }, [articles, searchTerm]);

  // Get unique sources
  const uniqueSources = useMemo(() => {
    const sources = articles.map(article => article.source.name);
    return [...new Set(sources)].sort();
  }, [articles]);

  // Group articles by source
  const articlesBySource = useMemo(() => {
    const grouped: { [key: string]: NewsArticle[] } = {};
    filteredArticles.forEach(article => {
      if (!grouped[article.source.name]) {
        grouped[article.source.name] = [];
      }
      grouped[article.source.name].push(article);
    });
    return grouped;
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  Indian News Aggregator
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>{today}</span>
                  <span className="text-green-600 dark:text-green-400">• 🟢 LIVE DATA</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotes(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="My Notes"
              >
                <BookMarked className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={handleDownloadPDF}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          {!error && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <div className="flex items-center gap-4">
                <span>📰 {filteredArticles.length} real headlines</span>
                <span>•</span>
                <span>{uniqueSources.length} news sources</span>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400">🟢 LIVE DATA</span>
              </div>
              <span>Updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading real {selectedCategory} headlines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                API Setup Required
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-4">
                To get real news data, you need to:
              </p>
              <ol className="text-yellow-700 dark:text-yellow-300 text-sm text-left list-decimal list-inside space-y-1 mb-4">
                <li>Get free API keys from GNews, NewsData.io, and Mediastack</li>
                <li>Replace the API keys in newsAggregator.ts</li>
                <li>Restart your application</li>
              </ol>
              <button
                onClick={handleRefresh}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No articles found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(articlesBySource).map(([newspaper, newspaperArticles]) => (
              <div key={newspaper} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-xl">
                {/* Newspaper Header - NOW CLICKABLE */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Newspaper className="w-5 h-5 text-white" />
                      <h2 className="text-xl font-bold text-white">
                        {newspaper}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-medium">
                        {newspaperArticles.length} headlines
                      </span>
                      <a
                        href={getNewspaperWebsite(newspaper)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded"
                        title={`Visit ${newspaper} website`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Articles List */}
                <div className="p-6">
                  <NewsList
                    articles={newspaperArticles}
                    loading={false}
                    onNoteAdded={handleNotesChange}
                    onReadArticle={handleReadArticle}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Clean Professional Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-800 dark:to-blue-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg">
                  <LayoutGrid className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Indian News Aggregator</h3>
                  <p className="text-blue-200 text-sm">Your Gateway to Indian News</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                A comprehensive platform aggregating real-time news from all major Indian newspapers and news sources. 
                Stay informed with curated headlines across multiple categories.
              </p>
              <div className="flex gap-3">
                <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">📰 Live Updates</div>
                <div className="bg-green-600 px-3 py-1 rounded-full text-xs font-medium">🔍 Smart Search</div>
                <div className="bg-purple-600 px-3 py-1 rounded-full text-xs font-medium">📝 Personal Notes</div>
              </div>
            </div>

            {/* News Sources */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Featured Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  'Times of India',
                  'The Hindu', 
                  'Hindustan Times',
                  'NDTV',
                  'Indian Express',
                  'India Today',
                  'Business Standard',
                  'Mint'
                ].map((source) => (
                  <div key={source} className="flex items-center gap-1 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-xs">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Centered Copyright */}
          <div className="border-t border-blue-700 mt-8 pt-6">
            <div className="text-center">
              <div className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Indian News Aggregator. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Notes Modal */}
      {showNotes && (
        <Notes
          notes={notes}
          onNotesChange={handleNotesChange}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  );
}

export default App;