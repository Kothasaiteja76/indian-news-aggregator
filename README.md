# 📰 Indian News Aggregator

A modern, responsive news aggregation platform that fetches real-time headlines from multiple Indian news sources. Built using React and TypeScript, the application provides a clean interface for browsing, saving, sharing, and exporting news content.

---

# 🚀 Features

📰 Real-time News Aggregation – Fetches live headlines from multiple Indian news APIs

🔍 Smart Search & Category Filtering – Search across sources and filter by categories

📝 Personal Notes – Save and manage notes for selected articles

🌙 Dark Mode – Toggle between light and dark themes

📄 PDF Export – Generate downloadable news summary reports

🔗 Article Sharing – Share articles via Web Share API or copy to clipboard

---

# 🛠 Tech Stack

Frontend: React, TypeScript, Tailwind CSS

HTTP Client: Axios

PDF Generation: jsPDF

Build Tool: Vite

APIs Used: GNews, NewsData.io, Mediastack

Storage: Browser LocalStorage (for note management)

---

# ⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/indian-news-aggregator.git

cd indian-news-aggregator

2️⃣ Install Dependencies

npm install

3️⃣ Install Required Packages

npm run dev

4️⃣ Add Environment Variables

---

# Create a .env file in the root folder:
 
VITE_GNEWS_API_KEY=your_gnews_api_key
VITE_NEWSDATA_API_KEY=your_newsdata_api_key
VITE_MEDIASTACK_API_KEY=your_mediastack_api_key

---

5️⃣ Run the Development Server

    npm run dev

6️⃣ Open in Browser

http://localhost:5173
📌 Design Decisions

News is fetched from multiple APIs and aggregated for broader coverage.

Notes are stored using browser LocalStorage, as the feature is lightweight and user-specific, eliminating the need for backend persistence.

PDF reports are dynamically generated using jsPDF.