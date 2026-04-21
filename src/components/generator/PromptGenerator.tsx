import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Copy, RefreshCw, Check, Wand2, Lightbulb } from 'lucide-react';
import { generatePrompt } from '@/services/gemini';
import { GeneratedPrompt } from '@/types';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { saveGeneration } from '@/services/firebase';

export default function PromptGenerator() {
  const [idea, setIdea] = useState(() => sessionStorage.getItem('gen_idea') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPrompt | null>(() => {
    const cached = sessionStorage.getItem('gen_result');
    return cached ? JSON.parse(cached) : null;
  });
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isArabic = language === 'ar';

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('gen_idea', idea);
  }, [idea]);

  useEffect(() => {
    if (result) {
      sessionStorage.setItem('gen_result', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('gen_result');
    }
  }, [result]);

  const inspirationChips = language === 'ar' ? [
    'إضاءة سينمائية', 'تصوير ماكرو', 'ألوان نيون', 'واقعية مفرطة', 'تصميم ثلاثي الأبعاد', 'أسلوب سايبربانك', 'خلفية ضبابية',
    'تموية الكائن', 'زاوية منخفضة', 'إضاءة ريمبراندت', 'عدسة 85 ملم', 'دقة 8K', 'تفاصيل حادة', 'إضاءة ناعمة', 'نمط عتيق'
  ] : [
    'Cinematic Lighting', 'Macro Photography', 'Neon Colors', 'Hyper-realistic', '3D Render', 'Cyberpunk Style', 'Bokeh Background',
    'Object Blur', 'Low Angle', 'Rembrandt Lighting', '85mm Lens', '8K Resolution', 'Sharp Details', 'Soft Lighting', 'Vintage Style'
  ];

  const handleAddInspiration = (chip: string) => {
    setIdea(prev => prev ? `${prev}, ${chip}` : chip);
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error(language === 'ar' ? 'الرجاء تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    if (!idea.trim()) {
      toast.error(language === 'ar' ? 'الرجاء كتابة فكرتك أولاً' : 'Please enter an idea first');
      return;
    }

    setLoading(true);
    try {
      const data = await generatePrompt(idea);
      setResult(data);
      
      // Save to Firestore
      if (user) {
        await saveGeneration(user.uid, data.prompt);
      }
      
      toast.success(language === 'ar' ? 'تم توليد البرومبت بنجاح!' : 'Prompt generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error(language === 'ar' ? 'فشل في التوليد. حاول مرة أخرى.' : 'Failed to generate prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('genCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
          <Wand2 className="w-10 h-10 text-primary relative z-10" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight whitespace-nowrap">{t('genTitle')}</h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">{t('genSubtitle')}</p>
      </div>

      <Card className="p-8 rounded-[2rem] shadow-2xl border-white/10 bg-white/5 backdrop-blur-xl mb-12 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="relative group">
            <Textarea
              placeholder={t('genPlaceholder')}
              className="min-h-[160px] rounded-2xl border-white/10 focus:ring-primary focus:border-primary text-lg p-6 resize-none bg-black/40 text-white placeholder:text-white/30 transition-all group-hover:bg-black/60"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>

          {/* Inspiration Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/50 font-medium">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              {t('genInspiration')}
            </div>
            <div className="flex flex-wrap gap-2">
              {inspirationChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddInspiration(chip)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-16 rounded-2xl text-lg font-bold shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all hover:scale-[1.02] bg-white text-black hover:bg-gray-200 border-none relative"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                {t('genLoading')}
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-6 w-6" />
                {t('genButton')}
              </>
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Main Prompt */}
            <Card className="p-8 md:p-10 rounded-[2rem] border-primary/30 bg-primary/10 relative overflow-hidden backdrop-blur-md">
              <div className={cn("absolute top-0 p-4", isArabic ? "left-0" : "right-0")}>
                <Badge className="bg-primary text-black border-none shadow-lg shadow-primary/20">{t('genBadge')}</Badge>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> {t('genResultTitle')}
              </h3>
              
              <p className="text-2xl text-white font-medium leading-relaxed mb-10 font-display">
                {result.prompt}
              </p>
              
              <Button 
                onClick={() => copyToClipboard(result.prompt)}
                className="w-full sm:w-auto rounded-xl h-14 px-8 bg-white text-black hover:bg-gray-200 transition-all font-bold text-lg"
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {t('genCopy')}
              </Button>
            </Card>

            {/* Variations & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 ml-2">{t('genVariations')}</h3>
                {result.variations.map((v, i) => (
                  <Card key={i} className="p-6 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-colors group backdrop-blur-sm">
                    <p className="text-white/80 mb-6 leading-relaxed">{v}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(v)}
                      className="text-primary hover:bg-primary/20 rounded-lg w-full sm:w-auto"
                    >
                      <Copy className="w-4 h-4 mr-2" /> {t('genCopy')}
                    </Button>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card className="p-8 rounded-2xl bg-amber-500/10 border-amber-500/20 backdrop-blur-sm">
                  <h4 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> {t('genProTip')}
                  </h4>
                  <p className="text-amber-200/80 leading-relaxed">
                    {t('genProTipText')}
                  </p>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
