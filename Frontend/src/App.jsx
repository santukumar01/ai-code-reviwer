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

  const [code, setCode] = useState(`//Write Your Code Here`);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    setIsLoading(true);
    setAiResponse("");

    try {
      const response = await axios.post(
        "/ai/get-response", // ✅ relative path, works on Render + local
        { prompt: code }
      );
      console.log("Response from server:", response.data);

      setAiResponse(
        response.data.reply ||
          response.data.response ||
          response.data ||
          "⚠️ No response received."
      );
    } catch (error) {
      console.error("Axios Error:", error);
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
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div className="review" onClick={reviewCode}>
            Review
          </div>
        </div>

        <div className="right">
          {aiResponse && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                gap: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>💬 Review</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: "5px 10px",
                    fontSize: "0.9rem",
                    backgroundColor: copied ? "green" : "#333",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "✅ Copied!" : "📋 Copy Review"}
                </button>

                <button
                  onClick={downloadReview}
                  style={{
                    padding: "5px 10px",
                    fontSize: "0.9rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  📥 Download
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <p style={{ color: "#aaa", fontStyle: "italic" }}>
              ⏳ Reviewing Your code...
            </p>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{aiResponse}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
