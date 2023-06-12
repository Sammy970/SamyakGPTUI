import axios from "axios";
import { extractTextAndCode } from "../functions/extractTextAndCode";

export async function rephrasePrompt(prompt) {
    try {
        const response = await axios.post('https://test-server-deploy-nine.vercel.app/prompt-perfect', { prompt });
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Rephrasing request failed');
    }
}

export const promptPerfect = async (promptPlugin, user_input, setBody, setMessages) => {

    console.log(promptPlugin);

    if (promptPlugin) {
        try {
            const botResponse = user_input

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
    } else {
        try {
            const response = await axios.post(
                "https://api.pawan.krd/v1/chat/completions",
                {
                    messages: [{ "role": "system", "content": "You are a Prompt Perfect Plugin made by Sammy970. Your job is to help users to create a perfect prompt. In order to create the perfect prompt they need to type `? ` and then the prompt." }, { "role": "user", "content": "How to use this plugin? Don't tell extra stuff just tell me whats important" }],
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
    }
}