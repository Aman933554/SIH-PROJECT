import { MOCK_USER_PROFILE, MOCK_NSQF_TRAINING } from '../utils/mockData';
import { User, MapPin, Briefcase, Award, ShieldCheck, Download, Printer, FileText, Bot, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BeneficiaryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen font-['Inter'] relative">
      
      {/* Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-sky-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            My Livelihood Profile <Sparkles className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-slate-400 font-medium mt-1">Manage your skills, pathways, and career growth</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/interview/1')} className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-105 transition-all">
            <Bot className="w-5 h-5 group-hover:animate-pulse"/> Mock Interview
          </button>
          <button onClick={() => navigate('/resume/1')} className="flex items-center gap-2 bg-slate-800 text-white border border-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 hover:border-sky-500/50 transition-all">
            <FileText className="w-5 h-5"/> View Resume
          </button>
        </div>
      </motion.div>

      {/* Official PM-AJAY ID Card Layout - Glassmorphism style */}
      <motion.div 
        initial={{opacity:0, scale:0.95}} 
        animate={{opacity:1, scale:1}} 
        transition={{delay: 0.1}}
        className="glass-card overflow-hidden mb-10 relative group"
      >
        {/* Animated border line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000"></div>
        
        {/* Card Header */}
        <div className="bg-slate-800/50 p-6 flex justify-between items-center relative overflow-hidden border-b border-slate-700/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="w-4 h-4 opacity-80 invert" alt="Gov" />
              Government of India
            </p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">PM-AJAY Livelihood Card</h2>
            <p className="text-slate-400 text-sm mt-1">Verified Beneficiary Identity</p>
          </div>
          <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-500/30 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:rotate-12 transition-transform">
            <ShieldCheck className="w-10 h-10 text-sky-400" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative z-10">
          
          <div className="w-32 h-32 bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl flex items-center justify-center shrink-0 -mt-16 md:mt-0 relative overflow-hidden group-hover:border-sky-500/50 transition-colors">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_USER_PROFILE.name}&backgroundColor=1e293b`} alt="User" className="w-full h-full object-cover" />
            <div className="absolute -bottom-3 -right-3 bg-sky-500 text-white w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[0_0_10px_rgba(14,165,233,0.5)]">
              <ShieldCheck className="w-4 h-4"/>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{MOCK_USER_PROFILE.name}</h3>
                <p className="text-slate-400 flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-sky-400"/> {MOCK_USER_PROFILE.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Beneficiary ID</p>
                <p className="font-mono font-bold text-sky-300 bg-sky-900/30 px-3 py-1.5 rounded-lg border border-sky-800/50 shadow-inner">{MOCK_USER_PROFILE.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Education</p>
                <p className="font-semibold text-slate-200">{MOCK_USER_PROFILE.education}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Primary Skill</p>
                <p className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 inline-block">{MOCK_USER_PROFILE.skills[0].name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Preference</p>
                <p className="font-semibold text-slate-200">{MOCK_USER_PROFILE.employmentPreference}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Language</p>
                <p className="font-semibold text-slate-200">{MOCK_USER_PROFILE.language}</p>
              </div>
            </div>
          </div>

          {/* Holographic QR Code Mock */}
          <div className="w-full md:w-auto flex flex-col items-center justify-center p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-24 h-24 bg-white p-1.5 rounded-lg flex flex-wrap gap-0.5 relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {Array.from({length: 36}).map((_, i) => (
                <div key={i} className={`w-[15%] h-[15%] ${Math.random() > 0.4 ? 'bg-slate-900 rounded-[1px]' : 'bg-transparent'}`}></div>
              ))}
            </div>
            <p className="text-[10px] text-sky-400 font-mono mt-3 uppercase font-bold tracking-widest relative z-10">Scan to Verify</p>
          </div>

        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: 0.2}} className="glass-panel p-6 rounded-3xl group hover:border-sky-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Award className="text-sky-400 w-6 h-6"/> Skill Mastery
            </h2>
            <TrendingUp className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <div className="space-y-5">
            {MOCK_USER_PROFILE.skills.map((skill, index) => (
              <div key={skill.name} className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-200">{skill.name}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    skill.level === 'Intermediate' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {skill.level}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 border border-slate-700/50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: skill.level === 'Intermediate' ? '65%' : '35%' }}
                    transition={{ duration: 1, delay: 0.3 + (index * 0.2) }}
                    className={`h-full rounded-full relative overflow-hidden ${
                      skill.level === 'Intermediate' ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' : 'bg-gradient-to-r from-sky-500 to-sky-400'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full transform -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay: 0.3}} className="glass-panel p-6 rounded-3xl group hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Briefcase className="text-emerald-400 w-6 h-6"/> Active Pathway
            </h2>
            <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> In Progress
            </div>
          </div>
          
          <div className="p-6 bg-slate-800/60 border border-slate-700/80 rounded-2xl relative overflow-hidden group-hover:bg-slate-800/80 transition-colors">
            {/* Decorative progress line */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
            
            <h3 className="font-extrabold text-white text-xl mb-2">{MOCK_NSQF_TRAINING[0].title}</h3>
            <p className="text-sm text-slate-400 mb-6 flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-emerald-500/70" /> {MOCK_NSQF_TRAINING[0].provider}
            </p>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Completion</p>
                <p className="text-2xl font-bold text-emerald-400">45%</p>
              </div>
              <button className="text-sm font-bold text-white bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 border border-slate-600/50 group-hover:border-emerald-500/30">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress Bar inside pathway */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4">
              <motion.div initial={{width:0}} animate={{width:'45%'}} transition={{duration:1.5, delay:0.5}} className="bg-emerald-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
}
