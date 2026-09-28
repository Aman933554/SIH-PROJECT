import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Send, ArrowLeft, Bot, User, CheckCircle, BarChart3, X, Sparkles, Activity } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

export default function MockInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  // Use Voice Recognition hook
  const { isRecording, transcript, startRecording, stopRecording } = useVoiceRecognition('hi-IN');

  // Update input text when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // TTS Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Initial bot message
    const initialText = "Namaste! Welcome to your Mock Interview session. Are you ready to begin?";
    setMessages([
      { id: 1, sender: 'ai', text: initialText }
    ]);
    setTimeout(() => speakText(initialText), 500);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    if (isRecording) stopRecording();

    // Mock AI response delay
    setTimeout(() => {
      let aiText = "";
      if (!interviewStarted) {
        setInterviewStarted(true);
        aiText = "Great. Let's start. Can you tell me about your experience working as a Carpenter?";
      } else {
        aiText = "That's good. How do you ensure safety while using heavy power tools?";
      }
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: aiText }]);
      speakText(aiText);
    }, 1500);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setInputText('');
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-['Inter'] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="glass-panel border-b border-slate-700/50 p-4 flex items-center shadow-lg relative z-20">
        <button onClick={() => navigate(-1)} className="mr-4 text-slate-400 hover:text-sky-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            <Bot className="text-white w-5 h-5" />
          </div>
          AI Interviewer
        </h1>
        <div className="ml-auto">
          <button onClick={() => setShowReport(true)} className="bg-slate-800 text-slate-300 border border-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-sky-500 hover:text-white hover:border-sky-400 shadow-sm transition-all flex items-center gap-2">
            <CheckCircle className="w-5 h-5"/> Finish
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div 
              initial={{opacity:0, y:20, scale:0.95}} 
              animate={{opacity:1, y:0, scale:1}} 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl shadow-lg relative overflow-hidden backdrop-blur-md border ${
                msg.sender === 'user' 
                ? 'bg-sky-600/20 text-white rounded-tr-sm border-sky-500/30' 
                : 'bg-slate-800/60 text-slate-200 rounded-tl-sm border-slate-700'
              }`}>
                {msg.sender === 'ai' && <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-sky-500"></div>}
                
                <div className="flex items-center gap-2 mb-3 opacity-70 text-xs uppercase tracking-widest font-bold">
                  {msg.sender === 'user' ? (
                    <><User className="w-3.5 h-3.5" /> You</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5 text-sky-400" /> <span className="text-sky-300">Jeevika AI</span></>
                  )}
                </div>
                <p className="leading-relaxed text-lg">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="glass-panel border-t border-slate-700/50 p-4 pb-8 relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          
          {/* Audio Visualizer Mock */}
          <AnimatePresence>
            {isRecording && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex items-center gap-1 h-8 mb-2">
                {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, Math.random() * 30 + 10, 10] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                    className="w-1.5 bg-sky-400 rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full flex items-center gap-3">
            <button 
              onClick={toggleRecording}
              className={`p-4 rounded-full transition-all flex items-center justify-center relative ${
                isRecording 
                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] mic-pulse-active' 
                : 'bg-slate-800 text-sky-400 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              <Mic className={`w-7 h-7 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
            
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? "Listening to your answer..." : "Type your answer here..."}
              className="flex-1 bg-slate-800/80 border border-slate-600 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400 text-lg shadow-inner"
            />
            
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white p-4 rounded-full disabled:opacity-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              <Send className="w-6 h-6 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Confidence Report Card Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="glass-card w-full max-w-lg overflow-hidden shadow-2xl relative border-slate-600">
              <button onClick={() => setShowReport(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 bg-slate-800 rounded-full p-2"><X className="w-5 h-5"/></button>
              
              <div className="bg-gradient-to-r from-indigo-900/50 to-sky-900/50 p-8 text-white text-center border-b border-slate-700">
                <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-500/30">
                  <Activity className="w-10 h-10 text-sky-400" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">AI Confidence Report</h2>
                <p className="text-sky-300 mt-2 font-medium">Interview Performance Analysis</p>
              </div>
              
              <div className="p-8 bg-slate-800/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overall Match</p>
                    <div className="w-28 h-28 rounded-full border-8 border-sky-500 flex items-center justify-center mx-auto text-4xl font-black text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] inset-0">
                      85<span className="text-xl text-sky-400">%</span>
                    </div>
                  </div>
                  <div className="space-y-5 flex-1 ml-8">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-slate-300">Clarity</span> <span className="text-sky-400">Good</span></div>
                      <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-sky-400 h-2 rounded-full w-[90%] shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-slate-300">Confidence</span> <span className="text-indigo-400">Excellent</span></div>
                      <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-indigo-400 h-2 rounded-full w-[95%] shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-slate-300">Relevance</span> <span className="text-amber-400">Average</span></div>
                      <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-amber-400 h-2 rounded-full w-[70%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-indigo-500"></div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" /> AI Feedback
                  </p>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    "You spoke with great confidence and your answers were clear! To improve, try adding more specific examples about your past woodworking projects when asked about experience."
                  </p>
                </div>
              </div>
              
              <div className="p-5 bg-slate-900 border-t border-slate-700">
                <button onClick={() => navigate('/dashboard')} className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white py-4 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:scale-[1.02] transition-transform">
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
