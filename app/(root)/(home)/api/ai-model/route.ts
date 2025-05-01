import { AImodels } from "@/constants/AImodels";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

export async function POST(req: Request) {
  const { model, imageUrl, description } = await req.json();

  const modObj = AImodels.find((mod) => mod.name === model);
  const modelName = modObj?.modelName ?? "google/gemini-2.0-flash-exp:free";

  const response = await openai.chat.completions.create({
    model: modelName,
    stream: true,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: description,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices?.[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
