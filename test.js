import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';
import ReactMarkdown from 'react-markdown'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';



const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userInput = e.target.elements.message.value;
        const newMessage = { content: userInput, sender: 'user' };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(true); // Set loading state to true

        try {
            const response = await axios.post(
                'https://api.pawan.krd/v1/chat/completions',
                {
                    messages: [{ "role": "user", "content": userInput }],
                    // max_tokens: 50,
                    // temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer pk-sJmrYRxYndPwShsnDXCSLUTeyqujpLDcbEpNKqVZWprizdtx',
                    },
                }
            );

            const botResponse = response.data.choices[0].message.content;
            const newBotMessage = { content: botResponse, sender: 'bot' };

            console.log(botResponse);

            const codeBlocks = botResponse.match(/```([\s\S]*?)```/g);
            if (codeBlocks) {
                newBotMessage.isCodeBlock = true;
                newBotMessage.code = codeBlocks.map((block) => block.slice(3, -3).trim());
            }

            console.log(codeBlocks)

            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        } catch (error) {
            console.error('Error generating bot response:', error);
        }

        setIsLoading(false); // Set loading state to false
        e.target.elements.message.value = ''; // Clear input field after sending
    };


    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((message, index) => (
                    <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        key={index}
                    >
                        {message.isCodeBlock ? (
                            message.code.map((code, idx) => (
                                <SyntaxHighlighter language="javascript " style={materialDark} key={idx}>
                                    {code}
                                </SyntaxHighlighter>
                            ))
                        ) : (
                            message.content
                        )}
                    </div>
                ))}
            </div>
            <form className="input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    name="message"
                    placeholder="Type a message"
                    disabled={isLoading} // Disable input field if loading is true
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>

            </form>
        </div>
    );
};

export default Chat;
