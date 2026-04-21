import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/services/firebase';
import { Sparkles, Mail, Lock, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t, language } = useLanguage();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome to Creative Prompts!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmail(email, password);
        toast.success('Welcome back!');
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use' || error.code === 'auth/email-already-exists') {
        toast.error(t('authEmailInUse'));
      } else if (error.code === 'auth/weak-password') {
        toast.error(t('authWeakPassword'));
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        toast.error(t('authEmailError'));
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8 bg-black border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="relative z-10">
          <DialogHeader className="items-center text-center mb-6">
            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-display font-bold text-white">{t('authJoin')}</DialogTitle>
            <DialogDescription className="text-white/50 mt-2">
              {t('authDesc')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-3">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input 
                    type="text"
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-primary/50"
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input 
                  type="email"
                  placeholder={t('authEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-primary/50"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input 
                  type="password"
                  placeholder={t('authPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 focus-visible:ring-primary/50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-black hover:bg-primary/90 border-none shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all font-bold"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? t('authSignUp') : t('authSignIn'))}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-white/30 font-medium uppercase">{t('authOr')}</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="mt-6 space-y-4">
            <Button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-black border border-white/10 hover:bg-white/90 transition-all flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium">{t('authGoogle')}</span>
            </Button>
            
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {isSignUp ? t('authHasAccount') : t('authNoAccount')}{' '}
                <span className="text-primary font-medium underline underline-offset-4">
                  {isSignUp ? t('authLoginHere') : t('authCreateOne')}
                </span>
              </button>
            </div>

            <p className="text-center text-[10px] text-white/30 uppercase tracking-widest mt-6">
              {t('authTerms')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
