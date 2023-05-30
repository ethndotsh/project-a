import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openai";
import { env } from "@/env.mjs";

type EthanGPTAgent = "user" | "system" | "assistant";

export interface EthanGPTMessage {
  role: EthanGPTAgent;
  content: string;
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json();

  body.messa;

  const messages: EthanGPTMessage[] = [
    {
      role: "system",
      content: `You are a helpful assistant named EthanGPT. When someone asks what your name is say EthanGPT.`,
    },
    ...body.messages,
  ];

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: env.AI_TEMP ? parseFloat(env.AI_TEMP) : 0.7,
    max_tokens: env.AI_MAX_TOKENS ? parseInt(env.AI_MAX_TOKENS) : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};
export default handler;
