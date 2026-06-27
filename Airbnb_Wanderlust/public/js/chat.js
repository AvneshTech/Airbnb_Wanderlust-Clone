document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const chatbox = document.getElementById('chatbox');
  const messageInput = document.getElementById('message');
  const sendBtn = document.getElementById('sendBtn');

  function appendMessage(who, text) {
    const wrapper = document.createElement('div');
    wrapper.className = who === 'user' ? 'text-end mb-2' : 'text-start mb-2';
    const bubble = document.createElement('div');
    bubble.style.display = 'inline-block';
    bubble.style.padding = '8px 12px';
    bubble.style.borderRadius = '12px';
    bubble.style.maxWidth = '80%';
    bubble.innerText = text;
    if (who === 'user') {
      bubble.style.background = '#0d6efd';
      bubble.style.color = 'white';
    } else {
      bubble.style.background = '#e9ecef';
      bubble.style.color = '#212529';
    }
    wrapper.appendChild(bubble);
    chatbox.appendChild(wrapper);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    messageInput.value = '';
    sendBtn.disabled = true;

    // show typing
    const typing = document.createElement('div');
    typing.className = 'text-start mb-2';
    typing.id = 'typing-indicator';
    const tdiv = document.createElement('div');
    tdiv.style.display = 'inline-block';
    tdiv.style.padding = '8px 12px';
    tdiv.style.borderRadius = '12px';
    tdiv.style.background = '#e9ecef';
    tdiv.innerText = 'AI is typing...';
    typing.appendChild(tdiv);
    chatbox.appendChild(typing);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'No response';
      document.getElementById('typing-indicator')?.remove();
      appendMessage('ai', reply);
    } catch (err) {
      console.error('Chat error', err);
      document.getElementById('typing-indicator')?.remove();
      appendMessage('ai', 'Error communicating with server');
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Clear conversation button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/chat/clear', { method: 'POST' });
        const json = await res.json();
        if (json && json.ok) {
          chatbox.innerHTML = '';
        }
      } catch (err) {
        console.error('Failed to clear conversation', err);
      }
    });
  }
});
