import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Lightbulb, Zap, Shield, Image, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function GuidesPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const guides = [
    {
      id: 'prompt-writing-basics',
      title: isArabic ? 'أساسيات كتابة البرومبت' : 'Prompt Writing Basics',
      description: isArabic 
        ? 'تعلم كيفية صياغة أوصاف دقيقة للحصول على أفضل النتائج من الذكاء الاصطناعي.' 
        : 'Learn how to craft precise descriptions to get the best results from AI.',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'pro-tips',
      title: isArabic ? 'نصائح للمحترفين' : 'Pro Tips',
      description: isArabic 
        ? 'استخدم الكلمات المفتاحية والأساليب الفنية لتحسين جودة الصور المولدة.' 
        : 'Use keywords and artistic styles to enhance the quality of generated images.',
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'using-generator',
      title: isArabic ? 'استخدام المولد بفعالية' : 'Using the Generator Effectively',
      description: isArabic 
        ? 'دليل شامل حول كيفية استخدام أدوات التوليد المتاحة في الموقع.' 
        : 'A comprehensive guide on how to use the generation tools available on the site.',
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      id: 'usage-rights',
      title: isArabic ? 'حقوق الاستخدام والخصوصية' : 'Usage Rights & Privacy',
      description: isArabic 
        ? 'كل ما تحتاج معرفته حول ملكية الصور وحقوق الاستخدام التجاري.' 
        : 'Everything you need to know about image ownership and commercial usage rights.',
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      id: 'image-styles',
      title: isArabic ? 'فهم أنماط الصور' : 'Understanding Image Styles',
      description: isArabic 
        ? 'استكشف الأنماط المختلفة مثل الواقعي، الفني، والكرتوني وكيفية طلبها.' 
        : 'Explore different styles like realistic, artistic, and cartoon and how to request them.',
      icon: Image,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      id: 'advanced-search',
      title: isArabic ? 'البحث المتقدم في المعرض' : 'Advanced Gallery Search',
      description: isArabic 
        ? 'كيفية العثور على البرومبتات المثالية باستخدام الفلاتر والكلمات الدلالية.' 
        : 'How to find the perfect prompts using filters and keywords.',
      icon: Search,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/help')}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className={cn("w-4 h-4 mr-2", isArabic && "rotate-180 ml-2 mr-0")} />
            {isArabic ? 'العودة لمركز المساعدة' : 'Back to Help Center'}
          </Button>
        </motion.div>

        <header className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            {isArabic ? 'الأدلة والشروحات' : 'Guides & Documentation'}
          </motion.h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {isArabic 
              ? 'كل ما تحتاجه لتصبح محترفاً في استخدام البرومبتات والذكاء الاصطناعي' 
              : 'Everything you need to become a pro in using prompts and AI'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-8 rounded-[2rem] bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-pointer h-full flex flex-col"
                onClick={() => navigate(`/guides/${guide.id}`)}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", guide.bg, guide.color)}>
                  <guide.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{guide.title}</h3>
                <p className="text-white/50 leading-relaxed flex-grow">{guide.description}</p>
                <Button variant="link" className="p-0 h-auto mt-6 text-primary font-bold justify-start">
                  {isArabic ? 'اقرأ المزيد' : 'Read More'}
                  <ArrowLeft className={cn("w-4 h-4 ml-2", isArabic ? "rotate-180" : "rotate-180")} />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
