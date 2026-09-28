import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Download, Briefcase, GraduationCap, User, MapPin, Languages } from 'lucide-react';

const RESUME_TRANSLATIONS: Record<string, any> = {
  en: {
    back: "Back",
    print: "Print",
    pdf: "PDF",
    language: "Language",
    careerObj: "Career Objective",
    profSum: "Professional Summary",
    edu: "Education & Training",
    skills: "Skills & Competencies",
    level: "Level",
    exp: "Years Experience",
    // Data translation mocks
    data: {
      location: "Bhopal, MP",
      gender: "Male",
      profSumTxt: "Experienced professional in Carpentry with a strong desire for full-time employment.",
      eduTxt: "8th Pass",
      careerObjTxt: "To secure a position or self-employment opportunity that utilizes my skills and contributes to the local community's development.",
      skillsMap: {
        "Woodworking": "Woodworking",
        "Furniture Design": "Furniture Design",
        "Measuring & Cutting": "Measuring & Cutting",
        "Expert": "Expert",
        "Intermediate": "Intermediate"
      }
    }
  },
  hi: {
    back: "वापस",
    print: "प्रिंट",
    pdf: "पीडीएफ",
    language: "भाषा",
    careerObj: "कैरियर का उद्देश्य",
    profSum: "व्यावसायिक सारांश",
    edu: "शिक्षा और प्रशिक्षण",
    skills: "कौशल और क्षमताएं",
    level: "स्तर",
    exp: "साल का अनुभव",
    data: {
      location: "भोपाल, म.प्र.",
      gender: "पुरुष",
      profSumTxt: "बढ़ईगिरी (Carpentry) में अनुभवी, पूर्णकालिक रोजगार की तलाश में।",
      eduTxt: "8वीं पास",
      careerObjTxt: "मैं अपने हुनर का इस्तेमाल करके एक अच्छी नौकरी या स्वरोजगार पाना चाहता हूँ।",
      skillsMap: {
        "Woodworking": "लकड़ी का काम",
        "Furniture Design": "फर्नीचर डिजाइन",
        "Measuring & Cutting": "माप और कटाई",
        "Expert": "विशेषज्ञ",
        "Intermediate": "मध्यम"
      }
    }
  },
  bho: {
    back: "पीछे",
    print: "छापीं (Print)",
    pdf: "पीडीएफ",
    language: "भाषा",
    careerObj: "करियर के उद्देश्य",
    profSum: "काम के जानकारी",
    edu: "पढ़ाई अउर ट्रेनिंग",
    skills: "हुनर अउर क्षमता",
    level: "लेवल",
    exp: "साल के अनुभव",
    data: {
      location: "भोपाल, म.प्र.",
      gender: "मरद",
      profSumTxt: "बढ़ई (बढ़ईगिरी) के काम में बहुत अनुभव बा, नीक नौकरी के तलाश बा।",
      eduTxt: "8वीं पास",
      careerObjTxt: "हमरा अईसन काम चाहीं जवना से हमार हुनर के सही इस्तमाल होखे अउर परिवार के तरक्की होखे।",
      skillsMap: {
        "Woodworking": "लकड़ी के काम",
        "Furniture Design": "फर्नीचर डिजाइन",
        "Measuring & Cutting": "नापी अउर कटाई",
        "Expert": "महारथी",
        "Intermediate": "बीच के"
      }
    }
  }
};

interface ResumeData {
  personal_info: {
    name: string;
    age: number;
    gender: string;
    location: string;
    language: string;
  };
  professional_summary: string;
  education: string;
  skills: Array<{
    name: string;
    level: string;
    experience_years: number;
  }>;
  career_objective: string;
}

export default function ResumeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeLang, setResumeLang] = useState('en');

  const t = RESUME_TRANSLATIONS[resumeLang] || RESUME_TRANSLATIONS['en'];

  useEffect(() => {
    // In a real app, this would be an API call to the backend
    // fetch(`http://localhost:8000/api/resume/${id}`)
    // For demo purposes, we will mock the response if the backend is not running.
    setTimeout(() => {
      setData({
        personal_info: {
          name: "Ramesh Kumar",
          age: 32,
          gender: "Male",
          location: "Bhopal, MP",
          language: "Hindi",
        },
        professional_summary: "Experienced professional in Carpentry with a strong desire for full-time employment.",
        education: "8th Pass",
        skills: [
          { name: "Woodworking", level: "Expert", experience_years: 5 },
          { name: "Furniture Design", level: "Intermediate", experience_years: 2 },
          { name: "Measuring & Cutting", level: "Expert", experience_years: 5 }
        ],
        career_objective: "To secure a position or self-employment opportunity that utilizes my skills and contributes to the local community's development."
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div></div>;
  }

  if (!data) return <div>Failed to load resume data.</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition font-bold">
          <ArrowLeft className="w-5 h-5" /> {t.back}
        </button>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 shadow-sm mr-2">
            <Languages className="w-5 h-5 text-emerald-600" />
            <select 
              value={resumeLang}
              onChange={(e) => setResumeLang(e.target.value)}
              className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="en">English CV</option>
              <option value="hi">हिंदी (Hindi CV)</option>
              <option value="bho">भोजपुरी (Bhojpuri CV)</option>
            </select>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition shadow">
            <Printer className="w-5 h-5" /> {t.print}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
            <Download className="w-5 h-5" /> {t.pdf}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl min-h-[1056px] print:shadow-none print:min-h-0">
        {/* Header Section */}
        <div className="bg-emerald-900 text-white p-10 print:bg-emerald-900 print:text-black print:!text-white">
          <h1 className="text-5xl font-bold mb-4">{data.personal_info.name}</h1>
          <div className="flex flex-wrap gap-6 text-emerald-100 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> {t.data.location}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" /> {t.data.gender}, {data.personal_info.age} Yrs
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{t.language}:</span> {data.personal_info.language}
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-10 space-y-8 font-['Mukta']">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 border-b-2 border-emerald-200 pb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-700" /> {t.careerObj}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">{t.data.careerObjTxt}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 border-b-2 border-emerald-200 pb-2 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-700" /> {t.profSum}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">{t.data.profSumTxt}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-emerald-200 pb-2 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-700" /> {t.edu}
            </h2>
            <ul className="list-disc list-inside text-slate-600 text-lg space-y-2 font-bold">
              <li>{t.data.eduTxt}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-emerald-200 pb-2 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-700" /> {t.skills}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-800 text-lg">{t.data.skillsMap[skill.name] || skill.name}</div>
                  <div className="text-slate-500 text-sm mt-1">{t.data.skillsMap[skill.level] || skill.level} {t.level} • {skill.experience_years} {t.exp}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
