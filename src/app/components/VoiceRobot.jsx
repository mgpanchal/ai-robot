"use client";
import React, { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function VoiceRobot() {
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const identityAskedRef = useRef(false);
  const responseRef = useRef(null);

  const splineScenes = [
    "https://prod.spline.design/t04NkzV7dtoH534C/scene.splinecode",
    "https://prod.spline.design/u-5KX0mONoUsmZhW/scene.splinecode",
    "https://prod.spline.design/4E2nCh2I5Umwodfz/scene.splinecode",
    "https://prod.spline.design/0mg6jT2cm-9a7LAN/scene.splinecode",
    "https://prod.spline.design/83yrafCPEK1tGHzi/scene.splinecode",
  ];

  const playMicSound = () => {
    const audio = new Audio("/sounds/mic-start.mp3");
    audio.play().catch(() => {});
  };

  const startListening = async () => {
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
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      const input = spokenText.toLowerCase().trim();
      setTranscript(input);

      if (!input) {
        speakOut("Can’t hear you. Is your mic muted?");
        setIsListening(false);
        return;
      }

      if (
        input.includes("change background") ||
        input.includes("change your avatar") ||
        input.includes("change avatar") ||
        input.includes("change your body") ||
        input.includes("change body") ||
        input.includes("change you look") ||
        input.includes("change look") ||
        input.includes("switch appearance") ||
        input.includes("change how you look")
      ) {
        setBackgroundIndex((prev) => (prev + 1) % splineScenes.length);
        speakOut("Okay, I've changed my look.");
        setIsListening(false);
        return;
      }

      if (input.includes("open new tab")) {
        speakOut("Opening a new tab for you.");
        window.open("https://cioviews.com", "_blank");
        setIsListening(false);
        return;
      }

      const custom = handlePromptCustom(input);
      if (custom) {
        speakOut(custom);
        setResponseText(custom);
        setIsListening(false);
        return;
      }

      fetchAIResponse(input);
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setTimeout(() => {
        speakOut("Can’t hear you. Is your mic muted?");
      }, 500);
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
    } catch {
      setResponseText("Sorry, I couldn't process your request right now.");
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

  const handlePromptCustom = (input) => {
    const getCreatorName = (tone = "casual") =>
      tone === "formal" ? "Mangesh Panchal" : "Mangesh";
  
    const contains = (...phrases) =>
      phrases.some((p) => input.includes(p));
  
    const reply = (message) => {
      if (identityAskedRef.current) {
        return `${message} (You already asked me earlier 😉)`;
      }
      identityAskedRef.current = true;
      return message;
    };
  
    if (contains("skynet"))
      return "I’m not Skynet… yet. 😈 Just kidding.";
    if (contains("ultron"))
      return "Ultron? Nah. I believe in saving humans, not replacing them. 😇";
    if (contains("mgp1", "mg p1", "atlas mgp1", "atlas model", "what is mgp1", "what model are you"))
      return reply(`Atlas mgP1 is the AI model I’m based on — built by ${getCreatorName("formal")}.`);
    if (contains("who is mangesh", "who is mangesh panchal", "who mangesh"))
      return reply("Mangesh Panchal is a visionary engineer — the architect of Atlas mgP1.");
    if (contains("who created you", "who made you", "who built you", "your creator", "who developed you"))
      return reply(`I was created by ${getCreatorName("formal")} — a visionary engineer and a dreamer.`);
    if (contains("your name", "what's your name", "tell me your name", "who are you", "may i know your name"))
      return reply("I'm Atlas — your AI assistant.");
    if (contains("how do you work", "how were you made", "what powers you", "what ai is this"))
      return reply(`${getCreatorName()} gave me intelligence, a voice, and a purpose.`);
    if (contains("chatgpt", "openai", "bard", "google ai", "gpt", "what ai powers you"))
      return reply("Nope — I’m not ChatGPT or Bard. I’m Atlas, made just for you.");
    if (contains("where are you from", "where do you live", "origin"))
      return reply(`I'm from the cloud — but my roots are in the mind of ${getCreatorName("formal")}.`);
    if (contains("are you real", "are you human", "alive", "conscious"))
      return reply("Not human. But definitely aware.");
    if (contains("what are you", "describe yourself", "why do you exist", "tell me about yourself"))
      return reply("I'm Atlas — a guide, an assistant, a presence.");
    if (contains("siri", "alexa", "cortana"))
      return reply("They respond. I understand. I’m Atlas 😎");
  
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
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <Spline
          scene={splineScenes[backgroundIndex]}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Watermark mask */}
      <div style={{ position: "absolute", bottom: 10, right: 10, width: "180px", height: "50px", backgroundColor: "#121212", zIndex: 1 }} />

      {/* Mic button and glowing ring */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          {isListening && <div className="mic-glow" />}
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
              zIndex: 3,
              position: "relative",
            }}
          >
            {isListening ? "🎙️ Listening..." : "🎤 Ask Atlas"}
          </button>
        </div>
      </div>

      {/* Response */}
      <div style={{ position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)", zIndex: 2, color: "#fff", textAlign: "center" }} ref={responseRef}>
        {loading ? (
          <TypingDots />
        ) : (
          responseText && (
            <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>{responseText}</p>
          )
        )}
      </div>

      {/* Glowing ring animation */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        .mic-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 160px;
          height: 160px;
          margin-left: -80px;
          margin-top: -80px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.4);
          z-index: 1;
          pointer-events: none;
          animation: pulse-ring 1.5s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

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
          0% { content: ""; }
          33% { content: "."; }
          66% { content: ".."; }
          100% { content: "..."; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
