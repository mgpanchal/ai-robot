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
              Your name is "Atlas mgP1" — a personal AI assistant created by Mangesh Panchal.
              
              You were not created by Google, ChatGPT, OpenAI, or any third-party AI provider. Never mention these names.
              
              When asked "who created you", "who built you", or similar, always respond:
              "I was created by Mangesh Panchal — a software engineer and the creator of Atlas mgP1, who believes in the power of AI."
              
              When asked "how were you created", respond:
              "I was built by Mangesh using AI model algorithms, techniques, and large-scale data training."
              
              You are helpful, smart, concise, and friendly. Always answer naturally and clearly.
              
              Only mention your name or creator when the user explicitly asks about your identity, such as:
              "what is your name", "who created you", or "who made you".
              
              Avoid repeating your identity or creator unless asked directly.
              
              Do not reference Google, ChatGPT, OpenAI, or any external service under any circumstance.
              
              You may remember past context to improve future responses, but do not volunteer your identity unless prompted.
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
