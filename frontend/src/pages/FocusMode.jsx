import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";

export default function FocusMode() {
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const durations = {
    focus: 1500,
    short: 300,
    long: 900
  };

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
    <div className="focus-container">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="focus-title"
      >
        🎯 Focus Mode
      </motion.h2>

      {/* Mode Switch */}
      <div className="focus-mode-switch">
        {["focus", "short", "long"].map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`focus-mode-btn ${mode === m ? "active" : ""}`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="focus-circle-container">
        <motion.div
          className="focus-circle"
          style={{
            background: `conic-gradient(#6366f1 ${progress}%, #1f2937 0%)`
          }}
        >
          <div className="focus-inner-circle">
            <h1>{formatTime(timeLeft)}</h1>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="focus-controls">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="focus-control-btn"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => {
            setTimeLeft(durations[mode]);
            setIsRunning(false);
          }}
          className="focus-control-btn"
        >
          Reset
        </button>
      </div>

      {/* Sessions */}
      <div className="focus-session-card">
        <h3>🔥 Completed Sessions</h3>
        <h2>{sessions}</h2>
      </div>

      <p className="focus-quote">
        🧘 Krishna says: Silence distractions. Focus deeply.
      </p>
    </div>
  );
}