const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
const port = 3000;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(bodyParser.json());

// Route to handle incoming messages and interact with Claude Haiku
app.post('/chat', async (req, res) => {
  try {
    const systemMessage = fs.readFileSync('./content.txt', 'utf8').trim();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemMessage,
      messages: [{ role: "user", content: req.body.message }],
    });

    res.json({ response: { role: "assistant", content: message.content[0].text }, "status": "success" });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ "status": "timeout", "message": "Internal server error. Please try again later." });
  }
});

// Route for root path
app.get('/', (req, res) => {
  res.send('Hi, I am live.');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
