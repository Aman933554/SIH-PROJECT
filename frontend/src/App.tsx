import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WifiOff, Home, User, Languages, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useTranslation } from './utils/translations';

import LandingPage from './pages/LandingPage';
import AssessmentFlow from './pages/AssessmentFlow';
import BeneficiaryDashboard from './pages/BeneficiaryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ResumeView from './pages/ResumeView';
import MockInterview from './pages/MockInterview';

const NotFound = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <div className="text-6xl font-bold text-slate-700 mb-4">404</div>
    <div className="text-xl text-slate-400">Page not found</div>
  </div>
);

function AppContent() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 relative font-['Inter'] text-slate-200">
      
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/90 backdrop-blur-sm text-amber-950 font-bold px-4 py-3 flex items-center justify-center gap-3 overflow-hidden z-50 text-base shadow-lg border-b border-amber-400/50"
          >
            <WifiOff className="w-5 h-5" />
            इन्टरनेट बंद है, लेकिन आप अभी भी इसका उपयोग कर सकते हैं। (Offline Mode)
          </motion.div>
        )}
      </AnimatePresence>

      <header className="glass-panel p-4 flex justify-between items-center relative z-20 sticky top-0 rounded-b-2xl mx-2 mt-2 border border-slate-700/50 shadow-lg">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight leading-none">
              Jeevika<span className="text-sky-400">AI</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Livelihood Assistant</span>
          </div>
        </Link>
        
        <nav className="flex gap-2 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-xl hover:bg-slate-700/50 border border-transparent hover:border-slate-600">
            <User className="w-5 h-5" />
            <span className="text-sm font-semibold hidden sm:block">{t('profile')}</span>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 relative pb-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment/*" element={<AssessmentFlow />} />
          <Route path="/dashboard" element={<BeneficiaryDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/resume/:id" element={<ResumeView />} />
          <Route path="/interview/:id" element={<MockInterview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
