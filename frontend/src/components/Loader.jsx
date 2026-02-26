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
        position: fullscreen ? "fixed" : "relative",
        height: fullscreen ? "100vh" : "100%"
      }}
    >
      <div style={styles.card}>
        
        {/* Glow Pulse Behind Spinner */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5
          }}
          style={styles.glow}
        />

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
    width: "100%",
    background: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    top: 0,
    left: 0
  },

  card: {
    background: "rgba(30, 41, 59, 0.9)",
    padding: "40px 35px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    position: "relative",
    maxWidth: "320px",
    width: "90%"
  },

  spinner: {
    width: "70px",
    height: "70px",
    border: "6px solid transparent",
    borderTop: "6px solid #6366f1",
    borderRight: "6px solid #8b5cf6",
    borderRadius: "50%",
    margin: "0 auto 20px auto",
    position: "relative",
    zIndex: 2
  },

  glow: {
    width: "90px",
    height: "90px",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
    position: "absolute",
    top: "35px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "50%",
    zIndex: 1
  },

  text: {
    color: "white",
    fontSize: "17px",
    fontWeight: "bold",
    marginBottom: "8px"
  },

  subText: {
    color: "#94a3b8",
    fontSize: "13px"
  }
};