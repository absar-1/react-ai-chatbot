import styles from './Sidebar.module.css';
import { useState, useEffect } from 'react';

export function Sidebar({ chats , activeChatId, onActiveChatIdChange, onNewChatCreate, activeChatMessages }){
    const [isOpen, setIsOpen] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    
    // Check if the screen is tablet-sized
    useEffect(() => {
        const checkScreenSize = () => {
            setIsTablet(window.innerWidth <= 1024 && window.innerWidth >= 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

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

            <div className={styles.Sidebar} data-open={isOpen} data-tablet={isTablet}>
                <div className={styles.SidebarHeader}>
                    <h2 className={styles.SidebarTitle}>Conversations</h2>
                    <button className={styles.NewChatButton} disabled={activeChatMessages.length === 0} onClick={handleNewChatClick}>New Chat</button>
                </div>
                
                <div className={styles.ScrollableContainer}>
                    {chats.filter(({messages}) => messages.length > 0).length > 0 ? (
                        <ul className={styles.Chats}>
                            {chats.filter(({messages}) => messages.length > 0).map((chat) => (
                                <li key={chat.id} data-active={chat.id == activeChatId} className={styles.Chat} onClick={() => handleChatClick(chat.id)}>
                                    <button className={styles.ChatButton}>
                                        <div className={styles.ChatTitle}>{chat.title}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.EmptyState}>
                            <p>No conversations yet.</p>
                            <p>Start a new chat to begin!</p>
                        </div>
                    )}
                </div>
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
            fill="currentColor"
            className={styles.MenuIconSvg}
            >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
    );
}