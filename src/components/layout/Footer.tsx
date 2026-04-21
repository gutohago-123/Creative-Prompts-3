import React from 'react';
import { Sparkles, Instagram, Send, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-950 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">{t('creativePrompts')}</span>
          </Button>
          <p className="text-gray-400 max-w-sm text-lg leading-relaxed">
            {t('footerDesc')}
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/mirez_design?igsh=MW1yN3Nva2ZpOXo3cg==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://t.me/prompts000" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <Send className="w-5 h-5 -translate-x-[2px] translate-y-[2px]" />
            </a>
            <a href="https://wa.me/967776150996" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">{t('platform')}</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/')}>{t('explorePrompts')}</Button></li>
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/generator')}>{t('aiGenerator')}</Button></li>
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/prompts')}>{t('galleryTitle')}</Button></li>
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/profile')}>{t('profile')}</Button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">{t('support')}</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/help')}>{t('helpCenter')}</Button></li>
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/terms')}>{t('termsOfService')}</Button></li>
            <li><Button variant="link" className="p-0 h-auto text-gray-400 hover:text-white" onClick={() => navigate('/privacy')}>{t('privacyPolicy')}</Button></li>
            <li><a href="mailto:moazbakhrish@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" /> {t('contactUs')}
            </a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>{t('rightsReserved')}</p>
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="flex items-center gap-2">
            {t('madeWith')} <Sparkles className="w-3 h-3 text-primary" /> {t('forCreativeCommunity')}
          </p>
          <p className="text-gray-500/80">تطوير: معاذ باخريش</p>
        </div>
      </div>
    </footer>
  );
}
