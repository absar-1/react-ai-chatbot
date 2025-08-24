import styles from './App.module.css';
import { Theme } from './components/Theme/Theme';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Chat } from './components/Chat/Chat';
import { VercelAI } from './assistants/vercel-ai';
import { useState, useMemo, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';

const assistant = new VercelAI();


function App() {

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const activeChatMessages = useMemo( () =>
    chats.find(({id}) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  useEffect(() => {
    handleNewChatCreate()
  },[])

  function handleChatMessagesUpdate(id, messages){
    const title = messages[0]?.content.split(" ").slice(0,7).join(" ");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: chat.title ?? title , messages } : chat
    ))
  }

  function handleNewChatCreate(){
    const id = uuidv4();
    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, {id, messages:[]}]);
  }

  function handleActiveChatIdChange(id){
    setActiveChatId(id);
    setChats((prevChats) => prevChats.filter(({messages}) => 
    messages.length > 0
    ))
  }

  return (
    <div className={styles.App}>


      <header className={styles.Header}>
        <img src="chat-bot-icon.png" className={styles.Logo} alt="ChatBot Logo"/>
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <Theme />

      <div className={styles.Content}>
        <Sidebar chats={chats} activeChatId={activeChatId} onActiveChatIdChange={handleActiveChatIdChange}
        onNewChatCreate={handleNewChatCreate} activeChatMessages={activeChatMessages}/>

        <main className={styles.Main}>
          {chats.map((chat) => (
          <Chat
            key={chat.id}
            assistant={assistant}
            isActive={chat.id === activeChatId}
            chatId={chat.id}
            chatMessages={chat.messages}
            onChatMessagesUpdate={handleChatMessagesUpdate}
          />
          ))}
        </main>

      </div>
    </div>
  );
}

export default App
