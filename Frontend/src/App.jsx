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

  const [code, setCode] = useState(`function sum() {
  return a + b;
}`);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    setIsLoading(true);
    setAiResponse("");

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-response",
        {
          prompt: code,
        }
      );

      console.log("Response from server:", response.data);

      // Try handling multiple formats
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
