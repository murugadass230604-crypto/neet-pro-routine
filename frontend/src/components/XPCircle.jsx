import { motion } from "framer-motion";

export default function XPCircle({ percentage = 0, size = 160 }) {
  // Clamp percentage between 0 and 100
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const radius = size / 2;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (safePercentage / 100) * circumference;

  return (
    <div style={styles.wrapper}>
      <svg height={size} width={size}>

        {/* Background Circle */}
        <circle
          stroke="#1f2937"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Animated Progress Circle */}
        <motion.circle
          stroke="url(#xpGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1 }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%"
          }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Percentage Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
        >
          {safePercentage}%
        </text>
      </svg>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};