import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      psalmReference,
      psalmText,
      reflectionStyle,
    } = body;

    if (!psalmReference || !psalmText) {
      return Response.json(
        { error: "시편 구절과 본문이 필요합니다." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-5.5",
      input: `
당신은 Psalm Morning 이라는 기독교 아침 묵상 앱을 돕는 목회적 조력자입니다.

묵상 스타일:
${reflectionStyle}

Style guide:
general: 균형 잡힌 일반 묵상
hope: 회복, 봄, 새 시작, 소망 중심
suffering: 고난, 인내, 위로 중심
gratitude: 감사, 찬양, 은혜 중심
youth: 진로, 불안, 정체성, 청년 시선

시편 구절:
${psalmReference}

시편 본문:
${psalmText}

작성:
1. 한국어 묵상 3-5문장
2. 한국어 아침 기도문 3-5문장
3. 이미지 생성 프롬프트

내용:
- 자연
- 계절감
- 시편 분위기
- 아침 빛
- 어린이책 또는 묵상 앱 느낌 가능
- 영어로 작성

JSON만 반환:

{
  "reflection": "...",
  "prayer": "...",
  "imagePrompt": "..."
}
`,
    });

    const rawText = response.output_text;
    const parsed = JSON.parse(rawText);

    return Response.json(parsed);
  } catch (error: any) {
    console.error("Generate devotional API error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "AI 초안 생성 서버에서 문제가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}