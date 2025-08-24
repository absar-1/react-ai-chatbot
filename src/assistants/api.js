export class Assistant {
  constructor(model = 'gemini-1.5-flash') {
    this.model = model;
    // Automatically detect the API base URL
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? `${window.location.origin}/api`
      : 'http://localhost:3000/api';
  }

  async chat(content) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          model: this.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  async *chatStream(content) {
    try {
      const response = await fetch(`${this.baseUrl}/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          model: this.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                yield parsed.text;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
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
