import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryPrompt } from '@/types';
import { fetchGalleryPrompts, incrementPromptViews } from '@/services/sheets';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { toggleFavorite } from '@/services/firebase';
import { toast } from 'sonner';

export default function PromptGrid() {
  const [prompts, setPrompts] = useState<GalleryPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const isArabic = language === 'ar';

  const loadPrompts = async () => {
    setLoading(true);
    const data = await fetchGalleryPrompts();
    // Show only the 6 newest prompts
    setPrompts(data.slice(-6).reverse());
    setLoading(false);
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleToggleFavorite = async (promptId: string) => {
    if (!user) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    const isFavorited = profile?.favorites?.includes(promptId);

    try {
      await toggleFavorite(user.uid, promptId, !isFavorited);
      if (isFavorited) {
        toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
      } else {
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

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-display font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
            {t('curatedMasterpieces')}
          </h2>
          <p className="text-zinc-500 max-w-md">
            {isArabic ? 'أحدث البرومبتات الحصرية والجديدة المضافة مؤخراً.' : 'The latest exclusive and newly added prompts.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {prompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                isFavorited={profile?.favorites?.includes(prompt.id) || false}
                onToggleFavorite={handleToggleFavorite}
                onView={handleView}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && prompts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-zinc-500 text-lg">
            {isArabic ? 'لا توجد برومبتات متاحة حالياً.' : 'No prompts available at the moment.'}
          </p>
        </div>
      )}
    </section>
  );
}
