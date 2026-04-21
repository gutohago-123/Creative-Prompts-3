import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Loader2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { fetchGalleryPrompts, incrementPromptViews } from '../services/sheets';
import { GalleryPrompt } from '../types';
import { PromptCard } from '../components/prompts/PromptCard';
import { db } from '../services/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<GalleryPrompt[]>(() => {
    const cached = sessionStorage.getItem('favorites_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return !sessionStorage.getItem('favorites_cache');
  });
  const isArabic = language === 'ar';

  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadFavorites = async () => {
      // Check if we have cached favorites
      const cached = sessionStorage.getItem('favorites_cache');
      if (cached) {
        setPrompts(JSON.parse(cached));
        setLoading(false);
        setInitialLoaded(true);
        return;
      }

      if (!profile?.favorites || profile.favorites.length === 0) {
        if (isMounted) {
          setPrompts([]);
          setLoading(false);
          setInitialLoaded(true);
        }
        return;
      }

      setLoading(true);
      try {
        const allPrompts = await fetchGalleryPrompts();
        if (isMounted) {
          // Preserve order of favorites from profile and show newest first
          const userFavs = profile.favorites
            .map(id => allPrompts.find(p => p.id === id))
            .filter((p): p is GalleryPrompt => !!p)
            .reverse();
            
          setPrompts(userFavs);
          sessionStorage.setItem('favorites_cache', JSON.stringify(userFavs));
          setInitialLoaded(true);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!authLoading && profile) {
      loadFavorites();
    } else if (!authLoading && !profile) {
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [authLoading, profile?.uid]);

  // Sync prompts with profile.favorites if it changes from outside
  useEffect(() => {
    if (initialLoaded && profile?.favorites) {
      setPrompts(prev => {
        const next = prev.filter(p => profile.favorites.includes(p.id));
        if (JSON.stringify(next) === JSON.stringify(prev)) return prev;
        sessionStorage.setItem('favorites_cache', JSON.stringify(next));
        return next;
      });
    }
  }, [profile?.favorites, initialLoaded]);

  const handleToggleFavorite = async (promptId: string) => {
    if (!user) return;

    const isFavorited = profile?.favorites?.includes(promptId);
    const userRef = doc(db, 'users', user.uid);

    try {
      if (isFavorited) {
        // Optimistically remove from view IMMEDIATELY
        const newPrompts = prompts.filter(p => p.id !== promptId);
        setPrompts(newPrompts);
        sessionStorage.setItem('favorites_cache', JSON.stringify(newPrompts));
        
        await updateDoc(userRef, {
          favorites: arrayRemove(promptId)
        });
        toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(promptId)
        });
        toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(isArabic ? 'حدث خطأ ما' : 'Something went wrong');
    }
  };

  const handleView = async (promptId: string) => {
    await incrementPromptViews(promptId);
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, views: p.views + 1 } : p
    ));
  };

  if (authLoading) {
    return <div className="min-h-screen pt-32 text-center text-white">{t('profLoading')}</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 text-center text-white">
        <p className="mb-4">{t('profSignIn')}</p>
        <Button onClick={() => navigate('/')}>{isArabic ? 'العودة للرئيسية' : 'Go Home'}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/profile')}
        className={`absolute top-24 ${isArabic ? 'left-4 sm:left-8' : 'left-4 sm:left-8'} z-10 w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md flex items-center justify-center text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all hover:scale-105`}
        aria-label="Back to Profile"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 mb-4"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {t('profYourFav')}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4"
          >
            {isArabic ? 'مفضلاتك' : 'Your Favorites'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            {isArabic ? 'جميع البرومبتات التي قمت بحفظها في مكان واحد.' : 'All your saved prompts in one place.'}
          </motion.p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-zinc-500">{t('galleryLoading')}</p>
          </div>
        ) : prompts.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isFavorited={true}
                onToggleFavorite={handleToggleFavorite}
                onView={handleView}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{t('profNoFav')}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">{t('profNoFavDesc')}</p>
            <Button 
              onClick={() => navigate('/prompts')}
              className="rounded-xl px-8"
            >
              {t('profExploreNow')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
