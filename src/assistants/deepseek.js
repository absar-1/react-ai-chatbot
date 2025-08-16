import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;
  #client;

  constructor(model = "deepseek-chat", client = openai) {
    this.#model = model;
    this.#client = client;
  }

  async *chatStream(userMessage) {
    const stream = await this.#client.chat.completions.create({
      model: this.#model,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) {
        yield token;
      }
    }
  }
}