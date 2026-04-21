/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PromptsPage from '@/pages/PromptsPage';
import PromptDetailsPage from '@/pages/PromptDetailsPage';
import GeneratorPage from '@/pages/GeneratorPage';
import ProfilePage from '@/pages/ProfilePage';
import FavoritesPage from '@/pages/FavoritesPage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import GuidesPage from '@/pages/GuidesPage';
import GuideDetailsPage from '@/pages/GuideDetailsPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/LanguageContext';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/prompts" element={<PromptsPage />} />
                <Route path="/prompt/:id" element={<PromptDetailsPage />} />
                <Route path="/generator" element={<GeneratorPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:id" element={<GuideDetailsPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </div>
            <Footer />
            <BottomNav />
            <Toaster position="top-center" expand={false} richColors />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}



