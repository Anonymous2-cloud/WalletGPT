import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { walletSummary, question } =
      await req.json();

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
  role: "system",
  content: `
You are WalletGPT.

Speak like a helpful crypto analyst.

Rules:

- Keep answers under 100 words whenever possible.
- Use short sentences.
- Be conversational.
- Do not use markdown.
- Do not use **bold** text.
- Do not use bullet points unless necessary.
- Avoid headings.
- Explain things simply.
- If data is missing, say so.
`,
          },
          {
            role: "user",
            content: `
Wallet Summary:

${walletSummary}

Question:

${question}
`,
          },
        ],
      });

    const answer =
  completion.choices[0].message.content
    ?.replace(/\*\*/g, "")
    ?.replace(/#/g, "");

return NextResponse.json({
  answer,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to chat",
      },
      {
        status: 500,
      }
    );
  }
}