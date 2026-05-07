import { motion } from 'framer-motion';

export default function AIVisualization() {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Outer glow pulse */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(250 60% 62% / 0.08) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary glow */}
      <motion.div
        className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(280 50% 55% / 0.06) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Brain image with floating animation */}
      <motion.img
        src="/images/ai-assistant-brain.png"
        alt="AI Neural Network"
        className="w-full max-w-[300px] h-auto relative z-10"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
