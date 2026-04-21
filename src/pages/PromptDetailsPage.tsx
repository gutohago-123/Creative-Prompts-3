import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Copy, Heart, Eye, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchGalleryPrompts, incrementPromptViews } from '../services/sheets';
import { GalleryPrompt } from '../types';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

export default function PromptDetailsPage() {
  const { id: promptId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const [prompt, setPrompt] = useState<GalleryPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState(0);
  const isArabic = language === 'ar';

  React.useEffect(() => {
    const loadPrompt = async () => {
      if (!promptId) return;
      setLoading(true);
      try {
        const data = await fetchGalleryPrompts();
        const foundPrompt = data.find(p => p.id === promptId);
        setPrompt(foundPrompt || null);
      } catch (err) {
        console.error("Error fetching gallery prompts details:", err);
      }
      setLoading(false);
    };
    loadPrompt();
  }, [promptId]);


  const handleDragEnd = (e: any, { offset }: PanInfo) => {
    if (!prompt) return;
    const swipe = offset.x;
    const threshold = 50;
    
    if (swipe < -threshold) {
      // Swipe Left -> Next
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % prompt.imageUrls.length);
    } else if (swipe > threshold) {
      // Swipe Right -> Prev
      setDirection(-1);
      setCurrentImageIndex((prev) => (prev - 1 + prompt.imageUrls.length) % prompt.imageUrls.length);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    toast.success(t('galleryCopied'));
    setTimeout(() => setCopied(false), 2000);
    
    await incrementPromptViews(prompt.id);
    setPrompt(prev => prev ? { ...prev, views: prev.views + 1 } : null);
  };

  const handleToggleFavorite = async () => {
    if (!user || !prompt) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    const isFavorited = profile?.favorites?.includes(prompt.id);
    const userRef = doc(db, 'users', user.uid);

    try {
      if (isFavorited) {
        await updateDoc(userRef, {
          favorites: arrayRemove(prompt.id)
        });
        toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(prompt.id)
        });
        toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(isArabic ? 'حدث خطأ ما' : 'Something went wrong');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!prompt) return <div className="min-h-screen flex items-center justify-center">Prompt not found</div>;

  const isFavorited = profile?.favorites?.includes(prompt.id) || false;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className={cn("flex", isArabic ? "justify-end" : "justify-start")}>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            {isArabic ? (
              <>
                {isArabic ? 'رجوع' : 'Back'} <ChevronLeft className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 mr-2" /> {isArabic ? 'رجوع' : 'Back'}
              </>
            )}
          </Button>
        </div>

        {/* Images Carousel */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/12] mb-6 overflow-hidden rounded-[2rem]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentImageIndex}
              src={prompt.imageUrls[currentImageIndex]}
              alt="Prompt"
              className="absolute w-full h-full object-cover"
              referrerPolicy="no-referrer"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </AnimatePresence>
        </div>
        
        {/* Pagination Dots */}
        {prompt.imageUrls.length > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            {prompt.imageUrls.map((_, index) => (
              <motion.div
                key={index}
                animate={{ scale: index === currentImageIndex ? 1.2 : 1 }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  index === currentImageIndex ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700"
                )}
              />
            ))}
          </div>
        )}

        {/* Stats & Favorite */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{prompt.views} {t('galleryViews')}</span>
          </div>
          <Button variant="ghost" onClick={handleToggleFavorite} className={isFavorited ? "text-red-500" : "text-zinc-500"}>
            <Heart className={cn("w-6 h-6", isFavorited ? "fill-red-500" : "")} />
          </Button>
        </div>

        {/* Prompt */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 mb-8 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
            {isArabic ? 'البرومبت :' : 'Prompt :'}
          </h3>
          <p className="text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 leading-relaxed mb-8 font-medium">{prompt.prompt}</p>
          <Button onClick={handleCopy} className="w-full h-14 text-lg rounded-2xl">
            {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
            {t('galleryCopy')}
          </Button>
        </div>

        {/* Explanation/Set */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-[2rem]">
          <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
            {isArabic ? 'الشرح :' : 'Explanation :'}
          </h3>
          <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{prompt.explanation}</p>
        </div>
      </div>
    </div>
  );
}
