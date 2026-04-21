import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { fetchGalleryPrompts, incrementPromptViews } from '@/services/sheets';
import { GalleryPrompt } from '@/types';
import { PromptCard } from '@/components/prompts/PromptCard';
import { db } from '@/services/firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [favoritePrompts, setFavoritePrompts] = useState<GalleryPrompt[]>(() => {
    const cached = sessionStorage.getItem('profile_favorites_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loadingPrompts, setLoadingPrompts] = useState<boolean>(() => {
    return !sessionStorage.getItem('profile_favorites_cache');
  });
  const isArabic = language === 'ar';

  useEffect(() => {
    const loadFavorites = async () => {
      // Check if we have cached favorites
      const cached = sessionStorage.getItem('profile_favorites_cache');
      if (cached) {
        setFavoritePrompts(JSON.parse(cached));
        setLoadingPrompts(false);
        return;
      }

      if (!profile?.favorites || profile.favorites.length === 0) {
        setFavoritePrompts([]);
        setLoadingPrompts(false);
        return;
      }
      
      setLoadingPrompts(true);
      try {
        const allPrompts = await fetchGalleryPrompts();
        // Preserve order of favorites from profile (last added is at the end)
        const userFavs = profile.favorites
          .map(id => allPrompts.find(p => p.id === id))
          .filter((p): p is GalleryPrompt => !!p);
          
        setFavoritePrompts(userFavs);
        sessionStorage.setItem('profile_favorites_cache', JSON.stringify(userFavs));
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoadingPrompts(false);
      }
    };

    if (!loading && profile) {
      // Only load if cache is empty
      if (!sessionStorage.getItem('profile_favorites_cache')) {
        loadFavorites();
      }
    }
  }, [profile?.favorites, loading]);

  const handleToggleFavorite = async (promptId: string) => {
    if (!user) return;
    const isFavorited = profile?.favorites?.includes(promptId);
    const userRef = doc(db, 'users', user.uid);

    try {
      if (isFavorited) {
        const newPrompts = favoritePrompts.filter(p => p.id !== promptId);
        setFavoritePrompts(newPrompts);
        sessionStorage.setItem('profile_favorites_cache', JSON.stringify(newPrompts));
        
        await updateDoc(userRef, { favorites: arrayRemove(promptId) });
        toast.success(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites');
      } else {
        const allPrompts = await fetchGalleryPrompts();
        const newPrompts = [...favoritePrompts, allPrompts.find(p => p.id === promptId)!];
        setFavoritePrompts(newPrompts);
        sessionStorage.setItem('profile_favorites_cache', JSON.stringify(newPrompts));
        
        await updateDoc(userRef, { favorites: arrayUnion(promptId) });
        toast.success(isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(isArabic ? 'حدث خطأ ما' : 'Something went wrong');
    }
  };

  const handleView = async (promptId: string) => {
    await incrementPromptViews(promptId);
    setFavoritePrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, views: p.views + 1 } : p
    ));
  };

  if (loading) return <div className="pt-32 text-center text-white">{t('profLoading')}</div>;
  if (!user) return <div className="pt-32 text-center text-white">{t('profSignIn')}</div>;

  // Show only the last one favorited on the profile page
  const displayedFavorites = favoritePrompts.slice(-1);
  return (
    <>
      <main
        className="pt-32 pb-24 min-h-screen bg-background px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "linear" }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="p-8 rounded-[2.5rem] text-center border border-white/10 shadow-xl bg-black ring-0 relative overflow-hidden">
                {/* Glow effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />
                
                <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-white/10 relative z-10">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {user.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-display font-bold text-white mb-1 relative z-10">{user.displayName}</h2>
                <p className="text-white/50 text-sm mb-6 relative z-10">{user.email}</p>
                
                <div className="flex justify-center gap-2 mb-8 relative z-10">
                  <Badge variant="outline" className="border-white/20 text-white">
                    {isArabic ? 'إجمالي التوليدات' : 'Total Generations'}: {profile?.totalGenerations || profile?.dailyGenerations || 0}
                  </Badge>
                </div>

                <Button 
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline" 
                  className="w-full rounded-xl h-12 border border-white/20 text-white hover:bg-white/10 relative z-10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('profEdit')}
                </Button>
              </Card>

              <Card className="p-6 rounded-[2rem] border border-white/10 bg-black ring-0 relative overflow-hidden">
                {/* Glow effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />
                
                <h3 className="font-bold text-white mb-4 px-2 relative z-10">{t('profStats')}</h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-white/70">{isArabic ? 'إجمالي التوليدات' : 'Total Generations'}</span>
                    </div>
                    <span className="font-bold text-white">{profile?.totalGenerations || profile?.dailyGenerations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-white/70">{t('profFav')}</span>
                    </div>
                    <span className="font-bold text-white">{profile?.favorites?.length || 0}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-white">{t('profYourFav')}</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary font-bold hover:bg-primary/10 hover:text-primary"
                  onClick={() => navigate('/favorites')}
                >
                  {t('profViewAll')}
                </Button>
              </div>

              {loadingPrompts ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : favoritePrompts.length === 0 ? (
                <Card className="p-12 rounded-[2.5rem] border border-white/10 bg-black text-center relative overflow-hidden">
                  {/* Glow effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />
                  
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                    <Heart className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 relative z-10">{t('profNoFav')}</h3>
                  <p className="text-white/50 mb-8 relative z-10">{t('profNoFavDesc')}</p>
                  <Button 
                    onClick={() => navigate('/prompts')}
                    className="rounded-xl px-8 bg-white text-black hover:bg-gray-200 relative z-10"
                  >
                    {t('profExploreNow')}
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {displayedFavorites.map(prompt => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      isFavorited={true}
                      onToggleFavorite={handleToggleFavorite}
                      onView={handleView}
                    />
                  ))}
                </div>
              )}

              {/* Generation History */}
              {profile?.generationHistory && profile.generationHistory.length > 0 && (
                <div className="space-y-6 pt-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-display font-bold text-white">
                      {isArabic ? 'تاريخ التوليد' : 'Generation History'}
                    </h2>
                    <span className="text-sm text-white/30 font-medium tracking-wide">
                      {isArabic ? 'يتم حفظ آخر 5 برومبتات قمت بتوليدها' : 'The last 5 prompts you generated are saved'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {profile.generationHistory.slice(-5).reverse().map((gen) => (
                      <Card key={gen.id} className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
                        <p className="text-white/80 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                          {gen.prompt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-white/30">
                              {new Date(gen.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                            <span className="text-[10px] text-white/30 font-sans">
                              {new Date(gen.date).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:bg-primary/10 h-8"
                            onClick={() => {
                              navigator.clipboard.writeText(gen.prompt);
                              toast.success(t('genCopied'));
                            }}
                          >
                            <Sparkles className="w-3 h-3 mr-2" />
                            {t('genCopy')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        currentName={user.displayName || ''}
        currentPhotoURL={user.photoURL || ''}
      />
    </>
  );
}
