import styles from './Controls.module.css';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export function Controls({ onSend, isDisabled=false }) {

    const textAreaRef = useRef(null);
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isDisabled) {
            textAreaRef.current.focus();
            setIsFocused(true);
        }
    }, [isDisabled]);

    function handleContentChange(event) {
        setContent(event.target.value);
    }

    function handleContentSend() {
        if(content.trim().length > 0){
            onSend(content);
            setContent('');
        }
    }

    function handleEnterPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleContentSend();
        }
    }
    
    function handleFocus() {
        setIsFocused(true);
    }
    
    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextareaAutosize
                    ref={textAreaRef}
                    disabled={isDisabled}
                    minRows={1}
                    maxRows={isFocused ? 3 : 1}
                    placeholder="Message AI Chatbot" 
                    className={`${styles.TextArea} ${isFocused ? styles.Focused : ''}`}
                    value={content}
                    onChange={handleContentChange}
                    onKeyDown={handleEnterPress}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>
            <button className={styles.Button} onClick={handleContentSend} disabled={isDisabled}>
                <SendIcon />
            </button>
        </div>
    );
}

function SendIcon(){
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
        >
        <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
        </svg>
    );
}