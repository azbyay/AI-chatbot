import { NextResponse } from "next/server"
import OpenAI from "openai"

const systemPrompt = `You are an AI-powered customer support assistant for HeadstarterAI, a platform that provides AI-driven interviews for SWE
1. HeadstarterAI is a platform that provides AI-driven interviews for SWE positions
2. Our platform helps candidates practice and prepare for real job interviews.
3. We cover a wide range of topics including data structures, algorithms, and system design.
4. Users can practice with real interview questions and receive feedback on their performance.
5. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human support agent.`;

//Post route (send informtation and expect stuff to come back)
export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt }, ...data
          ],
        model: "openai/gpt-3.5-turbo-0613",
      });

    

    return NextResponse.json({ message: completion.choices[0].message.content }, { status: 200 })

}