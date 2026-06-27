import { useFlashMessage } from "../../hooks/useFlashMessage.js";

// Toast-style flash messages, replacing the original server-rendered flash partial.
export default function FlashAlert() {
  const { messages, removeFlash } = useFlashMessage();
  if (!messages.length) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 2050, marginTop: "5.5rem" }}
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className={`alert ${m.type === "error" ? "alert-danger" : "alert-success"} alert-dismissible shadow-sm`}
          role="alert"
        >
          {m.text}
          <button type="button" className="btn-close" onClick={() => removeFlash(m.id)}></button>
        </div>
      ))}
    </div>
  );
}
