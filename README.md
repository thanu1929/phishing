# Phishing Detector

A full-stack application for detecting phishing URLs using React (Frontend) and Node.js/Express (Backend) powered by Gemini AI.

## Getting Started in VS Code

### Prerequisites
- [Node.js](https://nodejs.org/) (for the frontend and backend)
- [VS Code](https://code.visualstudio.com/)

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment**:
   - Provide your `GEMINI_API_KEY` either via your environment or `.env` file (if you install dotenv).

### Running the App

#### Via VS Code Run & Debug
1. Open the **Run and Debug** view in VS Code.
2. Select **"Full Stack"** and press **F5**.
   - This will start the Node.js backend. The backend serves the Vite frontend directly.

#### Via Terminal
- **Full Stack Start**: `npm run dev`

## Project Structure
- `src/`: React frontend source code.
- `server.js`: Node.js Express backend API, which also serves Vite in development.
- `vite.config.js`: Vite configuration.
- `.vscode/`: IDE-specific configurations.
