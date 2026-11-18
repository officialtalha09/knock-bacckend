const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Knock Backend is Running!");
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.json({ choices: [{ message: { content: "API Key pai nai vai, Render e GROQ_API_KEY bosao" } }] });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: req.body.messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ choices: [{ message: { content: "Groq ekhon busy, 1 min pore abar try koro vai!" } }] });
    }
    res.json(data);
  } catch (error) {
    res.json({ choices: [{ message: { content: "Server ektu ghumacchilo, abar try koro!" } }] });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));