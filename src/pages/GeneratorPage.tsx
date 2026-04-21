import PromptGenerator from '@/components/generator/PromptGenerator';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const floatingIcons = [
  { left: '10%', top: '20%', size: 48, delay: 0, duration: 10 },
  { left: '85%', top: '15%', size: 64, delay: 2, duration: 12 },
  { left: '75%', top: '70%', size: 56, delay: 1, duration: 11 },
  { left: '15%', top: '80%', size: 40, delay: 3, duration: 14 },
  { left: '50%', top: '10%', size: 32, delay: 0.5, duration: 9 },
  { left: '40%', top: '85%', size: 50, delay: 2.5, duration: 13 },
  { left: '90%', top: '45%', size: 44, delay: 1.5, duration: 10 },
  { left: '5%', top: '50%', size: 36, delay: 4, duration: 12 },
];

export default function GeneratorPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-32 pb-24 min-h-screen bg-background relative"
    >
      {/* Top Background Area (Fades out before the bottom) */}
      <div 
        className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' 
        }}
      >
        {/* Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        {/* Floating Icons */}
        {floatingIcons.map((icon, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.5, 0.5, 0], 
              scale: [0.8, 1.1, 1, 0.8], 
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0] 
            }}
            transition={{ 
              duration: icon.duration, 
              delay: icon.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ left: icon.left, top: icon.top, position: 'absolute' }}
            className="flex items-center justify-center"
          >
            <div 
              className="bg-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              style={{ width: icon.size * 1.5, height: icon.size * 1.5 }}
            >
              <Sparkles 
                size={icon.size} 
                className="text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <PromptGenerator />
      </div>
    </motion.main>
  );
}
