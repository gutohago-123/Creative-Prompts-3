import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Mail, MessageCircle, FileText, ChevronDown } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function HelpCenterPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const faqs = [
    {
      q: language === 'ar' ? 'كيف يمكنني استخدام مولد الذكاء الاصطناعي؟' : 'How do I use the AI Generator?',
      a: language === 'ar' 
        ? 'يمكنك الانتقال إلى صفحة "المولد" من القائمة العلوية، ثم كتابة وصف للصورة التي تريدها، وسيقوم الذكاء الاصطناعي بإنشاء برومبت احترافي لك.'
        : 'Navigate to the "Generator" page from the top menu, type a description of the image you want, and our AI will craft a professional prompt for you.'
    },
    {
      q: language === 'ar' ? 'كيف يمكنني حفظ البرومبتات المفضلة؟' : 'How can I save my favorite prompts?',
      a: language === 'ar'
        ? 'يمكنك النقر على أيقونة القلب في أي بطاقة برومبت لإضافتها إلى مفضلتك. يمكنك الوصول إلى مفضلتك في أي وقت من صفحة ملفك الشخصي.'
        : 'You can click on the heart icon on any prompt card to add it to your favorites. You can access your favorites anytime from your profile page.'
    },
    {
      q: language === 'ar' ? 'هل يمكنني استخدام البرومبتات لأغراض تجارية؟' : 'Can I use the prompts for commercial purposes?',
      a: language === 'ar'
        ? 'نعم، جميع البرومبتات المتوفرة على منصتنا يمكن استخدامها في مشاريعك الشخصية والتجارية دون أي قيود.'
        : 'Yes, all prompts available on our platform can be used for both personal and commercial projects without restrictions.'
    },
    {
      q: language === 'ar' ? 'كيف يمكنني تحديث معلومات ملفي الشخصي؟' : 'How do I update my profile information?',
      a: language === 'ar'
        ? 'انتقال إلى صفحة ملفك الشخصي وانقر على زر "تعديل الملف الشخصي". يمكنك تغيير اسم العرض الخاص بك والإعدادات الأخرى من هناك.'
        : 'Go to your profile page and click on the "Edit Profile" button. You can change your display name and other settings from there.'
    },
    {
      q: language === 'ar' ? 'هل الموقع مجاني بالكامل؟' : 'Is the site completely free?',
      a: language === 'ar'
        ? 'نعم، الموقع حالياً مجاني بالكامل لجميع المستخدمين، ويمكنك استخدام المولد وتصفح المعرض دون أي رسوم.'
        : 'Yes, the site is currently completely free for all users. You can use the generator and browse the gallery without any fees.'
    },
    {
      q: language === 'ar' ? 'كيف يمكنني الإبلاغ عن مشكلة تقنية؟' : 'How can I report a technical issue?',
      a: language === 'ar'
        ? 'يمكنك التواصل معنا عبر البريد الإلكتروني الموضح في قسم "تواصل معنا" أعلاه، أو عبر المحادثة المباشرة وسيقوم فريقنا بمساعدتك.'
        : 'You can contact us via the email provided in the "Contact Us" section above, or via live chat, and our team will assist you.'
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            {t('helpCenterTitle')}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t('helpCenterSubtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن سؤالك هنا...' : 'Search for your question here...'}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm transition-all"
          />
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Card className="p-8 rounded-[2rem] bg-white/5 border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-400">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{language === 'ar' ? 'واتساب' : 'WhatsApp'}</h3>
            <p className="text-white/60 mb-6">{language === 'ar' ? 'تحدث معنا مباشرة عبر واتساب' : 'Chat with us directly on WhatsApp'}</p>
            <a 
              href="https://wa.me/967776150996" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }), 
                "w-full border-white/20 text-white hover:bg-white/10 h-10 flex items-center justify-center rounded-lg"
              )}
            >
              {language === 'ar' ? 'ابدأ المحادثة' : 'Start Chat'}
            </a>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Card className="p-8 rounded-[2rem] bg-white/5 border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Support'}</h3>
            <p className="text-white/60 mb-6">{language === 'ar' ? 'أرسل لنا رسالة مفصلة' : 'Send us a detailed message'}</p>
            <a 
              href="mailto:moazbakhrish@gmail.com" 
              className={cn(
                buttonVariants({ variant: "outline" }), 
                "w-full border-white/20 text-white hover:bg-white/10 h-10 flex items-center justify-center rounded-lg"
              )}
            >
              {language === 'ar' ? 'أرسل رسالة' : 'Send Email'}
            </a>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <Card className="p-8 rounded-[2rem] bg-white/5 border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{language === 'ar' ? 'الأدلة والشروحات' : 'Guides & Docs'}</h3>
            <p className="text-white/60 mb-6">{language === 'ar' ? 'تصفح مكتبة الشروحات' : 'Browse our documentation'}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/guides')}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              {language === 'ar' ? 'تصفح الأدلة' : 'Browse Docs'}
            </Button>
          </Card>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">{t('faq')}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <details className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                  {faq.q}
                  <span className="transition duration-300 group-open:-rotate-180">
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-white/70 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
