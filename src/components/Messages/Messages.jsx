import { useRef, useEffect, useMemo } from 'react';
import styles from './Messages.module.css';
import Markdown from 'react-markdown';

const WELCOME_MESSAGE_GROUP = [
  {
    role: 'assistant',
    content: 'Welcome to the AI Chatbot! How can I assist you?'
  },
];

export function Messages({ messages }) {

  const messagesEndRef = useRef(null);
  const messagesGroups = useMemo(() => messages.reduce((groups, message) => {
    if(message.role === 'user') {
      groups.push([]);
    }
    groups[groups.length - 1].push(message);
    return groups;
  }, []), [messages])

  useEffect(() => {
    const lastMessage = messages[messages.length-1];
    if(lastMessage?.role === 'user'){
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.Messages}>
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map((messages, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({ role, content }, index) => (
        <div key={index} data-role={role} className={styles.Message}>
          <div className={styles.Markdown}>
            <Markdown>
              {typeof content === 'function' ? content() : String(content)}
            </Markdown>
          </div>
        </div>
      ))}
        </div>
      ))}
      <div ref={messagesEndRef}/>
    </div>
  );
}