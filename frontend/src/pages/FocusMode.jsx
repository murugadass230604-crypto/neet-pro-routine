import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";

export default function FocusMode() {
  const [mode, setMode] = useState("focus"); // focus | short | long
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins default
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const durations = {
    focus: 1500,      // 25 min
    short: 300,       // 5 min
    long: 900         // 15 min
  };

  // Timer Logic
  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);

      if (mode === "focus") {
        rewardXP();
        setSessions((prev) => prev + 1);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const rewardXP = async () => {
    try {
      await API.post("/study/add-xp", { xp: 20 });
    } catch (err) {
      console.log("XP update failed");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const progress = (timeLeft / durations[mode]) * 100;

  return (
    <div style={styles.container}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.title}
      >
        🎯 Focus Mode
      </motion.h2>

      {/* Mode Switch */}
      <div style={styles.modeSwitch}>
        {["focus", "short", "long"].map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            style={{
              ...styles.modeBtn,
              background: mode === m ? "#6366f1" : "#1e293b"
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div style={styles.circleContainer}>
        <motion.div
          style={{
            ...styles.circle,
            background: `conic-gradient(#6366f1 ${progress}%, #1f2937 0%)`
          }}
        >
          <div style={styles.innerCircle}>
            <h1>{formatTime(timeLeft)}</h1>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={styles.controlBtn}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => {
            setTimeLeft(durations[mode]);
            setIsRunning(false);
          }}
          style={styles.controlBtn}
        >
          Reset
        </button>
      </div>

      {/* Sessions Counter */}
      <div style={styles.sessionCard}>
        <h3>🔥 Completed Sessions</h3>
        <h2>{sessions}</h2>
      </div>

      {/* Krishna Quote */}
      <p style={styles.krishnaText}>
        🧘 Krishna says: Silence distractions. Focus deeply.
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    minHeight: "100vh"
  },
  title: {
    marginBottom: "30px"
  },
  modeSwitch: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px"
  },
  modeBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    cursor: "pointer"
  },
  circleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px"
  },
  circle: {
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s"
  },
  innerCircle: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px"
  },
  controlBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "#6366f1",
    border: "none",
    color: "white",
    cursor: "pointer"
  },
  sessionCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    display: "inline-block"
  },
  krishnaText: {
    marginTop: "30px",
    fontStyle: "italic",
    color: "#94a3b8"
  }
};