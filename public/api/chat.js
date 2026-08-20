const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'মেসেজ দিন' });

  try {
    const apiKey = process.env.API_KEY;
    const apiBase = process.env.API_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.MODEL_NAME || 'gpt-3.5-turbo';

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'কোনো রিপ্লাই নেই';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'সার্ভার এরর' });
  }
});

module.exports = app;
