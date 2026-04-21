import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

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

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-lavender-soft flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Floating Icons Container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 text-primary text-sm font-medium mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('heroBadge')}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-[1.3]"
        >
          {t('heroTitle').split(' ').slice(0, 3).join(' ')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{t('heroTitle').split(' ').slice(3).join(' ')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="h-14 px-8 rounded-full text-lg font-medium shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
            {t('startExploring')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all" onClick={() => navigate('/generator')}>
            {t('tryGenerator')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/50"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
