import { useContext } from "react";
import { FlashContext } from "../context/FlashContext.jsx";

export function useFlashMessage() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlashMessage must be used within a FlashProvider");
  return ctx;
}
