import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});


export class Assistant {

    #chat;

  constructor(model = 'gemini-1.5-flash') {
    this.#chat = googleai.chats.create({model});
  }

  async chat(content) {
    try {
        const result = await this.#chat.sendMessage({message: content});
        return result.text;
    } catch (error) {
        throw this.#parseError(error);
    }
  }

  async *chatStream(content){
    try {
      const result = await this.#chat.sendMessageStream({message: content})

      for await (const chunk of result){
        yield chunk.text;
      }
    } catch (error) {
      throw this.#parseError(error);
    }
  }

#parseError(error) {
  try {
    if (error?.error?.message) {
      return new Error(error.error.message);
    }

    if (typeof error?.message === 'string') {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.error?.message) {
          return new Error(parsed.error.message);
        }
      } catch {
        return new Error(error.message);
      }
    }

    return new Error(JSON.stringify(error));
  } catch {
    return new Error('An unknown error occurred');
  }
}

}
