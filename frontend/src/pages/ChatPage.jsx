import { useEffect, useState } from "react";
import { fetchChatHistory, sendChatMessage, clearChat } from "../api/chatApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import Loader from "../components/common/Loader.jsx";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addFlash } = useFlashMessage();

  useEffect(() => {
    fetchChatHistory()
      .then((res) => setMessages(res.data.history))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    // Guard: ignore empty input or concurrent in-flight requests
    if (!text || typing) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      // Show an error bubble inline in the chat thread so the failure is
      // clearly associated with the message, not just a floating toast.
      const errText =
        err.response?.data?.message || "Could not reach AI. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errText}`, isError: true },
      ]);
      addFlash(errText, "error");
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    try {
      await clearChat();
      setMessages([]);
    } catch {
      addFlash("Could not clear chat", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container col-md-8 offset-md-2 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">WanderLust AI Assistant</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>
          Clear chat
        </button>
      </div>
      <ChatWindow messages={messages} typing={typing} />
      <div className="input-group">
        <input
          className="form-control"
          placeholder="Ask about travel, stays, destinations…"
          value={input}
          disabled={typing}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat message"
        />
        <button
          className="btn btn-danger"
          onClick={handleSend}
          disabled={typing || !input.trim()}
        >
          {typing ? "Sending…" : "Send"}
        </button>
      </div>
      <p className="text-muted small mt-2">
        Press <kbd>Enter</kbd> to send &middot; <kbd>Shift+Enter</kbd> for a new line.
      </p>
    </div>
  );
}
