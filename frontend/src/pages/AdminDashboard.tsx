import { Users, TrendingUp, MapPin, Briefcase, Building2, UserCheck, PhoneCall, ScrollText, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const skillData = [
  { name: 'Organic Farming', count: 320 },
  { name: 'Dairy Mgt.', count: 185 },
  { name: 'Tractor Mechanic', count: 145 },
  { name: 'Agri-Processing', count: 210 },
  { name: 'Handicrafts', count: 90 },
];

const placementData = [
  { name: 'Self-Employed (Agri)', value: 55 },
  { name: 'Wage Job (Rural)', value: 25 },
  { name: 'NSQF Training', value: 20 },
];

// NEW DATA FOR SIH PITCH
const skillGapData = [
  { name: 'Financial Lit.', deficit: 85, surplus: 10 },
  { name: 'Digital Skills', deficit: 75, surplus: 15 },
  { name: 'Modern Farming', deficit: 60, surplus: 25 },
  { name: 'Marketing', deficit: 90, surplus: 5 },
];

const employmentPrefData = [
  { name: 'Wage Employment', value: 40 },
  { name: 'Self-Employment', value: 50 },
  { name: 'Undecided', value: 10 },
];

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b'];
const PREF_COLORS = ['#3b82f6', '#8b5cf6', '#94a3b8'];

const regionData = [
  { region: 'Bhopal', demand: 95, skills: 'Organic Farming' },
  { region: 'Indore', demand: 82, skills: 'Marketing' },
  { region: 'Gwalior', demand: 45, skills: 'Tractor Mechanic' },
  { region: 'Jabalpur', demand: 65, skills: 'Dairy Mgt.' },
  { region: 'Ujjain', demand: 35, skills: 'Handicrafts' },
  { region: 'Sagar', demand: 78, skills: 'Agri-Processing' },
  { region: 'Rewa', demand: 20, skills: 'Basic IT' },
  { region: 'Satna', demand: 88, skills: 'Financial Lit.' },
  { region: 'Vidisha', demand: 55, skills: 'Organic Farming' },
  { region: 'Sehore', demand: 92, skills: 'Dairy Mgt.' },
];

const getHeatColor = (value: number) => {
  if (value > 80) return 'bg-red-500 text-white border-red-600 shadow-red-200';
  if (value > 60) return 'bg-orange-500 text-white border-orange-600 shadow-orange-200';
  if (value > 40) return 'bg-yellow-400 text-slate-800 border-yellow-500 shadow-yellow-100';
  return 'bg-emerald-400 text-white border-emerald-500 shadow-emerald-100';
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
      {/* MoSJE / PM-AJAY Header */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-700"/> 
            MoSJE PM-AJAY Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">GIA Component: Livelihood Mapping & NSQF Training (SC Communities)</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Live Data</span>
          <span className="text-sm text-slate-500 mt-1">Theme: Agriculture & Rural Dev</span>
        </div>
      </div>

      {/* KPI Cards targeting "Basic Issues" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Beneficiaries Profiled', value: '4,832', sub: '+12% this month', icon: Users, color: 'bg-blue-500' },
          { label: 'NSQF Trainings (Roadmap)', value: '1,245', sub: 'Matched successfully', icon: ScrollText, color: 'bg-emerald-500' },
          { label: 'Post-Training Outcomes', value: '892', sub: 'Jobs & Enterprise', icon: Briefcase, color: 'bg-amber-500' },
          { label: 'Ground Staff Deployed', value: '124', sub: 'Financial Consultants', icon: PhoneCall, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-2">{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-md`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* NEW: Employment Preferences (Pitch Alignment) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-900">Employment Preferences</h2>
            <p className="text-sm text-slate-500">Beneficiary demand: Job vs Business</p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentPrefData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {employmentPrefData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PREF_COLORS[index % PREF_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
            {employmentPrefData.map((entry, index) => (
               <div key={index} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PREF_COLORS[index] }}></div>
                 <span className="text-sm font-medium text-slate-700">{entry.name} ({entry.value}%)</span>
               </div>
            ))}
          </div>
        </div>

        {/* NEW: Skill Gap Analysis (Pitch Alignment) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Critical Skill Gaps</h2>
              <p className="text-sm text-slate-500">Deficits vs Target Occupations</p>
            </div>
            <div className="bg-red-50 p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} width={100} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="deficit" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} name="Skill Deficit (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Rural Skills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Training Demand (Skills)</h2>
            <p className="text-sm text-slate-500">Based on voice interviews mapping</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Outcomes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-900">Livelihood Outcomes</h2>
            <p className="text-sm text-slate-500">Tracking transition from training to livelihood</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {placementData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* NEW: Regional Demand Heatmap */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500"/> Regional Skill Deficit Heatmap</h2>
            <p className="text-sm text-slate-500">Real-time mapping of areas requiring immediate training intervention</p>
          </div>
          <div className="flex gap-2 text-xs font-bold text-slate-500 uppercase">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critical</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> Normal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {regionData.map((region, i) => (
            <div key={i} className={`p-4 rounded-2xl shadow-sm border-b-4 flex flex-col justify-between h-32 transition-transform hover:scale-105 cursor-pointer ${getHeatColor(region.demand)}`}>
              <div>
                <p className="font-extrabold text-lg opacity-90">{region.region}</p>
                <p className="text-xs font-medium opacity-80 mt-1 flex items-center gap-1">Top Need: {region.skills}</p>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold opacity-80">Deficit</span>
                <span className="text-2xl font-black">{region.demand}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Beneficiary Roadmaps</h2>
            <p className="text-sm text-slate-500 mt-1">Tracking from perspective plan to execution</p>
          </div>
          <button className="text-emerald-700 text-sm font-bold bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
            View All Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Beneficiary</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Skill Gap</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status / Roadmap</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Ramesh Kumar', loc: 'Village Palpur (MP)', skill: 'Organic Farming', status: 'NSQF Enrolled', color: 'bg-amber-100 text-amber-700' },
                { name: 'Sunita Devi', loc: 'Village Kheri (UP)', skill: 'Agri-Processing', status: 'Self-Employed', color: 'bg-emerald-100 text-emerald-700' },
                { name: 'Mohan Lal', loc: 'Village Palpur (MP)', skill: 'Tractor Mechanic', status: 'Wage Job Placed', color: 'bg-blue-100 text-blue-700' },
                { name: 'Anita B.', loc: 'Village Jhal (RJ)', skill: 'Dairy Farming', status: 'Skill Gap Pending', color: 'bg-slate-100 text-slate-700' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                      {row.name.charAt(0)}
                    </div>
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.loc}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.skill}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.color}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 font-bold text-sm hover:text-blue-800 flex items-center gap-1">
                      <UserCheck className="w-4 h-4"/> Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
