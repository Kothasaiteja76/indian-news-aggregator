# 📰 Indian News Aggregator

A modern, responsive news aggregation platform that fetches real-time headlines from multiple Indian news sources. Built using React and TypeScript, the application provides a clean interface for browsing, saving, sharing, and exporting news content.

---

## 🚀 Features

- 📰 **Real-time News Aggregation** – Fetches live headlines from multiple Indian news APIs  
- 🔍 **Smart Search & Category Filtering** – Search across sources and filter by categories  
- 📝 **Personal Notes** – Save and manage notes for selected articles  
- 🌙 **Dark Mode** – Toggle between light and dark themes  
- 📄 **PDF Export** – Generate downloadable news summary reports  
- 🔗 **Article Sharing** – Share articles via Web Share API or copy to clipboard  

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS  
- **HTTP Client:** Axios  
- **PDF Generation:** jsPDF  
- **Build Tool:** Vite  
- **APIs Used:** GNews, NewsData.io, Mediastack  
- **Storage:** Browser LocalStorage (for note management)

---


## Getting Started

1. Clone the repository
2. Install dependencies: npm install
3. Add API keys in .env file
4. Run: npm run dev
5. Open: http://localhost:5173

---


## Design Decisions

News is fetched from multiple APIs and aggregated for broader coverage.
Notes are stored using browser LocalStorage, as the feature is lightweight and user-specific, eliminating the need for backend persistence.
PDF reports are dynamically generated using jsPDF.

