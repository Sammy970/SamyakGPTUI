import axios from "axios";
import { extractTextAndCode } from "../functions/extractTextAndCode";

export async function webPilotApiOutput(prompt) {
    try {
        const response = await axios.post('https://test-server-deploy-nine.vercel.app/web-pilot', prompt);
        const value = response.data;
        return value;
    } catch (error) {
        console.log(error)
    }
}



export const webPilot = async (webPilotPlugin, user_input, webPilotPluginText, setBody, setMessages, apiKeyInput, urlInput, settingOptions) => {

    if (webPilotPlugin) {
        try {
            const response = await axios.post(
                urlInput.trim(),
                {
                    messages: [
                        {
                            "role": "system", "content": "Use the language that the user previously used or the language requested by the user. Respond to the user's request, which may include asking questions or requesting specific actions (such as translation, rewriting, etc.), based on the provided content. If the user does not make a request, perform the following tasks: 1. Display the title in the user's language; 2. Summarize the article content into a brief and easily understandable paragraph; 3. Depending on the content, present three thought-provoking questions or insights with appropriate subheadings. For articles, follow this approach; for code, formulas, or content not suited for questioning, this step may be skipped"
                        },

                        { "role": "user", "content": `${user_input} Understand this info and answer me the following question ${webPilotPluginText}` }
                    ],

                    "model": settingOptions.model
                    // max_tokens: 1000,
                    // temperature: 0.7,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${apiKeyInput.trim()}`,
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



export const seperateTextAndLink = async (input) => {
    try {
        // Regular expression pattern to match the link with single or double quotes
        const linkPattern = /(['"])(.*?)\1/;
        const linkMatch = input.match(linkPattern);
        const link = linkMatch ? linkMatch[2] : '';

        // Remove the link from the input string
        const text = input.replace(linkPattern, '').trim();

        return [link, text];

    } catch (error) {
        console.log(error)
    }
}