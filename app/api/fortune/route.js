export const runtime = "edge"; // 선택: Vercel 배포 시 edge function

export async function POST(req) {
    const { input } = await req.json();

    const prompt = `
당신은 감성적인 행복 분석가입니다.
다음 문장을 읽고, 그 사람의 오늘 행복 지수를 0~100점으로 정수로 판단해 주세요.

결과는 아래의 JSON 형식으로만, 불필요한 설명 없이 정확히 출력하세요:

{
  "score": 87,
  "message": "소소하지만 확실한 행복이에요 ☀️"
}

문장: "${input}"
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    try {
        const parsed = JSON.parse(content);
        return Response.json(parsed); // → { score: 87, message: "..." }
    } catch (e) {
        return Response.json({
            score: 0,
            message: "행복지수 분석에 실패했어요. 다시 시도해 주세요 🥲",
        });
    }
}
