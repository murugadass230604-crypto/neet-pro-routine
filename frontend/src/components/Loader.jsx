import { motion } from "framer-motion";

export default function Loader({
  text = "Loading your focus zone...",
  fullscreen = true
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...styles.container,
        position: fullscreen ? "fixed" : "relative"
      }}
    >
      {/* Glass Card */}
      <div style={styles.card}>
        
        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear"
          }}
          style={styles.spinner}
        />

        {/* Glow Pulse */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5
          }}
          style={styles.glow}
        />

        <p style={styles.text}>{text}</p>
        <p style={styles.subText}>
          🧘 Krishna says: Stay focused...
        </p>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },

  card: {
    background: "rgba(30, 41, 59, 0.8)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    position: "relative"
  },

  spinner: {
    width: "70px",
    height: "70px",
    border: "6px solid transparent",
    borderTop: "6px solid #6366f1",
    borderRight: "6px solid #8b5cf6",
    borderRadius: "50%",
    margin: "0 auto 20px auto"
  },

  glow: {
    width: "80px",
    height: "80px",
    background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
    position: "absolute",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%"
  },

  text: {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px"
  },

  subText: {
    color: "#94a3b8",
    fontSize: "14px"
  }
};