import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "prnate7936@gmail.com";
const ALLOWED_STYLES = new Set([
  "general",
  "hope",
  "suffering",
  "gratitude",
  "youth",
]);

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: "Supabase 서버 설정이 필요합니다." },
        { status: 500 }
      );
    }

    const authorization = request.headers.get("authorization");
    const accessToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";

    if (!accessToken) {
      return Response.json(
        { error: "관리자 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const authClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } =
      await authClient.auth.getUser(accessToken);

    if (userError || userData.user?.email !== ADMIN_EMAIL) {
      return Response.json(
        { error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return Response.json(
        { error: "올바른 요청 형식이 아닙니다." },
        { status: 400 }
      );
    }

    const {
      psalmReference,
      psalmText,
      reflectionStyle,
    } = body as Record<string, unknown>;

    if (
      typeof psalmReference !== "string" ||
      typeof psalmText !== "string" ||
      !psalmReference.trim() ||
      !psalmText.trim()
    ) {
      return Response.json(
        { error: "시편 구절과 본문이 필요합니다." },
        { status: 400 }
      );
    }

    if (psalmReference.length > 120 || psalmText.length > 12000) {
      return Response.json(
        { error: "입력 내용이 허용된 길이를 초과했습니다." },
        { status: 400 }
      );
    }

    const safeReflectionStyle =
      typeof reflectionStyle === "string" &&
      ALLOWED_STYLES.has(reflectionStyle)
        ? reflectionStyle
        : "general";

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-5.5",
      input: `
당신은 Psalm Morning 이라는 기독교 아침 묵상 앱을 돕는 목회적 조력자입니다.

묵상 스타일:
${safeReflectionStyle}

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
  } catch (error: unknown) {
    console.error("Generate devotional API error:", error);

    return Response.json(
      {
        error:
          (error instanceof Error && error.message) ||
          "AI 초안 생성 서버에서 문제가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
