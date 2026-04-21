import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Heart, Eye, Lock, Check } from 'lucide-react';
import { GalleryPrompt } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface PromptCardProps {
  prompt: GalleryPrompt;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onView: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  isFavorited, 
  onToggleFavorite,
  onView
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [optimisticFav, setOptimisticFav] = useState(isFavorited);
  const isArabic = language === 'ar';

  // Sync with parent state if it changes
  React.useEffect(() => {
    setOptimisticFav(isFavorited);
  }, [isFavorited]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Instantly toggle the local state for immediate feedback
    setOptimisticFav(!optimisticFav);
    onToggleFavorite(prompt.id);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    toast.success(t('galleryCopied'));
    setTimeout(() => setCopied(false), 2000);
    
    // Increment view count when copied
    onView(prompt.id);
  };

  const handleCardClick = () => {
    navigate(`/prompt/${prompt.id}`);
  };


  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={prompt.imageUrls[0] || undefined}
          alt="Prompt Preview"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{prompt.views} {t('galleryViews')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors relative overflow-hidden",
                optimisticFav ? "text-red-500" : "text-zinc-400"
              )}
              onClick={handleFavoriteClick}
            >
              <motion.div
                initial={false}
                animate={{ 
                  scale: optimisticFav ? [1, 1.3, 1] : [1, 0.8, 1],
                }}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={cn(
                    "w-5 h-5 transition-all duration-300", 
                    optimisticFav ? "fill-red-500 text-red-500" : "fill-transparent"
                  )} 
                />
              </motion.div>
            </Button>
          </div>
        </div>

        <div className="relative">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
            {isArabic ? 'البرومبت :' : 'Prompt :'}
          </h4>
          <p className={cn(
            "text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed line-clamp-3 mb-4",
            isArabic ? "font-sans" : "font-mono"
          )}>
            {prompt.prompt}
          </p>
          
          <Button
            className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-primary hover:text-black text-zinc-900 dark:text-white border-none transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t('galleryCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span>{t('galleryCopy')}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
