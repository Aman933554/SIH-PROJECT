const API_BASE_URL = 'https://sih-project-backend-4ya2.onrender.com/api';

export const extractProfile = async (text: string, language: string) => {
  const response = await fetch(`${API_BASE_URL}/conversation/extract-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language })
  });
  if (!response.ok) throw new Error('Failed to extract profile');
  return response.json();
};

export const analyzeSkillGap = async (current_skills: string[], target_occupation: string) => {
  const response = await fetch(`${API_BASE_URL}/skill-gap/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_skills, target_occupation })
  });
  if (!response.ok) throw new Error('Failed to analyze skill gap');
  return response.json();
};

export const matchOpportunities = async (
  user_skills: string[],
  target_occupation: string,
  location?: string,
  employment_preference: string = "Wage Employment"
) => {
  const response = await fetch(`${API_BASE_URL}/opportunities/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_skills, 
      target_occupation, 
      location, 
      employment_preference 
    })
  });
  if (!response.ok) throw new Error('Failed to match opportunities');
  return response.json();
};
