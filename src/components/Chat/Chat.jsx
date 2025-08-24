import { Messages } from '../Messages/Messages';
import { Controls } from '../Controls/Controls';
import { Loader } from '../Loader/Loader';
import styles from './Chat.module.css';
import { useState, useEffect, useRef } from 'react';

export function Chat({ assistant, chatId, chatMessages, onChatMessagesUpdate, isActive=false }){

    const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() =>{
    setMessages(chatMessages);
    }, [chatId]);

    useEffect(() => {
        onChatMessagesUpdate(chatId, messages);
    }, [messages])

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
    // Get chat history for context
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const stream = assistant.chatStream(content, history);
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
  
  // Focus on the response area after generating response
  setTimeout(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.focus();
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

if(!isActive) return null;

    return (
        <>
            {isLoading && <Loader/>}

            <div 
                ref={chatContainerRef}
                className={styles.Chat}
                tabIndex={-1}
                role="region"
                aria-label="Chat messages"
            >
                <Messages messages={messages}/>
            </div>

        <Controls onSend={handleContentSend} isDisabled={isLoading || isStreaming}/>

        </>
    );
}