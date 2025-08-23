import { useEffect, useState } from "react";

import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(`// Write Your Code Here`);
  const [language, setLanguage] = useState("javascript");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    setIsLoading(true);
    setAiResponse("");

    try {
      const response = await axios.post("/ai/get-response", { prompt: code });
      setAiResponse(
        response.data.reply ||
          response.data.response ||
          response.data ||
          "⚠️ No response received."
      );
    } catch (error) {
      setAiResponse(
        "⚠️ Error: " + (error.response?.data || "Something went wrong.")
      );
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReview = () => {
    if (!aiResponse) return;
    const blob = new Blob([aiResponse], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "review.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* 🔹 Header */}
      <header className="header">
        <h1>⚡ AI Code Reviewer</h1>
        <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      {/* 🔹 Main Layout */}
      <main className="workspace">
        {/* Left: Code Editor */}
        <section className="left-panel">
          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages[language], language)
              }
              padding={15}
              className="editor"
            />
          </div>

          <div className="controls">
            <button className="review-btn" onClick={reviewCode}>
              🚀 Review Code
            </button>
          </div>
        </section>

        {/* Right: AI Review Output */}
        <section className="right-panel">
          <h2>💬 AI Review</h2>
          {isLoading ? (
            <p className="loading">⏳ Reviewing your code...</p>
          ) : aiResponse ? (
            <>
              <div className="review-actions">
                <button onClick={copyToClipboard}>
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <button onClick={downloadReview}>📥 Download</button>
              </div>
              <div className="review-output">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {aiResponse}
                </Markdown>
              </div>
            </>
          ) : (
            <p className="placeholder">👈 Paste code and click review</p>
          )}
        </section>
      </main>

      {/* 🔹 Footer */}
      <footer className="footer">
        <p>Powered by AI | Built with ❤️ by Santu</p>
      </footer>
    </div>
  );
}

export default App;
