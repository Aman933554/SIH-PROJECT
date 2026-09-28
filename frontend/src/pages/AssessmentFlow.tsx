import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { db } from '../db/db';
import { Mic, ArrowRight, CheckCircle, Volume2, MapPin, Briefcase, BookOpen, UserCircle, Star, Phone, Calendar, Send, Play, X, Landmark, Sparkles } from 'lucide-react';
import { MOCK_USER_PROFILE, MOCK_SKILL_GAP, MOCK_NSQF_TRAINING, MOCK_JOBS, MOCK_SCHEMES } from '../utils/mockData';
import { extractProfile, analyzeSkillGap, matchOpportunities } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation, getTTSLang } from '../utils/translations';

export default function AssessmentFlow() {
  const reactLocation = useLocation();
  const navigate = useNavigate();

  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [step, setStep] = useState(1);
  const [userLocation, setUserLocation] = useState('');
  const [mapCoords, setMapCoords] = useState<{lat: number, lon: number} | null>(null);
  const [manualInput, setManualInput] = useState('');
  
  const [questionIndex, setQuestionIndex] = useState(1);
  const [fullTranscript, setFullTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any>(null);

  // Modals for new SIH features
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { isRecording, transcript, startRecording, stopRecording, isSupported } = useVoiceRecognition(language);

  useEffect(() => {
    const searchParams = new URLSearchParams(reactLocation.search);
    if (searchParams.get('demo') === 'true') {
      setUserProfile(MOCK_USER_PROFILE);
      setSkillGap(MOCK_SKILL_GAP);
      setOpportunities({ jobs: MOCK_JOBS, enterprises: [] });
      setStep(4);
    }
  }, [reactLocation]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getTTSLang(language);
    utterance.rate = 0.9; 
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (step === 2) {
      speakText(t(`q${questionIndex}`));
    }
  }, [step, questionIndex]);

  const nextStep = () => setStep(s => s + 1);

  const fetchLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          
          const addr = data.address;
          const exactArea = addr.residential || addr.neighbourhood || addr.suburb || addr.city_district || '';
          const cityArea = addr.city || addr.town || addr.village || addr.county || '';
          const exactLocation = [exactArea, cityArea].filter(Boolean).join(', ');
          
          setUserLocation(exactLocation || data.display_name || 'Location Found');
          setMapCoords({ lat, lon });
        } catch (e) {
          setUserLocation('GPS Failed');
        } finally {
          setIsLoading(false);
        }
      }, () => {
        setIsLoading(false);
        setUserLocation('GPS Denied');
      });
    } else {
      setIsLoading(false);
      setUserLocation('GPS Not Supported');
    }
  };

  const searchManualLocation = async () => {
    if (!manualInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualInput)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const topHit = data[0];
        const lat = parseFloat(topHit.lat);
        const lon = parseFloat(topHit.lon);
        setMapCoords({ lat, lon });
        setUserLocation(manualInput); 
      } else {
        setUserLocation('Location not found');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const currentQ = t(`q${questionIndex}`);
    if (transcript) {
      setFullTranscript(prev => prev + ` [Q: ${currentQ} A: ${transcript}] `);
    }
    
    if (questionIndex < 5) {
      setQuestionIndex(q => q + 1);
      if (isRecording) stopRecording();
    } else {
      saveTranscriptAndProceed();
    }
  };

  const saveTranscriptAndProceed = async () => {
    const currentQ = t(`q${questionIndex}`);
    const finalTranscript = fullTranscript + (transcript ? ` [Q: ${currentQ} A: ${transcript}] ` : '');
    
    setIsLoading(true);
    setLoadingText(t('creatingProfile'));
    try {
      const res = await extractProfile(finalTranscript, language);
      const profileToSave = res.success && res.profile ? res.profile : MOCK_USER_PROFILE;
      setUserProfile(profileToSave);

      await db.profiles.add({ 
        transcript: finalTranscript,
        language,
        status: 'pending_sync',
        timestamp: new Date().toISOString(),
        parsedData: profileToSave
      });
      
      nextStep();
    } catch (err) {
      setUserProfile(MOCK_USER_PROFILE); 
      nextStep();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAndMatch = async () => {
    setIsLoading(true);
    setLoadingText(t('findingJobs'));
    try {
      const skills = userProfile?.skills?.map((s:any) => s.name) || ['Farming'];
      const target = userProfile?.employmentPreference || 'Agriculture';
      const gapRes = await analyzeSkillGap(skills, target);
      setSkillGap(gapRes || MOCK_SKILL_GAP);

      const oppRes = await matchOpportunities(skills, target, userLocation, target);
      setOpportunities(oppRes.success ? oppRes.data : { jobs: MOCK_JOBS, enterprises: [] });
      
      nextStep();
    } catch (err) {
      setSkillGap(MOCK_SKILL_GAP);
      setOpportunities({ jobs: MOCK_JOBS, enterprises: [] }); 
      nextStep();
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = { initial: { opacity: 0, scale: 0.95 }, in: { opacity: 1, scale: 1 }, out: { opacity: 0, scale: 1.05 } };
  const pageTransition: any = { type: "tween", ease: "anticipate", duration: 0.4 };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 relative overflow-hidden font-['Inter']">
      
      {/* Dynamic Ambiance */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-sky-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="w-10 h-10 text-sky-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-8 tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">{loadingText}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex-1 flex items-center justify-center py-10 z-10">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Location Prompt */}
          {step === 1 && (
            <motion.div key="step1" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-lg">
              <div className="glass-card p-8 text-center relative border-slate-700/50">
                <div className="w-24 h-24 bg-sky-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-sky-500/30 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  <MapPin className="w-12 h-12 text-sky-400 animate-bounce" />
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">{t('locationPrompt')}</h2>
                <p className="text-slate-400 font-medium mb-8">{t('locationDesc')}</p>
                
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 mb-6 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Detected Location</p>
                  <p className="text-xl font-bold text-white mb-3">{userLocation || 'Not Detected'}</p>
                  
                  {mapCoords && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-600 shadow-inner mt-4 relative">
                      <iframe 
                        width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} 
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lon-0.01}%2C${mapCoords.lat-0.01}%2C${mapCoords.lon+0.01}%2C${mapCoords.lat+0.01}&layer=mapnik&marker=${mapCoords.lat}%2C${mapCoords.lon}`}
                        className="opacity-70 grayscale-[0.8] invert"
                      ></iframe>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <button onClick={fetchLocation} className="w-full bg-slate-800 text-white p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 transition-all">
                    <MapPin className="w-5 h-5 text-sky-400" /> Auto Detect GPS
                  </button>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={manualInput} 
                      onChange={(e) => setManualInput(e.target.value)} 
                      placeholder="Or type exact location..." 
                      className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-sky-500 text-white placeholder-slate-500"
                    />
                    <button onClick={searchManualLocation} className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                      Find
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-8 p-6 border border-slate-700/50 rounded-2xl bg-slate-800/40 relative overflow-hidden">
                  <p className="text-sm font-bold text-slate-400 mb-6">Or speak your city/village name:</p>
                  <button 
                    onClick={isRecording ? () => { stopRecording(); if(transcript) { setUserLocation(transcript); setManualInput(transcript); } } : startRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all z-10 relative ${isRecording ? 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.6)] mic-pulse-active' : 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-110'}`}
                  >
                    <Mic className={`w-10 h-10 ${isRecording ? 'animate-pulse' : ''}`} />
                  </button>
                  {isRecording && <p className="text-sky-400 mt-6 font-bold">{transcript || t('listening')}</p>}
                </div>
                
                <button onClick={nextStep} disabled={!userLocation && !isRecording} className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-900 p-5 rounded-xl font-extrabold text-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale">
                  {t('start')} <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Voice Conversation */}
          {step === 2 && (
            <motion.div key="step2" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-xl flex flex-col items-center">
              
              <div className="flex gap-3 mb-10">
                {[1, 2, 3, 4, 5].map(q => (
                  <div key={q} className="relative">
                    <div className={`w-12 h-1.5 rounded-full ${q < questionIndex ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : q === questionIndex ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-10 w-full text-center relative border-slate-700/50">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-12 min-h-[5rem] flex items-center justify-center drop-shadow-md">
                  {t(`q${questionIndex}`)}
                </h2>

                <div className="relative flex justify-center mb-16 mt-8">
                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isSupported}
                    className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative z-10 transition-all shadow-2xl ${
                      isRecording 
                        ? 'bg-rose-500 text-white mic-pulse-active shadow-[0_0_50px_rgba(244,63,94,0.6)]' 
                        : 'bg-gradient-to-tr from-indigo-500 to-sky-500 text-white mic-pulse hover:scale-105'
                    }`}
                  >
                    <Mic className={`w-20 h-20 md:w-24 md:h-24 ${isRecording ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                <div className="bg-slate-900/60 min-h-[6rem] rounded-2xl p-6 border border-slate-700 flex items-center justify-center mb-10 shadow-inner">
                  <p className={`text-xl font-medium ${transcript ? 'text-white' : 'text-slate-500'}`}>
                    {transcript || (isRecording ? "Listening to your answer..." : "Tap the microphone to speak")}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => speakText(t(`q${questionIndex}`))} className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-700 border border-slate-600 transition-colors">
                    <Volume2 className="w-5 h-5"/> {t('replayVoice')}
                  </button>
                  <button 
                    onClick={handleNextQuestion}
                    disabled={isRecording && !transcript}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-4 rounded-xl font-extrabold text-lg flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-lg"
                  >
                    {t('next')} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Detailed Profile Card */}
          {step === 3 && (
            <motion.div key="step3" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-lg">
              <div className="glass-card overflow-hidden border-slate-600">
                <div className="bg-gradient-to-r from-indigo-900 to-sky-900 p-8 text-center text-white relative border-b border-slate-700/50">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-sky-400 mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4"/> AI Generated Profile
                  </h2>
                  <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto p-1 shadow-[0_0_30px_rgba(14,165,233,0.3)] mb-5 relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name || 'Ramesh'}&backgroundColor=1e293b`} alt="Avatar" className="w-full h-full rounded-full" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-2 border-slate-900 text-slate-900">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight">{userProfile?.name || "Ramesh Kumar"}</h3>
                  <p className="text-sky-300 font-medium mt-1">{userProfile?.currentOccupation || "Farmer"} • {userLocation || "Bhopal"}</p>
                </div>
                
                <div className="p-8 space-y-5 bg-slate-800/40">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-sky-400"/> {t('education')}</p>
                      <p className="font-bold text-white">{userProfile?.education || "10th Pass"}</p>
                    </div>
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400"/> {t('exp')}</p>
                      <p className="font-bold text-white">{userProfile?.skills?.[0]?.experienceYears || "2"} Years</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-400"/> {t('topSkills')}</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile?.skills?.map((s:any, i:number) => (
                        <span key={i} className="bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-500/30">{s.name}</span>
                      )) || <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-indigo-500/30">Farming</span>}
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> {t('preference')}</p>
                    <p className="font-bold text-white">{userProfile?.employmentPreference || "Wage Employment"}</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 border-t border-slate-700">
                  <button onClick={handleAnalyzeAndMatch} className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-4 rounded-xl font-bold text-xl flex justify-center items-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                    Analyze Opportunities <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Pathways */}
          {step === 4 && (
            <motion.div key="step4" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-2xl">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-sm mb-4">
                  <Sparkles className="w-4 h-4"/> AI Generated Pathways
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">आपके लिए बेहतरीन विकल्प</h2>
                <p className="text-slate-400 mt-2 font-medium">Top matches curated for you</p>
              </div>

              <div className="space-y-6 pb-20">
                {/* Job Card */}
                {((opportunities?.jobs || MOCK_JOBS).length > 0) && (
                  <div className="glass-card p-6 border-l-4 border-l-sky-500 relative overflow-hidden group hover:border-slate-500 transition-colors">
                    <div className="absolute top-0 right-0 bg-sky-500/20 px-4 py-2 rounded-bl-2xl font-bold text-sky-400 border-b border-l border-sky-500/30 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-sky-400"/> {(opportunities?.jobs || MOCK_JOBS)[0].matchScore}% Match
                    </div>
                    <div className="flex items-center gap-5 mb-5 mt-2">
                      <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20 shadow-inner">
                        <Briefcase className="w-8 h-8 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('matchedJobs')}</p>
                        <h3 className="text-2xl font-extrabold text-white">{(opportunities?.jobs || MOCK_JOBS)[0].title}</h3>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center mb-5 border border-slate-700/50">
                      <span className="text-slate-300 flex items-center gap-2"><MapPin className="w-5 h-5 text-sky-400"/> {(opportunities?.jobs || MOCK_JOBS)[0].location}</span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">{(opportunities?.jobs || MOCK_JOBS)[0].salary}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-500 transition-colors">
                        {t('save')}
                      </button>
                      <button onClick={() => { setSelectedItem((opportunities?.jobs || MOCK_JOBS)[0]); setShowVideoModal(true); }} className="px-5 bg-slate-800 text-slate-300 rounded-xl font-bold flex flex-col items-center justify-center border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors">
                        <Play className="w-5 h-5 mb-1 text-sky-400"/> <span className="text-[10px] uppercase tracking-wider">Preview</span>
                      </button>
                      <button onClick={() => { setSelectedItem((opportunities?.jobs || MOCK_JOBS)[0]); setShowWhatsAppModal(true); }} className="px-5 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold flex flex-col items-center justify-center border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">
                        <Send className="w-5 h-5 mb-1"/> <span className="text-[10px] uppercase tracking-wider">Send</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Training Card */}
                <div className="glass-card p-6 border-l-4 border-l-indigo-500 relative overflow-hidden group hover:border-slate-500 transition-colors">
                  <div className="absolute top-0 right-0 bg-indigo-500/20 px-4 py-2 rounded-bl-2xl font-bold text-indigo-400 border-b border-l border-indigo-500/30 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-indigo-400"/> {MOCK_NSQF_TRAINING[0].matchScore}% Match
                  </div>
                    <div className="flex items-center gap-5 mb-5 mt-2">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                      <BookOpen className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('matchedTraining')}</p>
                      <h3 className="text-2xl font-extrabold text-white">{MOCK_NSQF_TRAINING[0].title}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-2 mb-5 border border-slate-700/50 text-slate-300 font-medium">
                     <MapPin className="w-5 h-5 text-indigo-400"/> {MOCK_NSQF_TRAINING[0].provider}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors">
                      {t('save')}
                    </button>
                    <button onClick={() => { setSelectedItem(MOCK_NSQF_TRAINING[0]); setShowWhatsAppModal(true); }} className="px-5 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold flex flex-col items-center justify-center border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">
                      <Send className="w-5 h-5 mb-1"/> <span className="text-[10px] uppercase tracking-wider">Send</span>
                    </button>
                  </div>
                </div>

                {/* Government Scheme Card */}
                <div className="glass-card p-6 border-l-4 border-l-purple-500 relative overflow-hidden group hover:border-slate-500 transition-colors">
                  <div className="absolute top-0 right-0 bg-purple-500/20 px-4 py-2 rounded-bl-2xl font-bold text-purple-400 border-b border-l border-purple-500/30 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-purple-400"/> {MOCK_SCHEMES[0].matchScore}% Match
                  </div>
                    <div className="flex items-center gap-5 mb-5 mt-2">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                      <Landmark className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Eligible Scheme</p>
                      <h3 className="text-2xl font-extrabold text-white">{MOCK_SCHEMES[0].title}</h3>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-3 mb-5 border border-slate-700/50 text-purple-300 font-medium">
                     <CheckCircle className="w-5 h-5 text-purple-400"/> {MOCK_SCHEMES[0].benefit}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-500 transition-colors">
                      Apply Now
                    </button>
                    <button onClick={() => { setSelectedItem(MOCK_SCHEMES[0]); setShowWhatsAppModal(true); }} className="px-5 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold flex flex-col items-center justify-center border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">
                      <Send className="w-5 h-5 mb-1"/> <span className="text-[10px] uppercase tracking-wider">Send</span>
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={() => navigate('/')} className="mt-8 w-full text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-white transition-colors bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                {t('navHome')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp Modal Simulation */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700">
              <div className="bg-[#075E54] text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Send className="w-5 h-5"/></div>
                  <div>
                    <h3 className="font-bold">WhatsApp Alert</h3>
                    <p className="text-xs text-white/80">Message sent successfully</p>
                  </div>
                </div>
                <button onClick={() => setShowWhatsAppModal(false)}><X className="w-6 h-6"/></button>
              </div>
              <div className="p-4 bg-[#0B141A] min-h-[250px] bg-[url('https://i.imgur.com/8BkwQ1i.png')] bg-contain">
                <div className="bg-[#005C4B] p-3 rounded-lg rounded-tr-none shadow-md max-w-[85%] ml-auto mb-2 text-sm text-slate-200">
                  <p>नमस्कार! आपको <b>{selectedItem?.title}</b> के लिए चुना गया है।</p>
                  <p className="mt-2 text-slate-300">📍 {selectedItem?.location || selectedItem?.provider || 'Nearest Center'}</p>
                  <p className="mt-2 text-sky-400 font-bold cursor-pointer">Tap here to view details</p>
                  <p className="text-[10px] text-right mt-1 text-emerald-400">✓✓ Just now</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Preview Modal Simulation */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="glass-card w-full max-w-lg overflow-hidden shadow-2xl relative border-slate-600">
              <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 z-20 bg-slate-900/50 text-white rounded-full p-2 backdrop-blur-md hover:bg-slate-800 border border-slate-600">
                <X className="w-6 h-6"/>
              </button>
              <div className="w-full h-72 bg-slate-900 flex flex-col items-center justify-center text-white relative">
                <img src={`https://images.unsplash.com/photo-1592982537447-6f202c46f14b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)] z-10 mb-4 animate-pulse border-2 border-white/20 cursor-pointer">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <h3 className="z-10 font-bold text-2xl text-center px-6">What does a {selectedItem?.title.split('(')[0]} do?</h3>
                <div className="z-10 text-xs font-bold uppercase tracking-widest text-sky-400 mt-3 px-3 py-1 bg-slate-900/60 rounded-full border border-sky-500/30">Visual Preview</div>
              </div>
              <div className="p-8 bg-slate-800/50">
                <h3 className="font-extrabold text-white text-2xl mb-3">{selectedItem?.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">This 30-second preview explains the day-to-day tasks, tools used, and expected environment for this role in your local language.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
