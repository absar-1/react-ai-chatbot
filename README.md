# 🤖 React AI Chatbot

An elegant and responsive AI-powered chatbot built with React and Vite. It supports multiple chat sessions, live streaming responses, markdown rendering, theming, and a clean, mobile-friendly UI. Powered by Google AI via `@google/genai`.

## ✨ Features

- 💬 **Multiple chats**: Create and switch between chat sessions.
- 📝 **Markdown rendering**: Assistant responses render as markdown.
- 📱 **Responsive UI**: Optimized for desktop and mobile; sidebar collapses on small screens.
- 🌗 **Dark/Light theme**: Toggle theme from the UI.
- ⏳ **Loading states**: Smooth loader while waiting for responses.
- 🚿 **Streaming responses**: Incremental tokens via the assistant stream API.

## 🧰 Tech Stack

- **Framework**: React 19 + Vite 7
- **Language**: JavaScript (ESM)
- **AI SDK**: `@google/genai` (Google AI)
- **UI**: CSS Modules

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
  public/
    chat-bot-icon.png
  src/
    assistants/
      googleai.js           # Google AI chat wrapper (chat + streaming)
    components/
      Chat/                 # Chat view and input
      Controls/             # Input controls
      Loader/               # Loading spinner
      Messages/             # Message list and markdown rendering
      Sidebar/              # Chat sessions list + new chat
      Theme/                # Theme toggle
    App.jsx                 # App shell and chat/session state
    main.jsx                # Entry point
  index.html
  vite.config.js
```

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