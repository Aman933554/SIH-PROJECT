import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, PhoneCall, Volume2, Languages, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation, getTTSLang } from '../utils/translations';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);

  const playGreeting = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(t('welcomeSub'));
      utterance.lang = getTTSLang(language);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-modern-gradient flex flex-col items-center p-4 relative overflow-hidden">
      
      {/* Decorative background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-sky-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>

      {/* Hero Section Navigation & Language Toggle */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-4xl flex justify-center items-center glass-panel p-3 rounded-2xl mb-12 mt-6"
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700">
          <Languages className="w-5 h-5 text-sky-400" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer border-none focus:ring-0"
          >
            <option value="hi-IN" className="bg-slate-800">हिंदी (Hindi)</option>
            <option value="en-IN" className="bg-slate-800">English</option>
            <option value="bn-IN" className="bg-slate-800">বাংলা (Bengali)</option>
            <option value="mr-IN" className="bg-slate-800">मराठी (Marathi)</option>
            <option value="gu-IN" className="bg-slate-800">ગુજરાતી (Gujarati)</option>
            <option value="ta-IN" className="bg-slate-800">தமிழ் (Tamil)</option>
            <option value="te-IN" className="bg-slate-800">తెలుగు (Telugu)</option>
            <option value="kn-IN" className="bg-slate-800">ಕನ್ನಡ (Kannada)</option>
            <option value="ml-IN" className="bg-slate-800">മലയാളം (Malayalam)</option>
            <option value="pa-IN" className="bg-slate-800">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="or-IN" className="bg-slate-800">ଓଡ଼ିଆ (Odia)</option>
            <option value="ur-IN" className="bg-slate-800">اردو (Urdu)</option>
            <option value="bho-IN" className="bg-slate-800">भोजपुरी (Bhojpuri)</option>
          </select>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="z-10 w-full max-w-2xl glass-panel rounded-[2.5rem] p-10 flex flex-col items-center text-center relative animate-float"
      >
        
        {/* Helper Audio Icon */}
        <button 
          onClick={playGreeting}
          className="absolute -top-6 bg-slate-800 p-4 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.3)] border border-sky-500/30 text-sky-400 hover:bg-slate-700 hover:scale-110 transition-all flex items-center justify-center group"
          title="Listen to Instructions"
        >
          <Volume2 className="w-7 h-7 group-hover:text-sky-300" />
        </button>

        <div className="mt-6 mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold">
            <Sparkles className="w-4 h-4" /> AI-Powered Assistant
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            {t('welcomeHero')}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-lg">
            {t('welcomeSub')}
          </p>
        </div>

        {/* Massive Primary Action */}
        <div className="relative mb-10 mt-4">
          <button 
            onClick={() => navigate('/assessment')}
            className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 rounded-full shadow-[0_0_40px_rgba(56,189,248,0.4)] flex items-center justify-center text-white hover:scale-105 transition-all duration-300 z-20 relative mic-pulse group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-all duration-300 rounded-full"></div>
            <Mic className="w-20 h-20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-lg z-10" />
          </button>
        </div>

        <button 
          onClick={() => navigate('/assessment?demo=true')}
          className="group flex items-center gap-2 text-slate-400 hover:text-sky-400 font-medium text-sm transition-colors bg-slate-800/50 px-5 py-2.5 rounded-full border border-slate-700 hover:border-sky-500/50"
        >
          {t('demoMode')}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Help Bar at bottom */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed bottom-0 w-full glass-panel border-t border-slate-800/50 p-4 flex justify-center gap-4 z-20"
      >
        <button className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3.5 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all">
          <PhoneCall className="w-5 h-5" />
          {t('callHelp')}
        </button>
      </motion.div>

    </div>
  );
}
