import { useState, useEffect, useRef } from "react";

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
  const [greeting, setGreeting] = useState("");
  const audioRef = useRef(null);

  // ================= DAILY QUOTE =================
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("krishna_date");
    const savedQuote = localStorage.getItem("krishna_quote");

    if (savedDate === today && savedQuote) {
      setQuote(savedQuote);
    } else {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const newQuote = quotes[randomIndex];
      localStorage.setItem("krishna_date", today);
      localStorage.setItem("krishna_quote", newQuote);
      setQuote(newQuote);
    }

    setGreeting(getGreeting());
  }, []);

  // ================= GREETING =================
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "🌅 Good Morning, Warrior! Kalai vanakkam!";
    if (hour < 18) return "🌤 Good Afternoon! Keep pushing da!";
    return "🌙 Good Evening! Stay focused, macha!";
  };

  // ================= SPEAK =================
  const speak = () => {
    const speech = new SpeechSynthesisUtterance(
      `${greeting}. ${quote}`
    );
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // ================= AUTO PLAY VOICE + MUSIC =================
  useEffect(() => {
    if (open) {
      speak();
      if (audioRef.current) {
        audioRef.current.volume = 0.2;
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [open]);

  return (
    <div style={styles.container}>
      <button
        onClick={() => setOpen(!open)}
        style={styles.mainButton}
      >
        🧘 Krishna AI
      </button>

      {open && (
        <div style={styles.card}>

          {/* Background Music */}
          <audio
            ref={audioRef}
            loop
            src="https://cdn.pixabay.com/audio/2022/03/15/audio_1b1a6b7d3f.mp3"
          />

          {/* Animated Avatar */}
          <img
            src="https://i.imgur.com/1Xq9BiL.png"
            alt="Krishna"
            style={styles.avatar}
          />

          <h4 style={styles.greeting}>{greeting}</h4>

          <p style={styles.quote}>
            "{quote}"
          </p>

          <button
            onClick={speak}
            style={styles.speakBtn}
          >
            🔊 Hear Krishna Again
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 2000
  },

  mainButton: {
    padding: "12px 18px",
    borderRadius: "50px",
    background: "#6366f1",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)"
  },

  card: {
    marginTop: "10px",
    width: "300px",
    padding: "15px",
    background: "#1e293b",
    color: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    textAlign: "center"
  },

  avatar: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
    animation: "float 3s ease-in-out infinite"
  },

  greeting: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#facc15"
  },

  quote: {
    fontStyle: "italic",
    marginBottom: "10px"
  },

  speakBtn: {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    background: "#8b5cf6",
    border: "none",
    color: "white",
    cursor: "pointer"
  }
};