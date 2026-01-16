import { useState, useRef, useEffect } from "react";
import { generateContent } from "./services/geminiApi";
import "./App.css";
import AiMessage from "./AiMessage";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await generateContent(userText);
      const aiText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      // ✅ Direct AI message (NO typing effect)
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong." }
      ]);
    }

    setLoading(false);
  };



  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">✨</div>
            <h1>Cosmos ChatBoat</h1>
          </div>
          <div className="status">
            <span className="status-indicator"></span>
            <span>Online</span>
          </div>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          {messages.length === 0 && (
            <div className="welcome-screen">
              <div className="welcome-icon">🤖</div>
              <h2>Hello! I'm Gemini AI</h2>
              <p>Ask me anything! I can help with coding, explanations, creative writing, and more.</p>

            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "ai" ? "🤖" : "👤"}
                </div>
                <div className="message-content">
                  {msg.role === "ai" ? (
                    <AiMessage text={msg.text} />
                  ) : (
                    <div className="user-message">{msg.text}</div>
                  )}
                  <div className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-wrapper ai typing">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <footer className="chat-footer">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <div className="input-actions">
              <button
                className="send-button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                <span className="send-icon">➤</span>
              </button>
            </div>
          </div>

        </div>
        <p style={{ textAlign: 'center', padding: '10px' }}>Developed by Anjali Bambhaniya</p>

      </footer>
    </div>
  );
}

export default App;