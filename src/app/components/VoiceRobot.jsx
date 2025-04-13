"use client";
import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function VoiceRobot() {
  const [transcript, setTranscript] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    setIsListening(true);
    setResponseText("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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

    recognition.onerror = (error) => {
      console.error("Speech recognition error:", error);
      setIsListening(false);
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

      console.log("AI Response:", data);
      
      const shortText = data.response;
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
  
    utterance.onend = () => {
      // 👂 Automatically start listening after speaking
      startListening();
    };
  
    window.speechSynthesis.speak(utterance);
  };
  

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', textAlign: "center", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "600" }}>🤖 AI Voice Assistant</h1>

      <div style={{ height: "400px", margin: "2rem 0" }}>
        <Spline scene="https://prod.spline.design/eM7sw0lhDgG3nzVS/scene.splinecode" />
      </div>

      <button
        onClick={startListening}
        disabled={isListening || loading}
        style={{
          padding: "12px 24px",
          fontSize: "1rem",
          backgroundColor: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: isListening ? "0 0 10px #4f46e5" : "none",
          animation: isListening ? "pulse 1.5s infinite" : "none",
        }}
      >
        {isListening ? "Listening..." : "🎙️ Talk to Robot"}
      </button>

      <div style={{ marginTop: "2rem", minHeight: "80px" }}>
        {loading ? (
          <TypingDots />
        ) : (
          responseText && <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>{responseText}</p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
          }
        }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ fontSize: "1.2rem", fontWeight: 500 }}>
      <span style={{ animation: "blink 1s infinite" }}>🤖 Robot is thinking</span>
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
