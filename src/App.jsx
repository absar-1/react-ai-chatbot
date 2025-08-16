import styles from './App.module.css';
import { Chat } from './components/Chat/Chat';
import { useState } from 'react';
import { Controls } from './components/Controls/Controls';
import { Assistant } from './assistants/googleai';
import { Loader } from './components/Loader/Loader';
import { Theme } from './components/Theme/Theme';



function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const assistant = new Assistant();

  function addMessage(message){
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function updateLastMessageContent(content){
    setMessages((prevMessages) => prevMessages.map((message, index) =>
      index === prevMessages.length-1 ? {...message, content: `${message.content}${content}`} : message
  ))
  }

async function handleContentSend(content) {
  addMessage({ content, role: 'user' });
  setIsLoading(true);

  try {
    const stream = assistant.chatStream(content);
    let isFirstChunk = true;

    for await (const chunk of stream) {
      if (isFirstChunk) {
        addMessage({ content: chunk, role: 'assistant' });
        isFirstChunk = false;
        setIsLoading(false);
        setIsStreaming(true);
      } else {
        updateLastMessageContent(chunk);
      }
    }
  } catch (error) {
    addMessage({
      content: error.message ?? 'Sorry, I could not process your request. Please try again',
      role: 'system',
    });
  }

  setIsLoading(false);
  setIsStreaming(false);
}


  return (
    <div className={styles.App}>

      {isLoading && <Loader/>}


      <header className={styles.Header}>
        <img src="chat-bot-icon.png" className={styles.Logo} alt="ChatBot Logo"/>
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <Theme />

      <div className={styles.ChatContainer}>
        <Chat messages={messages}/>
      </div>

      <Controls onSend={handleContentSend} isDisabled={isLoading || isStreaming}/>
    </div>
  );
}

export default App
