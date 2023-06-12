
export const extractTextAndCode = (input) => {
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