from typing import List, Dict, Any

# Mock NSQF Reference Dataset
NSQF_TRAINING_DB = [
    {
        "id": "TR-01",
        "title": "Assistant Electrician",
        "nsqf_level": 3,
        "sector": "Power",
        "duration_hours": 400,
        "covers_skills": ["Basic Wiring", "Advanced Wiring", "Electrical Safety", "Testing", "Troubleshooting", "Equipment Handling"],
        "eligibility_education": ["10th", "12th", "ITI"],
        "locations": ["Bhopal", "Indore"]
    },
    {
        "id": "TR-02",
        "title": "Self Employed Tailor",
        "nsqf_level": 4,
        "sector": "Apparel",
        "duration_hours": 340,
        "covers_skills": ["Measurement taking", "Cutting", "Basic Stitching", "Advanced Stitching", "Pattern Making"],
        "eligibility_education": ["8th", "10th"],
        "locations": ["Bhopal"]
    }
]

def recommend_training(missing_skills: List[str], education: str, location: str) -> List[Dict[str, Any]]:
    """
    Recommends NSQF aligned training based on missing skills, user education, and location.
    """
    recommendations = []

    for training in NSQF_TRAINING_DB:
        # Check eligibility (simplified for MVP)
        edu_match = True
        if education and education not in training["eligibility_education"]:
            edu_match = False # Strict matching disabled for demo, but kept for logical completeness
            
        # Calculate how many missing skills this training covers
        covered = [skill for skill in missing_skills if skill in training["covers_skills"]]
        
        if len(covered) > 0:
            match_score = int((len(covered) / len(missing_skills)) * 100) if missing_skills else 100
            
            # Boost score if location matches
            if location and any(loc.lower() in location.lower() for loc in training["locations"]):
                match_score = min(100, match_score + 15)

            recommendations.append({
                "training_id": training["id"],
                "title": training["title"],
                "nsqf_level": training["nsqf_level"],
                "matchScore": match_score,
                "skillsCovered": covered,
                "reason": f"Covers {len(covered)} of your missing skills. Aligned with NSQF Level {training['nsqf_level']}."
            })
            
    # Sort by highest match score
    recommendations.sort(key=lambda x: x["matchScore"], reverse=True)
    return recommendations
