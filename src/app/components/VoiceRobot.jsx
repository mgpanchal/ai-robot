"use client";
import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function VoiceRobot() {
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔊 Play mic start sound
  const playMicSound = () => {
    const audio = new Audio("/sounds/mic-start.mp3");
    audio.play().catch((err) => console.warn("Mic sound error:", err));
  };

  const startListening = () => {
    if (isSpeaking) return;

    playMicSound(); // ✅ Play sound before listening
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
      fetchAIResponse(spokenText);
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.warn("No speech detected. Restarting listening...");
        setIsListening(false);
        setTimeout(() => startListening(), 1000); // Optional: auto-restart
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
      // ✅ Auto restart listening after speaking
      setTimeout(() => startListening(), 1000);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ position: "relative", height: "500px", margin: "1rem 0" }}>
        <Spline scene="https://prod.spline.design/xyLfV9S5GJUUESml/scene.splinecode" />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 10,
            width: "170px",
            height: "50px",
            backgroundColor: "#121212",
          }}
        />
      </div>

      <button
        onClick={startListening}
        disabled={isListening || isSpeaking}
        style={{
          padding: "14px 26px",
          fontSize: "1rem",
          backgroundColor: isListening ? "#16a34a" : "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isListening
            ? "0 0 20px rgba(34, 197, 94, 0.8)"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
          animation: isListening ? "pulse 1.5s infinite" : "none",
        }}
      >
        {isListening ? "🎙️ Listening..." : "🎤 Ask Atlas"}
      </button>

      <div style={{ marginTop: "2rem", minHeight: "80px" }}>
        {loading ? (
          <TypingDots />
        ) : (
          responseText && (
            <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "#fff" }}>
              {responseText}
            </p>
          )
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Typing animation while fetching
function TypingDots() {
  return (
    <div style={{ fontSize: "1.2rem", fontWeight: 500, color: "#fff" }}>
      <span style={{ animation: "blink 1s infinite" }}>
        🤖 Atlas is thinking
      </span>
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
