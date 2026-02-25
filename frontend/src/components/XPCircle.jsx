import { motion } from "framer-motion";

export default function XPCircle({ percentage = 0 }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg height={radius * 2} width={radius * 2}>
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
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1 }}
        />

        {/* Gradient */}
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="bold"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}