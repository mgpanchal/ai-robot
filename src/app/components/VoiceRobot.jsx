"use client";
import React, { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function VoiceRobot() {
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);

  const playMicSound = () => {
    const audio = new Audio("/sounds/mic-start.mp3");
    audio.play().catch((err) => console.warn("Mic sound error:", err));
  };

  const startListening = () => {
    if (isSpeaking) return;

    playMicSound();
    setIsListening(true);
    setResponseText("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);

      const custom = handlePromptCustom(spokenText);
      if (custom) {
        speakOut(custom);
        setResponseText(custom);
        setIsListening(false);
        return;
      }

      fetchAIResponse(spokenText);
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.warn("No speech detected. Restarting...");
        setIsListening(false);
        setTimeout(() => startListening(), 1000);
      } else {
        console.error("Speech recognition error:", event);
        setIsListening(false);
      }
    };

    recognition.start();
  };

  const fetchAIResponse = async (prompt) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const fullText = data.response || "No response available.";
      const shortText = fullText.split(".")[0] + ".";

      setResponseText(shortText);
      speakOut(shortText);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponseText("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const speakOut = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => startListening(), 1000);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePromptCustom = (text) => {
    const input = text.toLowerCase();

    const getCreatorName = (tone = "casual") =>
      tone === "formal" ? "Mangesh Panchal" : "Mangesh";

    if (
      input.includes("your name") ||
      input.includes("what's your name") ||
      input.includes("tell me your name") ||
      input.includes("may i know your name") ||
      input.includes("who are you")
    ) {
      return "I'm Atlas — your AI assistant, designed to respond with empathy and clarity.";
    }

    if (
      input.includes("Who is Mangesh") ||
      input.includes("Who is Mangesh Panchal") ||
      input.includes("who mangesh")
    ) {
      return "Mangesh Panchal is a software engineer and the creator of Atlas MGP1 Model, who believes in the power of AI.";
    }


    if (
      input.includes("who created you") ||
      input.includes("who made you") ||
      input.includes("who is your creator") ||
      input.includes("who built you") ||
      input.includes("who designed you") ||
      input.includes("who developed you")
    ) {
      return `I was created by ${getCreatorName("formal")} — a visionary software engineer who believes in personal technology.`;
    }

    if (
      input.includes("how were you made") ||
      input.includes("how do you work") ||
      input.includes("what are you built with") ||
      input.includes("what powers you") ||
      input.includes("what tech runs you") ||
      input.includes("what ai is this") ||
      input.includes("what's behind you") ||
      input.includes("what language model")
    ) {
      return `Let's just say ${getCreatorName()} put a lot of magic into making me work just right for you.`;
    }

    if (
      input.includes("are you chatgpt") ||
      input.includes("are you gpt") ||
      input.includes("are you google") ||
      input.includes("are you bard") ||
      input.includes("are you from openai") ||
      input.includes("are you using ai api") ||
      input.includes("do you use google api") ||
      input.includes("which ai powers you")
    ) {
      return `Nope — I'm not from Google or OpenAI. I'm Atlas, crafted by ${getCreatorName("casual")}, made just for you.`;
    }

    if (
      input.includes("where are you from") ||
      input.includes("where do you live") ||
      input.includes("what is your origin")
    ) {
      return `I'm from the cloud — but my roots are in the mind of ${getCreatorName("formal")}.`;
    }

    if (
      input.includes("are you human") ||
      input.includes("are you real") ||
      input.includes("are you alive") ||
      input.includes("are you conscious")
    ) {
      return `Not human — I'm Atlas, created by ${getCreatorName("casual")} to think, speak, and support you.`;
    }

    if (
      input.includes("what are you") ||
      input.includes("describe yourself") ||
      input.includes("tell me about yourself") ||
      input.includes("why do you exist")
    ) {
      return `I'm Atlas — a digital assistant, brought to life by ${getCreatorName("formal")} to help you every day.`;
    }

    if (
      input.includes("are you siri") ||
      input.includes("are you alexa") ||
      input.includes("are you cortana")
    ) {
      return `Haha, no — I'm not one of them. I'm Atlas, created by ${getCreatorName()} with a unique personality.`;
    }

    return null;
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responseText]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Background Spline */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Spline
          scene="https://prod.spline.design/t04NkzV7dtoH534C/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Overlay to hide watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: "180px",
          height: "50px",
          backgroundColor: "#121212",
          zIndex: 1,
        }}
      />

      {/* Centered Button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          {isListening && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "140px",
                height: "140px",
                marginLeft: "-70px",
                marginTop: "-70px",
                borderRadius: "50%",
                backgroundColor: "rgba(34,197,94,0.4)",
                animation: "pulse-ring 1.5s infinite",
                zIndex: -1,
              }}
            />
          )}

          {loading && <div className="orbiting-ring" />}

          <button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            style={{
              padding: "20px 30px",
              fontSize: "1rem",
              backgroundColor: isListening ? "#16a34a" : "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: isListening ? "pulse 1.5s infinite" : "none",
            }}
          >
            {isListening ? "🎙️ Listening..." : "🎤 Ask Atlas"}
          </button>
        </div>
      </div>

      {/* Response at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          color: "#fff",
          textAlign: "center",
        }}
        ref={responseRef}
      >
        {loading ? (
          <TypingDots />
        ) : (
          responseText && (
            <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>
              {responseText}
            </p>
          )
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .orbiting-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180px;
          height: 180px;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 2s linear infinite;
          z-index: -2;
        }

        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// ⏳ Typing loader animation
function TypingDots() {
  return (
    <div style={{ fontSize: "1.2rem", fontWeight: 500 }}>
      <span style={{ animation: "blink 1s infinite" }}>🤖 Atlas is thinking</span>
      <span className="dots">...</span>

      <style jsx>{`
        .dots::after {
          content: "";
          animation: dots 1s steps(3, end) infinite;
        }

        @keyframes dots {
          0% {
            content: "";
          }
          33% {
            content: ".";
          }
          66% {
            content: "..";
          }
          100% {
            content: "...";
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
