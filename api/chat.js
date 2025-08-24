import { GoogleGenerativeAI } from '@google/genai';

export default async function handler(req, res) {
  console.log('=== API HANDLER START ===');
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API request received:', { method: req.method, url: req.url });
    console.log('Request headers:', req.headers);
    
    const { message, history = [] } = req.body;
    console.log('Request body:', { message: message?.substring(0, 50) + '...', historyLength: history.length });

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('API key present:', !!apiKey);
    console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
    
    if (!apiKey) {
      console.log('No API key found');
      return res.status(500).json({ error: 'Google AI API key not configured' });
    }

    console.log('Initializing Google AI...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('Google AI initialized successfully');

    // Set up response headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create chat session with history
    console.log('Creating chat session with history length:', history.length);
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });
    console.log('Chat session created');

    // Send the message and get streaming response
    console.log('Sending message to Google AI...');
    const result = await chat.sendMessageStream(message);
    console.log('Message sent, starting stream...');

    // Stream the response
    let chunkCount = 0;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
        chunkCount++;
      }
    }
    console.log('Stream completed, chunks sent:', chunkCount);

    res.end();
    console.log('=== API HANDLER END ===');

  } catch (error) {
    console.error('=== CHAT API ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Headers sent:', res.headersSent);
    
    // Ensure we're not trying to send multiple responses
    if (!res.headersSent) {
      console.log('Sending error response to client');
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    } else {
      console.log('Headers already sent, cannot send error response');
    }
    console.error('=== END CHAT API ERROR ===');
  }
}
