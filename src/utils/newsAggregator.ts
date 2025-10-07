import axios from 'axios';
import { NewsArticle, Category } from '../types';

// REPLACE THESE WITH YOUR ACTUAL API KEYS (Get them from the links above)
const API_KEYS = {
  GNEWS: import.meta.env.VITE_GNEWS_API_KEY, // Replace with your GNews key
  NEWSDATA: import.meta.env.VITE_NEWSDATA_API_KEY, // Replace with your NewsData key
  MEDIASTACK: import.meta.env.VITE_MEDIASTACK_API_KEY // Replace with your Mediastack key
};

export const fetchNews = async (category: Category = 'general'): Promise<NewsArticle[]> => {
  console.log(`🔄 Fetching REAL ${category} news from multiple APIs...`);
  
  try {
    const allArticles: NewsArticle[] = [];
    
    // Try all real API sources
    const apiPromises = [
      fetchFromGNews(category),
      fetchFromNewsData(category),
      fetchFromMediastack(category)
    ];
    
    const results = await Promise.allSettled(apiPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ API Source ${index + 1}: ${result.value.length} real articles`);
        allArticles.push(...result.value);
      } else {
        console.log(`❌ API Source ${index + 1} failed:`, result.reason.message);
      }
    });

    // Remove duplicates
    const uniqueArticles = removeDuplicates(allArticles);
    
    console.log(`✅ Total REAL ${category} articles: ${uniqueArticles.length}`);
    
    if (uniqueArticles.length > 0) {
      return uniqueArticles.slice(0, 50);
    }
    
    throw new Error('All real APIs failed');
    
  } catch (error) {
    console.error('❌ All real APIs failed:', error);
    throw new Error('Unable to fetch real news data. Please check your API keys.');
  }
};

// GNews API - Provides real Indian news
const fetchFromGNews = async (category: Category): Promise<NewsArticle[]> => {
  try {
    const categoryMap = {
      general: 'general',
      business: 'business',
      technology: 'technology',
      sports: 'sports',
      entertainment: 'entertainment',
      health: 'health',
      science: 'science'
    };

    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        category: categoryMap[category],
        country: 'in',
        max: 20,
        apikey: API_KEYS.GNEWS,
        lang: 'en'
      },
      timeout: 10000
    });

    if (response.data.articles && response.data.articles.length > 0) {
      return processGNewsArticles(response.data.articles);
    }
    return [];
  } catch (error: any) {
    console.error('GNews API error:', error.response?.data || error.message);
    return [];
  }
};

// NewsData.io API - Another real news source
const fetchFromNewsData = async (category: Category): Promise<NewsArticle[]> => {
  try {
    const categoryMap = {
      general: 'top',
      business: 'business',
      technology: 'technology',
      sports: 'sports',
      entertainment: 'entertainment',
      health: 'health',
      science: 'science'
    };

    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        category: categoryMap[category],
        country: 'in',
        size: 15,
        apikey: API_KEYS.NEWSDATA,
        language: 'en'
      },
      timeout: 10000
    });

    if (response.data.results && response.data.results.length > 0) {
      return processNewsDataArticles(response.data.results);
    }
    return [];
  } catch (error: any) {
    console.error('NewsData API error:', error.response?.data || error.message);
    return [];
  }
};

// Mediastack API - Real global news with Indian focus
const fetchFromMediastack = async (category: Category): Promise<NewsArticle[]> => {
  try {
    const categoryMap = {
      general: 'general',
      business: 'business',
      technology: 'technology',
      sports: 'sports',
      entertainment: 'entertainment',
      health: 'health',
      science: 'science'
    };

    const response = await axios.get('http://api.mediastack.com/v1/news', {
      params: {
        categories: categoryMap[category],
        countries: 'in',
        limit: 15,
        access_key: API_KEYS.MEDIASTACK,
        languages: 'en'
      },
      timeout: 10000
    });

    if (response.data.data && response.data.data.length > 0) {
      return processMediastackArticles(response.data.data);
    }
    return [];
  } catch (error: any) {
    console.error('Mediastack API error:', error.response?.data || error.message);
    return [];
  }
};

// Process articles from different APIs to common format
const processGNewsArticles = (articles: any[]): NewsArticle[] => {
  return articles
    .filter(article => 
      article.title && 
      article.title !== '[Removed]' &&
      article.description &&
      article.url
    )
    .map(article => ({
      title: article.title,
      description: article.description || 'Click to read full article',
      url: article.url,
      urlToImage: article.image || null,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        id: article.source?.name ? article.source.name.toLowerCase().replace(/\s+/g, '-') : null,
        name: article.source?.name || 'Unknown Source'
      },
      content: article.content || null
    }));
};

const processNewsDataArticles = (articles: any[]): NewsArticle[] => {
  return articles
    .filter(article => 
      article.title && 
      article.title !== '[Removed]' &&
      article.link
    )
    .map(article => ({
      title: article.title,
      description: article.description || 'Click to read full article',
      url: article.link,
      urlToImage: article.image_url || null,
      publishedAt: article.pubDate || new Date().toISOString(),
      source: {
        id: article.source_id || null,
        name: article.source_id ? article.source_id.charAt(0).toUpperCase() + article.source_id.slice(1) : 'Unknown Source'
      },
      content: article.content || null
    }));
};

const processMediastackArticles = (articles: any[]): NewsArticle[] => {
  return articles
    .filter(article => 
      article.title && 
      article.title !== '[Removed]' &&
      article.url
    )
    .map(article => ({
      title: article.title,
      description: article.description || 'Click to read full article',
      url: article.url,
      urlToImage: article.image || null,
      publishedAt: article.published_at || new Date().toISOString(),
      source: {
        id: article.source ? article.source.toLowerCase().replace(/\s+/g, '-') : null,
        name: article.source || 'Unknown Source'
      },
      content: null
    }));
};

const removeDuplicates = (articles: NewsArticle[]): NewsArticle[] => {
  const seen = new Set();
  return articles.filter(article => {
    const key = article.title.toLowerCase().trim().slice(0, 100);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};