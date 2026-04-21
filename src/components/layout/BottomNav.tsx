import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image, User, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '../auth/AuthModal';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Gallery', path: '/prompts', icon: Image },
    { name: 'Profile', path: '/profile', icon: User, protected: true },
  ];

  const handleNav = (path: string, isProtected: boolean) => {
    if (isProtected && !user) {
      setIsAuthModalOpen(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center gap-4 p-2 px-6 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-2xl w-auto"
      >
        {navItems.map((item) => {
          return (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNav(item.path, !!item.protected)}
              className={cn(
                "flex items-center justify-center p-2 rounded-full transition-all duration-300",
                "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5")} />
            </motion.button>
          );
        })}
      </motion.nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
