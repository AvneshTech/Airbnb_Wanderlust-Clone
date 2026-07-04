import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble.jsx";

export default function ChatWindow({ messages, typing }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div
      className="border rounded p-3 mb-3"
      style={{ height: "55vh", overflowY: "auto", background: "#fff" }}
    >
      {messages.length === 0 && !typing && (
        <p className="text-muted text-center mt-5">Ask the WanderLust assistant anything about travel.</p>
      )}
      {messages.map((m, i) => (
        <ChatBubble key={i} role={m.role} text={m.content} />
      ))}
      {typing && <ChatBubble role="assistant" text="AI is typing..." />}
      <div ref={endRef} />
    </div>
  );
}
