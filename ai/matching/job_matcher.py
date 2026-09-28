from typing import List, Dict, Any

# Mock Databases for Opportunities
MOCK_JOBS_DB = [
    {
        "id": "JOB-101",
        "title": "Junior Electrician",
        "company": "City Power Solutions",
        "location": "Bhopal Industrial Area",
        "distance_km": 8,
        "salary": "₹12,000 - ₹15,000 / month",
        "required_skills": ["Basic Wiring", "Electrical Safety", "Testing"],
        "required_education": "10th",
        "type": "Wage Employment"
    },
    {
        "id": "JOB-102",
        "title": "Maintenance Assistant",
        "company": "TechPark Facilities",
        "location": "MP Nagar, Bhopal",
        "distance_km": 12,
        "salary": "₹10,000 / month",
        "required_skills": ["Basic Wiring", "Equipment Handling"],
        "required_education": "8th",
        "type": "Wage Employment"
    }
]

MOCK_ENTERPRISE_DB = [
    {
        "id": "ENT-01",
        "title": "Independent Electrical Repair Shop",
        "sector": "Services",
        "required_skills": ["Basic Wiring", "Troubleshooting", "Equipment Handling"],
        "setup_cost": "₹20,000 - ₹50,000",
        "suggested_next_steps": [
            "Complete NSQF Level 3 Certification",
            "Procure basic electrical toolkit",
            "Register as local vendor"
        ],
        "type": "Self Employment"
    }
]

def match_jobs(user_skills: List[str], target_occupation: str, location: str, mobility_km: float) -> List[Dict[str, Any]]:
    matches = []
    
    # Simple semantic normalization for demo
    normalized_skills = [s.lower() for s in user_skills]
    if "electrical" in normalized_skills:
        normalized_skills.append("basic wiring")

    for job in MOCK_JOBS_DB:
        # Distance filter
        if mobility_km and job["distance_km"] > mobility_km:
            continue
            
        covered = [req for req in job["required_skills"] if req.lower() in normalized_skills]
        
        match_score = 50 # Base score for location match
        if len(job["required_skills"]) > 0:
            match_score += int((len(covered) / len(job["required_skills"])) * 50)
            
        matches.append({
            "job": job,
            "matchScore": match_score,
            "missingRequirements": [req for req in job["required_skills"] if req.lower() not in normalized_skills]
        })
        
    matches.sort(key=lambda x: x["matchScore"], reverse=True)
    return matches

def match_self_employment(user_skills: List[str], target_occupation: str) -> List[Dict[str, Any]]:
    matches = []
    
    normalized_skills = [s.lower() for s in user_skills]
    if "electrical" in normalized_skills:
        normalized_skills.append("basic wiring")

    for ent in MOCK_ENTERPRISE_DB:
        covered = [req for req in ent["required_skills"] if req.lower() in normalized_skills]
        match_score = 50
        if len(ent["required_skills"]) > 0:
            match_score += int((len(covered) / len(ent["required_skills"])) * 50)
            
        matches.append({
            "enterprise": ent,
            "matchScore": match_score,
            "skillGaps": [req for req in ent["required_skills"] if req.lower() not in normalized_skills]
        })
        
    matches.sort(key=lambda x: x["matchScore"], reverse=True)
    return matches
