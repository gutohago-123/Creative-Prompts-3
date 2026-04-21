import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  const { t, language } = useLanguage();

  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: language === 'ar' ? '1. قبول الشروط' : '1. Acceptance of Terms',
      content: language === 'ar' 
        ? 'من خلال الوصول إلى منصتنا واستخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام خدماتنا.'
        : 'By accessing and using our platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: language === 'ar' ? '2. حقوق الملكية الفكرية' : '2. Intellectual Property',
      content: language === 'ar'
        ? 'جميع البرومبتات والمحتوى المولد عبر منصتنا متاح للاستخدام الشخصي والتجاري. ومع ذلك، لا يجوز لك إعادة بيع البرومبتات نفسها كمنتج مستقل.'
        : 'All prompts and content generated through our platform are available for personal and commercial use. However, you may not resell the prompts themselves as a standalone product.'
    },
    {
      icon: <Scale className="w-6 h-6 text-blue-400" />,
      title: language === 'ar' ? '3. الاستخدام المقبول' : '3. Acceptable Use',
      content: language === 'ar'
        ? 'يجب ألا تستخدم منصتنا لإنشاء محتوى غير قانوني، مسيء، أو ينتهك حقوق الآخرين. نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه القواعد.'
        : 'You must not use our platform to generate illegal, offensive, or infringing content. We reserve the right to suspend or terminate your account if you violate these rules.'
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-amber-400" />,
      title: language === 'ar' ? '4. إخلاء المسؤولية' : '4. Disclaimer',
      content: language === 'ar'
        ? 'يتم توفير الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. نحن لا نضمن أن الخدمة ستكون خالية من الأخطاء أو الانقطاعات.'
        : 'The service is provided "as is" without any express or implied warranties. We do not guarantee that the service will be error-free or uninterrupted.'
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            {t('termsTitle')}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {t('termsSubtitle')}
          </p>
          <div className="mt-8 text-sm text-white/40">
            {language === 'ar' ? 'آخر تحديث: 12 أبريل 2026' : 'Last updated: April 12, 2026'}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-white/70 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
