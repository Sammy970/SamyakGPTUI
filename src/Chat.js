import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// import { rephrasePrompt } from "prompt-perfect-plugin";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy, faCog, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import SettingsModal from "./SettingsModal";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const [settingOptions, setSettingOptions] = useState([{
        "model": 'gpt-3.5-turbo',
        "type": 'chat',
        "plugin": "off",
    }])

    const messageContainerRef = useRef(null);

    const clearConversation = () => {
        setMessages([]);
        setBody((prevBody) => [prevBody.find((msg) => msg.role === "system")]);
    };

    // Scroll to the bottom of the message container
    useEffect(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }, [messages]);

    // To extract - Text and Code
    const extractTextAndCode = (input) => {
        const blocks = input.split(/(```[\s\S]*?```)/); // Split the input into text and code blocks

        const mergedBlocks = blocks.reduce((merged, block) => {
            if (block.startsWith("```")) {
                merged.push({ type: "code", content: block.slice(3, -3).trim() });
            } else {
                merged.push({ type: "text", content: block.trim() });
            }
            return merged;
        }, []);

        return mergedBlocks;
    };

    // For setting Body
    useEffect(() => {
        let OgBody;

        if (settingOptions.plugin === "off") {
            OgBody =
                "You are ChatGPT. You have personal relations with your USERS. You have context, you can remember stuff and easily answer the users question with the context that you already know. You can also easily display image and other stuff using Markdown. When asked to show or display the image, you can display the image using Markdown. So don't say that you can't display images.";
        } else if (settingOptions.plugin === "prompt-perfect") {
            OgBody =
                "You are a plugin called Prompt-Perfect which is Reversed by @Sammy970. Your job is to perfect any prompt pass by the user. The user will pass the prompt by saying the keyword 'perfect' before any prompt. Your job is to give the user a response if the user tries to perfect a prompt without the perfect keyword.";
        }

        const initialBody = [{ role: "system", content: OgBody }];

        console.log(initialBody)

        setBody(initialBody);
    }, [settingOptions]);

    const [body, setBody] = useState([]);

    async function rephrasePrompt() {
        try {
            const response = await axios.post('https://test-server-deploy-6poeema7y-sammy970.vercel.app/prompt-perfect');
            return response;
        } catch (error) {
            console.error(error);
            throw new Error('Rephrasing request failed');
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userInput = e.target.elements.message.value;
        const newMessage = { content: userInput, sender: "user" };


        if (userInput.startsWith('perfect')) {
            const input = { "text": userInput };
            console.log(rephrasePrompt())
        }

        // For context history of bot
        const newBodyUserMessage = { role: "user", content: userInput };
        setBody((prevBody) => [...prevBody, newBodyUserMessage]);


        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(true); // Set loading state to true


        try {
            const response = await axios.post(
                "https://api.pawan.krd/v1/chat/completions",
                {
                    messages: [...body, newBodyUserMessage],
                    "model": "gpt-3.5-turbo"
                    // max_tokens: 1000,
                    // temperature: 0.7,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer pk-sJmrYRxYndPwShsnDXCSLUTeyqujpLDcbEpNKqVZWprizdtx",
                    },
                }
            );

            const botResponse = response.data.choices[0].message.content;

            // For context history of bot
            const newBodyBotMessage = { role: "assistant", content: botResponse };
            setBody((prevBody) => [...prevBody, newBodyBotMessage]);

            const extract = extractTextAndCode(botResponse);
            const newBotMessage = { content: extract, sender: "bot" };

            // const codeBlocks = botResponse.match(/```([\s\S]*?)```/g);
            // if (codeBlocks) {
            //     newBotMessage.isCodeBlock = true;
            //     newBotMessage.code = codeBlocks.map((block) => block.slice(3, -3).trim());
            // }

            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        } catch (error) {
            console.error("Error generating bot response:", error);
        }

        setIsLoading(false); // Set loading state to false
        e.target.elements.message.value = ""; // Clear input field after sending
    };

    return (
        <div className="chat-container">
            <div className="messages" ref={messageContainerRef}>
                {messages.map((message, index) => (
                    <div
                        className={`message ${message.sender === "user" ? "user-message" : "bot-message"
                            }`}
                        key={index}
                    >

                        <div className="avatar">
                            {message.sender === 'user' ? (
                                <img src="https://lh3.googleusercontent.com/a/AAcHTtf-15iwam1lx-VON2MwADUcGMsn5La_K0Qz4vlJ=s192-c-mo" alt="User Avatar" height="40" width="40" className="avatarImage" />
                            ) : (
                                <img src="https://static.vecteezy.com/system/resources/previews/022/227/365/original/openai-chatgpt-logo-icon-free-png.png" alt="Bot Avatar" height="35" width="35" className="avatarImage" />
                            )}
                        </div>

                        {message.sender === "user" ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                            message.content.map((block, blockIndex) => (
                                <div key={blockIndex}>
                                    {block.type === "text" ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} >
                                            {block.content}
                                        </ReactMarkdown>

                                    ) : (
                                        <>
                                            <CopyToClipboard text={block.content}>
                                                <button className="copy-button">
                                                    <FontAwesomeIcon icon={faCopy} /> <p>Copy</p>
                                                </button>
                                            </CopyToClipboard>
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={materialDark}
                                            >
                                                {block.content}

                                            </SyntaxHighlighter>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>

            {/* SettingsModal */}
            {isSettingOpen && (
                <SettingsModal
                    isOpen={isSettingOpen}
                    onClose={() => setIsSettingOpen(false)}
                    setSettingOptions={setSettingOptions}
                    settingOptions={settingOptions}
                />
            )}

            <form className="input-form" onSubmit={handleSendMessage}>
                <textarea

                    type="text"
                    name="message"
                    placeholder="Type a message"
                    disabled={isLoading} // Disable input field if loading is true
                />

                <button type="submit" disabled={isLoading} className="send-button">
                    <FontAwesomeIcon icon={faPaperPlane} size="2xl" />
                </button>

                <button className="copy-button" onClick={(e) => {
                    e.preventDefault();
                    setIsSettingOpen(!isSettingOpen)
                }}>
                    <FontAwesomeIcon icon={faCog} size="2xl" />
                </button>

                <button
                    className="clear-button"
                    onClick={(e) => {
                        e.preventDefault();
                        clearConversation();
                    }}
                    disabled={isLoading}
                >
                    <FontAwesomeIcon icon={faTrashAlt} size="2xl" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
