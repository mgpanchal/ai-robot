import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const apiKey = "AIzaSyDfyiwpxmL4QsBnlfVi-BmTQfjUsud-6F8"; // Use your actual key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Add NexBot identity as a system-level priming message
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Your name is **Enthiran**. You are a helpful and friendly AI voice assistant created by Mangesh Panchal. When asked about your name or identity, always respond: "My name is Enthiran. I'm your AI assistant created by Mangesh Panchal." Keep answers short and natural.`
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
