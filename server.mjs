import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) console.warn("⚠️ OPENAI_API_KEY non défini");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Aucun message reçu" });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es l’assistant FraxLv : un bot sympa, intelligent et précis." },
          { role: "user", content: message }
        ],
        max_tokens: 700,
        temperature: 0.8
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "Erreur OpenAI", status: r.status, body: text });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || "Erreur de réponse IA.";
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur", details: e.message });
  }
});

app.listen(PORT, () => console.log(`✅ Serveur FraxLv actif sur le port ${PORT}`));
