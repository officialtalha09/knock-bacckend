const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// সার্ভার ঠিকমতো চলছে কি না চেক করার জন্য
app.get('/', (req, res) => {
    res.send("Knock Backend is Running!");
});

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GROQ_API_KEY; 
        if (!apiKey) return res.status(500).json({ error: "API Key missing in Render Environment" });

        // সরাসরি fetch এর বদলে Node 18+ এর গ্লোবাল fetch ব্যবহার
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: req.body.messages
            })
        });

        const data = await response.json();
        
        // যদি Groq থেকে এরর আসে, সেটা ফ্রন্টএন্ডে পাঠিয়ে দাও
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching from Groq:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));