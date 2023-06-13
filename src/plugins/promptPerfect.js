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
    }
}