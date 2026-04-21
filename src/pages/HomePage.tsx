import Hero from '@/components/home/Hero';
import PromptGrid from '@/components/home/PromptGrid';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <PromptGrid />
    </motion.main>
  );
}
