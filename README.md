# Vikramshila: YouTube Course Platform

Vikramshila is a modern, frontend-only learning platform that transforms YouTube playlists into structured, trackable courses. It's designed for students preparing for competitive exams like **JEE, NEET, and CAT**, providing a distraction-free environment without recommendations or comments.

## 🚀 Key Features

- **Distraction-Free Learning:** Focus only on the video content and your progress.
- **Course Tracking:** Mark individual videos as complete and see your progress at a glance.
- **Offline-First:** All your progress and enrolled courses are stored locally in your browser (**LocalStorage**). No account or backend required.
- **Custom Playlists:** Import any public YouTube playlist by simply pasting its URL.
- **Featured Catalog:** Pre-curated playlists for major competitive exams.
- **Responsive Design:** Works seamlessly on both Desktop and Mobile devices.
- **Backend-less Architecture:** Uses public Piped API instances to fetch YouTube metadata directly from the browser.

## 🛠️ Built With

- **React 19**
- **Vite**
- **Material UI (MUI)**
- **Zustand** (Persistent State Management)
- **React Router 7**

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/vikramshila.git
   cd vikramshila
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/store/useStore.ts`: Manages persistent local storage state (enrolled courses, progress).
- `src/utils/youtube.ts`: Utility for fetching playlist data using public Piped API instances.
- `src/data/catalog.ts`: Central location for hardcoded featured exams and playlists.
- `src/views/`: Contains page-level components (Home, Dashboard, ExamDetail, CoursePlayer).

## 🌍 Deployment

This project is optimized for deployment to **GitHub Pages**.

1. Ensure `vite.config.ts` has the correct `base` path if you're deploying to a subfolder (e.g., `base: '/vikramshila/'`).
2. Run `npm run build`.
3. Upload the contents of the `dist` folder to your hosting provider.

## 🤝 Contributing

We welcome contributions! If you'd like to add more curated playlists to the featured catalog, please modify `src/data/catalog.ts` and submit a Pull Request.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
