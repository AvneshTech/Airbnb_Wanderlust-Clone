const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { isLoggedIn } = require('../middleware');

// OpenAI client will be created lazily to avoid startup errors when API key is missing
let client = null;

function getClient() {
    if (!client) {
        if (!process.env.vck_2EPkK4RM2eHRKM3eVNKMWcmvVPhHYcIiXjNR7o6Qpp8Z6V688n30g2r6) {
            // leave client null; callers should check and return helpful error
            return null;
        }
        client = new OpenAI({ apiKey: process.env.vck_2EPkK4RM2eHRKM3eVNKMWcmvVPhHYcIiXjNR7o6Qpp8Z6V688n30g2r6 });
    }
    return client;
}

// Render chat page (only for logged-in users)
router.get('/chat', isLoggedIn, (req, res) => {
    const history = req.session.chatHistory || [];
    // send only user/assistant messages to the view (skip system prompt)
    const visible = history.filter(m => m.role === 'user' || m.role === 'assistant');
    res.render('chat', { chatHistory: visible });
});

// Clear conversation
router.post('/chat/clear', isLoggedIn, (req, res) => {
    req.session.chatHistory = null;
    res.json({ ok: true });
});

// Handle chat post requests with session-based multi-turn history
router.post('/chat', isLoggedIn, async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key not configured on server' });
        }

        // Initialize chat history in session
        if (!req.session.chatHistory) {
            req.session.chatHistory = [
                { role: 'system', content: 'You are a helpful assistant.' }
            ];
        }
        // Append user message
        req.session.chatHistory.push({ role: 'user', content: message });

        // Create client lazily
        const theClient = getClient();
        if (!theClient) {
            return res.status(500).json({ error: 'OpenAI API key not configured on server' });
        }

        // Call OpenAI with the full conversation
        const completion = await theClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: req.session.chatHistory,
            max_tokens: 400
        });

        const reply = completion.choices && completion.choices[0] && completion.choices[0].message
            ? completion.choices[0].message.content
            : 'No response from AI';

        // Append assistant reply to history
        req.session.chatHistory.push({ role: 'assistant', content: reply });

        res.json({ reply });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
