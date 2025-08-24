# 🤖 React AI Chatbot

A modern, responsive AI chatbot built with React and Vite, featuring real-time chat streaming and mobile-optimized design. Powered by Google AI via `@google/genai`.

## ✨ Features

- 💬 **Real-time Chat Streaming**: Experience smooth, real-time AI responses
- 📱 **Mobile-First Design**: Fully responsive and optimized for mobile devices
- 🌗 **Theme Support**: Light/Dark mode with system theme detection
- 📝 **Chat History**: Context-aware conversations with message history
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- ☁️ **Serverless Ready**: Optimized for Vercel deployment
- 📱 **Mobile Optimized**: Fixed controls, dynamic height, touch-friendly

## ✨ Features

- 💬 **Multiple chats**: Create and switch between chat sessions.
- 📝 **Markdown rendering**: Assistant responses render as markdown.
- 📱 **Responsive UI**: Optimized for desktop and mobile; sidebar collapses on small screens.
- 🌗 **Dark/Light theme**: Toggle theme from the UI with system detection.
- ⏳ **Loading states**: Smooth loader while waiting for responses.
- 🚿 **Streaming responses**: Incremental tokens via the assistant stream API.
- 📱 **Mobile Optimized**: Fixed controls, dynamic height, touch-friendly interface.

## 🧰 Tech Stack

- **Framework**: React 19 + Vite 7
- **Language**: JavaScript (ESM)
- **AI SDK**: `@google/genai` (Google AI)
- **UI**: CSS Modules
- **Deployment**: Vercel Serverless Functions
- **Streaming**: Real-time response streaming

## 📦 Installation

1) Clone the repository
```bash
git clone <your-repo-url>
cd react-ai-chatbot
```

2) Install dependencies
```bash
npm install
```

3) Configure environment

Create a `.env` file in the project root and add your Google AI API key:
```env
VITE_GOOGLE_AI_API_KEY=your_api_key_here
```

> You can obtain an API key from Google AI Studio. Make sure billing and access are enabled for your account/region.

## ▶️ Run Locally

Start the dev server:
```bash
npm run dev
```

The app runs on `http://localhost:5173` by default. The dev server is configured to bind on `0.0.0.0` for LAN access.

## 🏗️ Build & Preview

- Production build: `npm run build`
- Preview build locally: `npm run preview`

The output is emitted to the `dist/` directory.

## 🔐 Environment & Configuration

- Required env var: `VITE_GOOGLE_AI_API_KEY`
- Default model: `gemini-1.5-flash` (configurable in `src/assistants/googleai.js` constructor)

Update the model if desired:
```js
// src/assistants/googleai.js
export class Assistant {
  constructor(model = 'gemini-1.5-pro') {
    this.#chat = googleai.chats.create({ model });
  }
}
```

## 🧩 Project Structure

```
react-ai-chatbot/
├── api/
│   └── chat.js              # Vercel serverless function
├── public/
│   └── chat-bot-icon.png
├── src/
│   ├── assistants/
│   │   ├── googleai.js      # Local development assistant
│   │   └── vercel-ai.js     # Production assistant
│   ├── components/
│   │   ├── Chat/            # Chat view and input
│   │   ├── Controls/        # Input controls
│   │   ├── Loader/          # Loading spinner
│   │   ├── Messages/        # Message list and markdown rendering
│   │   ├── Sidebar/         # Chat sessions list + new chat
│   │   └── Theme/           # Theme toggle
│   ├── App.jsx              # App shell and chat/session state
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
└── DEPLOYMENT.md            # Deployment guide
```

## 📱 Mobile Optimization

### Responsive Design
- **Breakpoints**: 768px, 480px, 360px
- **Flexible Layouts**: Adapts to all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions

### Key Features
- **Fixed Controls**: Always accessible input controls
- **Dynamic Height**: Adapts to content and screen size
- **Focus Management**: Smart focus handling for better UX
- **Theme Support**: System theme detection and persistence

### Performance
- **Optimized Rendering**: Efficient for mobile devices
- **Streaming**: Real-time responses without waiting
- **Minimal Bundle**: Optimized for mobile networks

## 🗣️ How It Works

- `src/assistants/googleai.js` instantiates `GoogleGenAI` with `VITE_GOOGLE_AI_API_KEY` and exposes:
  - `chat(content)` – single-shot call returning full text
  - `chatStream(content)` – async generator yielding incremental chunks
- `src/App.jsx` manages chat sessions, titles (first few tokens), active chat, and wires the assistant to the `Chat` component.
- UI components handle theming, sidebar navigation, message rendering, and loading.

## 🧪 Linting

Run ESLint:
```bash
npm run lint
```

## 🚀 Deployment

Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Build the site and deploy the `dist/` directory. Ensure the `VITE_GOOGLE_AI_API_KEY` is set in your host’s environment so the build (or runtime, if using server-side proxies) can access it.

> Note: Exposing API keys in client-side code is risky. Prefer a server-side proxy that injects the key or performs requests on behalf of the client when moving to production.

## 🛠️ Troubleshooting

- "Missing API key" or 401: Verify `VITE_GOOGLE_AI_API_KEY` is set and restarts have been performed.
- CORS or network errors: Ensure your network permits requests to Google AI endpoints.
- Empty/slow responses: Try a different model or reduce message length.
- Build issues: Delete `node_modules` and lockfile, reinstall dependencies.

## 📄 License

MIT — see `LICENSE` if provided. Otherwise, adapt to your preferred license.

## 🙌 Acknowledgments

- Google AI (`@google/genai`) for the generative model APIs.
- React + Vite for the dev experience.