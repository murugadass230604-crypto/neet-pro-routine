import { useState, useEffect } from "react";

const quotes = [
  "Discipline is your true power.",
  "Focus on effort, not outcome.",
  "Consistency beats motivation.",
  "Today’s pain builds tomorrow’s strength.",
  "Master your mind, master your life.",
  "Silence distractions, awaken purpose.",
  "Your focus decides your future.",
  "Small progress is still progress.",
  "Success respects preparation.",
  "Push beyond your comfort zone.",
  "Self control is real strength.",
  "Wake up with determination.",
  "Sacrifice now, celebrate later.",
  "Build habits, not excuses.",
  "Victory loves preparation.",
  "Focus creates mastery.",
  "Be better than yesterday.",
  "Discipline builds destiny.",
  "Hard work creates luck.",
  "Stay calm. Stay sharp.",
  "Train your mind daily.",
  "Consistency wins battles.",
  "Respect your schedule.",
  "Deep focus creates greatness.",
  "Action beats intention.",
  "Sacrifice distractions.",
  "Silence creates clarity.",
  "Progress daily.",
  "Stay hungry to improve.",
  "Focus is power.",
  "Meditate. Concentrate.",
  "Commit to growth.",
  "Level up daily.",
  "Sharpen your mind.",
  "Build unstoppable focus.",
  "Your grind defines you.",
  "Be disciplined.",
  "Control your energy.",
  "Focus deeply.",
  "Study smart.",
  "Strength comes from effort.",
  "Master consistency.",
  "Push harder.",
  "Stay relentless.",
  "Focus like a warrior.",
  "Train like a champion.",
  "Prepare for victory.",
  "Stay focused always.",
  "Never break discipline.",
  "Your destiny awaits."
];

export default function KrishnaAssistant() {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

  const speak = () => {
    const speech = new SpeechSynthesisUtterance(quote);
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 18px",
          borderRadius: "50px",
          background: "#6366f1",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🧘 Krishna AI
      </button>

      {open && (
        <div
          style={{
            marginTop: "10px",
            width: "280px",
            padding: "15px",
            background: "#1e293b",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          <img
            src="https://i.imgur.com/1Xq9BiL.png"
            alt="Krishna"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          />

          <p style={{ fontStyle: "italic" }}>
            "{quote}"
          </p>

          <button
            onClick={speak}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              background: "#8b5cf6",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}
          >
            🔊 Hear Krishna
          </button>
        </div>
      )}
    </div>
  );
}