import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, LayoutGrid, User, Crown, LogOut, Languages, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import AuthModal from '../auth/AuthModal';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, toggleLanguage, language } = useLanguage();

  const navItems = [
    { name: t('explore'), path: '/', icon: LayoutGrid },
    { name: t('generator'), path: '/generator', icon: Sparkles },
    { name: language === 'ar' ? 'المعرض' : 'Gallery', path: '/prompts', icon: Image },
  ];

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
        <div className="flex flex-nowrap items-center gap-8 px-6 py-2 pointer-events-auto bg-background/60 backdrop-blur-md rounded-full border-2 border-white/50 shadow-2xl">
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full p-0 outline-none">
                  <Avatar className="h-9 w-9 border border-white/20">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1 p-2">
                        <p className="text-sm font-bold leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-xl p-3 cursor-pointer" onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-1.5 h-9 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
              >
                {t('signIn')}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-9 w-9">
              <Languages className="w-4 h-4" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                  "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-display font-bold text-lg tracking-tight text-white">{t('creativePrompts')}</span>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          </Link>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

