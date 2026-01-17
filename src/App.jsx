import { useState, useRef, useEffect } from "react";
import { generateContent } from "./services/geminiApi";
import "./App.css";
import AiMessage from "./AiMessage";
import { FaMicrophone } from "react-icons/fa";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
import { IoSend } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { TbRobotFace } from "react-icons/tb";
function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN"; // English India (Gujarati mate "gu-IN" try kari shako)
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);
  const startListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // Gujarati mate: "gu-IN"
    utterance.rate = 1;      // speed (0.8 slow, 1 normal, 1.2 fast)
    utterance.pitch = 1;     // voice pitch

    window.speechSynthesis.cancel(); // previous voice stop
    window.speechSynthesis.speak(utterance);
  };

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
      speakText(aiText);
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
                  {msg.role === "ai" ? <TbRobotFace /> : <FaCircleUser />}
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
                className={`mic-button ${isListening ? "active" : ""}`}
                onClick={isListening ? stopListening : startListening}
                disabled={loading}
              >
                <FaMicrophone />
              </button>
              <button
                className="send-button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >

                <IoSend />

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