const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const generateImage = async (prompt) => {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    const imageBase64 =
        data.candidates[0].content.parts.find(
            (p) => p.inlineData
        ).inlineData.data;

    return `data:image/png;base64,${imageBase64}`;
};
