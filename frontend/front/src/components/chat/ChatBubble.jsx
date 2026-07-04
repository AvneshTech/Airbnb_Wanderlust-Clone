export default function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "text-end mb-2" : "text-start mb-2"}>
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: 12,
          maxWidth: "80%",
          background: isUser ? "#0d6efd" : "#e9ecef",
          color: isUser ? "white" : "#212529",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}
