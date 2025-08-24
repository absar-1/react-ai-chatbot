export class VercelAI {
  constructor() {
    this.apiUrl = '/api/chat';
  }

  async *chatStream(message, history = []) {
    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        
        // Check if response is JSON or HTML/text
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = `JSON parsing error: ${parseError.message}`;
          }
        } else {
          // Response is HTML or text (likely an error page)
          const errorText = await response.text();
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}...`;
        }
        
        throw new Error(errorMessage);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
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
      console.error('Chat stream error:', error);
      throw error;
    }
  }

  async chat(message, history = []) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get response';
        
        // Check if response is JSON or HTML/text
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            errorMessage = `JSON parsing error: ${parseError.message}`;
          }
        } else {
          // Response is HTML or text (likely an error page)
          const errorText = await response.text();
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}...`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
}
