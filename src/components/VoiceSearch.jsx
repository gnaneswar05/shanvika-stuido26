"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

export default function VoiceSearch({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // English (India) works great for Indian names, or "en-US"

      rec.onstart = () => {
        setIsListening(true);
        setError("");
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone permission denied.");
        } else {
          setError("Could not recognize voice. Please try again.");
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-[#D4AF37] text-black animate-pulse shadow-[0_0_15px_#D4AF37]"
            : "bg-neutral-900 text-[#C5A059] border border-[#C5A059]/20 hover:border-[#C5A059] hover:bg-neutral-800"
        }`}
        title={isListening ? "Listening... Click to stop" : "Search with voice"}
      >
        {isListening ? (
          <Mic className="h-5 w-5 text-black" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      {isListening && (
        <span className="absolute right-12 text-xs text-[#D4AF37] bg-black/90 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full whitespace-nowrap animate-pulse">
          Listening... speak now
        </span>
      )}

      {error && (
        <span className="absolute right-12 text-xs text-red-400 bg-black/90 border border-red-500/20 px-3 py-1.5 rounded-full whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
}
