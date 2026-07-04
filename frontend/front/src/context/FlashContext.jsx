import { createContext, useState, useCallback } from "react";

export const FlashContext = createContext(null);

let idCounter = 0;

export function FlashProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const removeFlash = useCallback((id) => {
    setMessages((msgs) => msgs.filter((m) => m.id !== id));
  }, []);

  const addFlash = useCallback(
    (text, type = "success") => {
      const id = ++idCounter;
      setMessages((msgs) => [...msgs, { id, text, type }]);
      setTimeout(() => removeFlash(id), 4000);
    },
    [removeFlash]
  );

  return (
    <FlashContext.Provider value={{ messages, addFlash, removeFlash }}>
      {children}
    </FlashContext.Provider>
  );
}
