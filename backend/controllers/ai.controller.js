const OpenAI = require("openai");

// Maximum number of non-system messages kept in session. Prevents unbounded
// session growth and ensures we never exceed the model's context window or
// incur runaway token costs on long conversations.
const MAX_HISTORY_TURNS = 20; // 20 turns = up to 40 messages (user+assistant)

// OpenAI request timeout in ms. The SDK default is ~10 min which is far too
// long for a user-facing chat endpoint; 25 s gives the model ample time while
// keeping the UX responsive.
const OPENAI_TIMEOUT_MS = 25_000;

// Lazy client so the app still boots if the key check is handled at startup.
let client = null;
function getClient() {
  if (!client && process.env.OPENAI_API_KEY) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: OPENAI_TIMEOUT_MS,
    });
  }
  return client;
}

const SYSTEM_PROMPT = {
  role: "system",
  content: "You are a helpful assistant for WanderLust, a travel stays platform. " +
    "Help users find stays, plan trips, and answer questions about listings. " +
    "Keep answers concise and friendly.",
};

// GET /api/chat/history  (auth)
module.exports.history = (req, res) => {
  const history = req.session.chatHistory || [];
  const visible = history.filter((m) => m.role === "user" || m.role === "assistant");
  res.json({ history: visible });
};

// POST /api/chat  (auth, rate limited)
module.exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "No message provided" });
  }

  const theClient = getClient();
  if (!theClient) {
    return res.status(503).json({
      message: "AI chat is temporarily unavailable. Please try again later.",
    });
  }

  // Build or restore in-session history (system prompt not stored in session
  // to avoid it counting toward the turn cap and being accidentally removed).
  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }
  req.session.chatHistory.push({ role: "user", content: message.trim() });

  // Enforce the turn cap: keep only the most recent MAX_HISTORY_TURNS pairs.
  // This trims oldest turns first, keeping the conversation coherent.
  const maxMsgs = MAX_HISTORY_TURNS * 2;
  if (req.session.chatHistory.length > maxMsgs) {
    req.session.chatHistory = req.session.chatHistory.slice(-maxMsgs);
  }

  const messages = [SYSTEM_PROMPT, ...req.session.chatHistory];

  try {
    const completion = await theClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
    req.session.chatHistory.push({ role: "assistant", content: reply });
    res.json({ reply });
  } catch (err) {
    // Distinguish timeout from other API errors for clearer user-facing messaging.
    const isTimeout = err.name === "APIConnectionTimeoutError" || err.code === "ETIMEDOUT";
    const isRateLimit = err.status === 429;

    const userMessage = isTimeout
      ? "The AI took too long to respond. Please try again."
      : isRateLimit
        ? "AI service is busy right now. Please wait a moment and try again."
        : "AI chat is temporarily unavailable. Please try again later.";

    // Pop the user message we just pushed so the failed turn isn't persisted
    // in history — otherwise every retry duplicates the user's message.
    if (req.session.chatHistory?.at(-1)?.role === "user") {
      req.session.chatHistory.pop();
    }

    // Log unexpected non-client errors for debugging while returning a clean
    // user-facing message rather than exposing internals.
    if (!isTimeout && !isRateLimit) {
      console.error("OpenAI error:", err);
    }

    res.status(503).json({ message: userMessage });
  }
};

// POST /api/chat/clear  (auth)
module.exports.clear = (req, res) => {
  req.session.chatHistory = null;
  res.json({ message: "Conversation cleared" });
};
