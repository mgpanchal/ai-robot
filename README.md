# Atlas (ai-robot)

A voice-driven **3D AI assistant** built with **Next.js (App Router)** + **Spline**.

- 🎙️ Click-to-talk voice input (Web Speech API)
- 🤖 AI replies via a server API route (`/api/ai`)
- 🔊 Text-to-speech responses (Speech Synthesis API)
- 🧩 3D robot/scene powered by **Spline** (swap scenes by voice)

> Project name in `package.json`: **ai-robot**

---

## Demo features

### Voice commands (built-in)
- **“change background / change avatar / change look”** → cycles Spline scenes
- **“open new tab”** → opens `https://mpanchal.com` in a new tab
- Identity/creator Q&A handled locally (see `handlePromptCustom()` in `VoiceRobot.jsx`)

### Main flow
1. Click **Ask Atlas**
2. Speak your prompt
3. App sends the prompt to **`POST /api/ai`**
4. Receives AI text, speaks it aloud, and auto-listens again

---

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **@splinetool/react-spline** for 3D scenes
- Browser APIs:
  - `SpeechRecognition` / `webkitSpeechRecognition`
  - `speechSynthesis`

---

## Project structure

```
ai-robot/
  public/
    sounds/mic-start.mp3
  src/app/
    api/ai/route.js           # Server route that calls the AI model
    components/VoiceRobot.jsx  # UI + voice input/output
    layout.js
    page.js
    globals.css
```

---

## Getting started

### 1) Install

```bash
npm install
```

### 2) Configure environment variables (recommended)

Right now the AI route contains an API key inline in:

- `src/app/api/ai/route.js`

**For GitHub / production you should move it to an env var.**

Create a file named **`.env.local`** in the project root:

```bash
GEMINI_API_KEY=YOUR_KEY_HERE
```

Then update the code in `route.js` to read:

```js
const apiKey = process.env.GEMINI_API_KEY;
```

> Never commit real API keys to GitHub.

### 3) Run dev server

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## How the AI route works

**`POST /api/ai`** expects JSON:

```json
{ "prompt": "your message" }
```

It calls Google’s **Generative Language API** (Gemini) and returns:

```json
{ "response": "model output" }
```

Files:
- `src/app/api/ai/route.js`

---

## Customize

### Change the 3D scenes
Edit the `splineScenes` array in:
- `src/app/components/VoiceRobot.jsx`

```js
const splineScenes = [
  "https://prod.spline.design/.../scene.splinecode",
  // ...
];
```

### Change the mic sound
Replace:
- `public/sounds/mic-start.mp3`

### Change behavior for special commands
Edit:
- `handlePromptCustom()` inside `VoiceRobot.jsx`

---

## Deployment

### Vercel
- Import the repo
- Add environment variable `GEMINI_API_KEY`
- Deploy

### Node server

```bash
npm run build
npm run start
```

---

## Troubleshooting

### Speech recognition not working
- Works best in **Chrome** / **Edge**
- Make sure microphone permission is allowed
- On some browsers `SpeechRecognition` is not available (you’ll see the alert)

### No audio output
- Check system volume
- Some browsers require a user gesture before speech output

### API errors
- Confirm `GEMINI_API_KEY` is valid
- Check your quota / billing settings for the key

---

## Security notes

- Do **not** hardcode API keys in `route.js`.
- Consider adding:
  - rate limiting
  - basic auth/session checks
  - request validation (max prompt size)

---

## 📄 License
This project is licensed under the **MIT License** — you are free to use it for both **personal and commercial projects**.

---

## 🤝 Contributing
Contributions are welcome!  
If you’d like to improve this project, feel free to **fork the repo and submit a Pull Request**.

---

## 📞 Support
- 📘 Documentation: *(Coming soon)*
- 🐞 Issues: GitHub Issues tab
- 📧 Email: **mail@mpanchal.com**

---

## 🎉 Acknowledgments
Built with ❤️ by **Mangesh Panchal**  

Made with **modern web standards** and **best practices**.
