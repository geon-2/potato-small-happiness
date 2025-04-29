export async function POST(request) {
    const { input } = await request.json();
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000", // 개발중이라 localhost
            "X-Title": "Small Happiness Score",
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "사용자가 적은 오늘의 행동을 기반으로 행복 지수를 0부터 100까지 매기고, 짧은 이유를 한 문장으로 설명해줘. 너무 길거나 무겁게 쓰지 말고 밝고 가볍게 해줘."
                },
                {
                    role: "user",
                    content: `오늘 내가 한 일: ${input}`
                }
            ],
            max_tokens: 100,
        }),
    });

    const data = await response.json();

    if (data.error) {
        return new Response(JSON.stringify({ error: data.error }), { status: 500 });
    }

    const message = data.choices[0]?.message?.content?.trim() || "행복 지수를 가져오지 못했어요.";

    return new Response(JSON.stringify({ message }), { status: 200 });
}
