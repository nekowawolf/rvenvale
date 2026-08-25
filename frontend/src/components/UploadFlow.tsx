"use client";

import { motion } from "framer-motion";
import { FiUploadCloud, FiGlobe } from "react-icons/fi";
import { FaDatabase, FaGithub } from "react-icons/fa";

const steps = [
  { id: 1, label: "Upload Image", icon: FiUploadCloud },
  { id: 2, label: "MongoDB Data", icon: FaDatabase },
  { id: 3, label: "GitHub Upload", icon: FaGithub },
  { id: 4, label: "CDN Global Link", icon: FiGlobe },
];

export default function UploadFlow() {
  return (
    <div className="w-full py-8 mt-6 overflow-x-auto hide-scrollbar">
      <div className="min-w-[768px] flex items-center justify-between relative px-8">
        
        {/* Background Line */}
        <div className="absolute top-7 left-8 right-8 h-0.5 bg-[var(--border-divider)] z-0 rounded-full overflow-hidden">
          {/* Animated Moving Line */}
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "100%"] }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.7, 1],
            }}
          />
        </div>

        {/* Moving Dot over the line */}
        <motion.div
          className="absolute top-7 w-2 h-2 rounded-full shadow-md z-0 -mt-[3px]"
          initial={{ left: "2rem", backgroundColor: "var(--text-primary)" }}
          animate={{ 
            left: ["2rem", "calc(100% - 2rem)", "calc(100% - 2rem)"],
            backgroundColor: ["var(--text-primary)", "#2563eb", "#2563eb"]
          }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.7, 1],
          }}
        />

        {/* Flow Nodes */}
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative z-10 flex flex-col items-center gap-4 group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            {/* Icon Circle */}
            <motion.div
              className="w-14 h-14 rounded-2xl bg-[var(--card-color)] border border-[var(--border-divider)] group-hover:border-blue-600/50 shadow-lg flex items-center justify-center text-blue-600 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <step.icon size={22} className="relative z-10" />
              
              {/* Subtle Pulse effect behind icon */}
              <motion.div
                className="absolute inset-0 bg-blue-600/10 rounded-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            </motion.div>

            {/* Label */}
            <div className="text-xs sm:text-sm font-medium text-secondary bg-[var(--card-color2)] px-3 py-1.5 rounded-full border border-[var(--border-divider)] whitespace-nowrap">
              {step.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}