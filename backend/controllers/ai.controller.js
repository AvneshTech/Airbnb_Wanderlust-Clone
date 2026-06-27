const OpenAI = require("openai");

// Lazy client so the app still boots if the key check is handled at startup.
let client = null;
function getClient() {
  if (!client && process.env.OPENAI_API_KEY) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

// GET /api/chat/history  (auth)
module.exports.history = (req, res) => {
  const history = req.session.chatHistory || [];
  const visible = history.filter((m) => m.role === "user" || m.role === "assistant");
  res.json({ history: visible });
};

// POST /api/chat  (auth, rate limited)
module.exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "No message provided" });
    }

    const theClient = getClient();
    if (!theClient) {
      return res.status(500).json({ message: "OpenAI API key not configured on server" });
    }

    if (!req.session.chatHistory) {
      req.session.chatHistory = [{ role: "system", content: "You are a helpful assistant for WanderLust, a travel stays platform." }];
    }
    req.session.chatHistory.push({ role: "user", content: message });

    const completion = await theClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: req.session.chatHistory,
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content || "No response from AI";
    req.session.chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
};

// POST /api/chat/clear  (auth)
module.exports.clear = (req, res) => {
  req.session.chatHistory = null;
  res.json({ message: "Conversation cleared" });
};
