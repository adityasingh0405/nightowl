# NightOwl (StreamVerse) 🦉🎬

NightOwl is a premium, fully-responsive streaming platform interface built with React and Tailwind CSS. Designed with a sleek, glassmorphic "Dribbble-style" aesthetic, it allows users to discover movies and TV shows, manage personal watchlists, and seamlessly stream content via an integrated third-party player.

## ✨ Features

- **Premium UI/UX:** Stunning dark-mode interface with glassmorphic elements, smooth framer-motion animations, and optimized typography.
- **Mobile Responsive:** Fully adaptive layout featuring a desktop sidebar that gracefully transforms into an app-like Bottom Navigation bar on mobile devices.
- **Discover Content:** Browse trending, upcoming, and top-rated Movies and TV Series powered by the TMDB API.
- **Watchlist Manager:** Add your favorite movies and shows to a personalized Watchlist (persisted via local storage).
- **Watch History:** The "Continue Watching" feature automatically tracks recently viewed items.
- **Surprise Me:** A shuffle feature that instantly picks a random trending movie for you to watch.
- **Integrated Player:** Watch content directly within the app using a custom, sandboxed iframe player.

## 🚀 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Backend:** [TMDB (The Movie Database) API](https://www.themoviedb.org/documentation/api)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityasingh0405/nightowl.git
   cd nightowl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your TMDB API read access token:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_read_access_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

- `/src/components` - Reusable UI components (Navbar, Sidebar, BottomNav, MovieCards).
- `/src/pages` - Main route components (Home, MovieDetail, TVDetail, Category, Watchlist, Player).
- `/src/context` - React Context providers for global state (Auth, Watchlist, WatchHistory).
- `/src/api` - TMDB API fetching logic and endpoints.
- `/src/hooks` - Custom React hooks (e.g., LocalStorage sync).

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
