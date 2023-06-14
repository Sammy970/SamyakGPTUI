import axios from "axios";
import { extractTextAndCode } from "../functions/extractTextAndCode";

export async function webSearchApiOutput(prompt) {
    try {
        const response = await axios.post('https://test-server-deploy-nine.vercel.app/web-search', prompt);
        const value = response.data;
        return value;
    } catch (error) {
        console.log(error)
    }
}

export const webSearch = async (webSearchPlugin, user_input, userInput, setBody, setMessages, apiKeyInput, urlInput, settingOptions) => {

    if (webSearchPlugin) {
        try {
            const response = await axios.post(
                urlInput.trim(),
                {
                    messages: [{ "role": "system", "content": "Search for information from the internet. You can easily suggest people anything. With the content provided to the users, you provide your own opinion based on the search results." }, { "role": "user", "content": `${user_input} Understand this info and answer me the following question ${userInput}` }],
                    "model": settingOptions.model
                    // max_tokens: 1000,
                    // temperature: 0.7,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${apiKeyInput}`,
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
