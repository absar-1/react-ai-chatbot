import styles from './Sidebar.module.css';
import { useState, useEffect } from 'react';



export function Sidebar({ chats , activeChatId, onActiveChatIdChange, onNewChatCreate, activeChatMessages }){

    const [isOpen, setIsOpen] = useState(false);

    function handleSidebarToggle(){
        setIsOpen(!isOpen);
    }

    // Add global escape key listener
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isOpen && event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    function handleChatClick(chatId){
        onActiveChatIdChange(chatId);
        setIsOpen(false); // Close sidebar when chat is clicked
    }

    function handleNewChatClick(){
        onNewChatCreate();
        setIsOpen(false); // Close sidebar when new chat is created
    }

    return (
        <>

            <button className={styles.MenuButton} onClick={handleSidebarToggle}>
                <MenuIcon />
            </button>

            <div className={styles.Sidebar} data-open={isOpen}>
                <button className={styles.NewChatButton} disabled={activeChatMessages.length === 0} onClick={handleNewChatClick}>New Chat</button>
                <ul className={styles.Chats}>
                    {chats.filter(({messages}) => messages.length > 0).map((chat) => (
                        <li key={chat.id} data-active={chat.id == activeChatId} className={styles.Chat} onClick={() => handleChatClick(chat.id)}>
                            <button className={styles.ChatButton}>
                                <div className={styles.ChatTitle}>{chat.title}</div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isOpen && <div className={styles.Overlay} onClick={handleSidebarToggle}></div>}
        </>
    );
}

function MenuIcon(){
    return(
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            height="24px" viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
            >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
    );
}