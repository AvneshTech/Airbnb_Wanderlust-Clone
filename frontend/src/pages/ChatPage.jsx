import { useEffect, useState } from "react";
import { fetchChatHistory, sendChatMessage, clearChat } from "../api/chatApi.js";
import { useFlashMessage } from "../hooks/useFlashMessage.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { addFlash } = useFlashMessage();

  useEffect(() => {
    fetchChatHistory()
      .then((res) => setMessages(res.data.history || []))
      .catch(() => {});
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;
    setMessages((m) => [...m, { role: "user", content: message }]);
    setInput("");
    setTyping(true);
    try {
      const res = await sendChatMessage(message);
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      addFlash(err.response?.data?.message || "Chat error", "error");
    } finally {
      setTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearChat();
      setMessages([]);
      addFlash("Conversation cleared", "success");
    } catch (err) {
      addFlash(err.response?.data?.message || "Could not clear", "error");
    }
  };

  return (
    <div className="container col-md-8 offset-md-2 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">WanderLust Assistant</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleClear}>Clear conversation</button>
      </div>
      <ChatWindow messages={messages} typing={typing} />
      <form className="d-flex" onSubmit={handleSend}>
        <input
          className="form-control me-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn add-btn text-white" disabled={typing}>Send</button>
      </form>
    </div>
  );
}
