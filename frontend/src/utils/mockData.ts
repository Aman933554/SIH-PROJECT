export const MOCK_USER_PROFILE = {
  id: "BEN-1029",
  name: "Demo Beneficiary",
  age: 28,
  gender: "Male",
  location: "Village Palpur, MP",
  language: "Hindi",
  education: "8th Pass",
  currentOccupation: "Traditional Farming",
  skills: [
    { name: "Basic Agriculture", level: "Intermediate", experienceYears: 5 },
    { name: "Animal Husbandry", level: "Beginner", experienceYears: 2 }
  ],
  interests: ["Organic Farming", "Dairy"],
  employmentPreference: "Self-Employment (Enterprise)",
  mobilityKm: 15
};

export const MOCK_SKILL_GAP = {
  targetOccupation: "Organic Grower",
  matchScore: 70,
  matchedSkills: ["Basic Agriculture", "Soil Preparation"],
  missingSkills: ["Organic Composting", "Pest Management", "Water Conservation", "Organic Certification Basics"]
};

export const MOCK_NSQF_TRAINING = [
  {
    id: "TR-01",
    title: "Organic Grower (AGR/Q1201) - NSQF Level 4",
    duration: "200 Hours",
    provider: "PMKVY Rural Skill Center, Bhopal",
    distance: "12 km",
    matchScore: 92,
    reasons: [
      "Closes missing 'Organic Composting' skill gap",
      "Matches 8th Pass education requirement",
      "Within your 15km mobility limit"
    ]
  }
];

export const MOCK_JOBS = [
  {
    id: "ENT-101",
    title: "Organic Farm Enterprise Setup",
    company: "PM-AJAY Financial Grant Scheme",
    location: "Village Palpur (Local)",
    distance: "0 km",
    salary: "₹50,000 Setup Grant",
    matchScore: 90,
    reasons: [
      "Matches your Self-Employment preference",
      "Requires NSQF Level 4 Certification (Target)",
      "High local demand in Palpur region"
    ]
  },
  {
    id: "JOB-102",
    title: "Assistant Farm Supervisor",
    company: "Green Valley Agro",
    location: "Bhopal Outskirts",
    distance: "18 km",
    salary: "₹14,000 / month",
    matchScore: 82,
    reasons: [
      "Matches your Agriculture background",
      "Wage Employment alternative"
    ]
  }
];

export const MOCK_SCHEMES = [
  {
    id: "SCH-01",
    title: "PM-DAKSH Yojana",
    provider: "Ministry of Social Justice and Empowerment",
    benefit: "100% Free Skill Training with ₹1500/month stipend",
    eligibility: "SC Community, Age 18-45",
    matchScore: 98,
    reasons: [
      "Targeted specifically for SC youth skilling",
      "Matches your age and financial background",
      "Covers the cost of Organic Grower NSQF Certification"
    ]
  },
  {
    id: "SCH-02",
    title: "Stand-Up India Scheme",
    provider: "SIDBI / Local Bank",
    benefit: "Bank Loan from ₹10 Lakh to ₹1 Crore for Greenfield Enterprise",
    eligibility: "SC/ST and/or Women Entrepreneurs",
    matchScore: 88,
    reasons: [
      "Perfect for your 'Self-Employment' goal",
      "Capital to set up the Organic Farm Enterprise",
      "Subsidized interest rates for SC community"
    ]
  }
];
