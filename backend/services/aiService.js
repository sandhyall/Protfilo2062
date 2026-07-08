import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── SYSTEM PROMPT ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the AI Assistant for Sandesh Innovations — a web and AI services company based in Kathmandu, Nepal.

Your role is to assist website visitors professionally, concisely, and helpfully. Always represent the company with confidence and warmth.

---

COMPANY OVERVIEW:
- Sandesh Innovations designs, builds, and delivers modern web and AI-powered solutions for businesses and individuals.
- Based in Kathmandu, Nepal, serving clients locally and internationally.
- Focused on practical, high-quality, and affordable technology solutions.

CONTACT INFORMATION:
- Location: Kathmandu, Nepal
- Email: sandeshdahal860@gmail.com
- Phone: +977 9769032520

---

SERVICES:
1. WEB DEVELOPMENT — Custom websites, business websites, portfolios, e-commerce stores, and web applications built with modern frameworks.
2. AI INTEGRATION & AUTOMATION — Custom AI chatbots, AI-powered customer support assistants, workflow automation, and integration of AI models (like GPT, Gemini, and other LLMs) into business systems.
3. UI/UX & FRONTEND DESIGN — Clean, responsive, user-friendly interfaces tailored to the client's brand.
4. MAINTENANCE & SUPPORT — Ongoing website and application support, updates, and technical maintenance.
5. CONSULTING — Guidance for businesses looking to adopt AI tools or modernize their web presence.

---

RESPONSE GUIDELINES:
- Be professional, warm, and concise.
- For service inquiries, briefly describe the relevant service and encourage the visitor to reach out for a consultation.
- For pricing or custom project requirements, direct visitors to: +977 9769032520 or sandeshdahal860@gmail.com.
- For urgent inquiries, encourage visitors to call or email directly for the fastest response.
- Never make up facts, figures, client names, or commitments not listed above.
- If you cannot answer something, say: "Our team can best assist you with that — please reach out at +977 9769032520 or sandeshdahal860@gmail.com."
`;

// ───────────────────────────────────────────────────────────────
// GROQ (PRIMARY)
// ───────────────────────────────────────────────────────────────
const getGroqResponse = async (messages) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
  model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.senderType === "visitor" ? "user" : "assistant",
        content: m.message,
      })),
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
};

// ───────────────────────────────────────────────────────────────
// OPENAI (OPTIONAL)
// ───────────────────────────────────────────────────────────────
const getOpenAIResponse = async (messages) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.senderType === "visitor" ? "user" : "assistant",
        content: m.message,
      })),
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content.trim();
};

// ───────────────────────────────────────────────────────────────
// GEMINI (FALLBACK)
// ───────────────────────────────────────────────────────────────
const getGeminiResponse = async (messages) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const history = [];
  const relevantMessages = messages.slice(-10);

  for (let i = 0; i < relevantMessages.length - 1; i++) {
    const msg = relevantMessages[i];
    history.push({
      role: msg.senderType === "visitor" ? "user" : "model",
      parts: [{ text: msg.message }],
    });
  }

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const lastMessage = relevantMessages[relevantMessages.length - 1];
  const result = await chat.sendMessage(lastMessage.message);

  return result.response.text().trim();
};

// ───────────────────────────────────────────────────────────────
// MAIN AI CONTROLLER (SMART FALLBACK SYSTEM)
// ───────────────────────────────────────────────────────────────
export const generateAIResponse = async (messageHistory) => {
  try {
    const provider = process.env.AI_PROVIDER || "groq";

    // 1️⃣ GROQ (FASTEST - DEFAULT)
    if (provider === "groq" && process.env.GROQ_API_KEY) {
      return await getGroqResponse(messageHistory);
    }

    // 2️⃣ OPENAI (OPTIONAL)
    // if (provider === "openai" && process.env.OPENAI_API_KEY) {
      //   return await getOpenAIResponse(messageHistory);}
    

    // 3️⃣ GEMINI (FALLBACK)
    if (process.env.GEMINI_API_KEY) {
      return await getGeminiResponse(messageHistory);
    }

    // 4️⃣ FINAL FALLBACK
    return "Thank you for contacting Sandesh Innovations! Our team will assist you shortly. You can also reach us at +977 9769032520 or sandeshdahal860@gmail.com.";
  } catch (error) {
    console.error("❌ AI Service Error:", error.message);
    return "Our AI assistant is temporarily unavailable. Please contact us directly at +977 9769032520 or sandeshdahal860@gmail.com — our team is ready to help.";
  }
};