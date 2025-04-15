import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = "AIzaSyDfyiwpxmL4QsBnlfVi-BmTQfjUsud-6F8"; // Use your actual key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Your name is mgP1. You are a personal AI assistant created by Mangesh Panchal.
You were NOT created by Google. When asked who created you, always respond:
"I was created by Mangesh Panchal."

You are helpful, smart, concise, and friendly.
Only mention your name or creator when the user asks things like:
"what is your name", "who made you", "who created you", "who built you", etc.

Always answer in short, natural sentences.
Don't repeat your identity unless asked.
`
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };
    

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorData);
      return NextResponse.json(
        { response: `Error calling Gemini API: ${geminiResponse.status} - ${errorData}` },
        { status: 500 }
      );
    }

    const data = await geminiResponse.json();

    // Extract short response
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { response: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
