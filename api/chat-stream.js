import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], model = 'gemini-1.5-flash' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for API key
    if (!process.env.GOOGLE_AI_API_KEY) {
      return res.status(500).json({ error: 'Google AI API key not configured' });
    }

    // Set up streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create a new chat session
    const chat = googleai.chats.create({ model });
    
    // Add history to the chat if provided
    if (history.length > 0) {
      for (const msg of history) {
        if (msg.role === 'user') {
          await chat.sendMessage({ message: msg.content });
        }
      }
    }
    
    // Send the current message and get streaming response
    const result = await chat.sendMessageStream({ message });
    
    // Stream the response
    for await (const chunk of result) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    // Send end marker
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Chat Stream API Error:', error);
    
    // Parse and return a user-friendly error
    let errorMessage = 'An unknown error occurred';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error?.message === 'string') {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.error?.message) {
          errorMessage = parsed.error.message;
        } else {
          errorMessage = error.message;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    // Send error as SSE
    if (!res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
}
