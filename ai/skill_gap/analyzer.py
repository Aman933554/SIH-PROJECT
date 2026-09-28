from typing import List, Dict, Any

# Mock Skill Taxonomy Database
TAXONOMY_DB = {
    "Electrician": {
        "required_skills": [
            "Basic Wiring",
            "Advanced Wiring",
            "Electrical Safety",
            "Testing",
            "Troubleshooting",
            "Equipment Handling"
        ]
    },
    "Tailor": {
        "required_skills": [
            "Measurement taking",
            "Cutting",
            "Basic Stitching",
            "Advanced Stitching",
            "Pattern Making",
            "Machine Maintenance"
        ]
    }
}

def analyze_skill_gap(current_skills: List[str], target_occupation: str) -> Dict[str, Any]:
    """
    Compares current user skills against required skills for a target occupation.
    """
    if target_occupation not in TAXONOMY_DB:
        return {
            "error": f"Target occupation '{target_occupation}' not found in taxonomy."
        }
    
    required = TAXONOMY_DB[target_occupation]["required_skills"]
    
    # Simple semantic matching logic for MVP
    matched = []
    missing = []

    # Extremely simple normalization for demo purposes
    normalized_current = [s.lower() for s in current_skills]

    for req_skill in required:
        # Check if the required skill (or a part of it) is in any of the current skills
        req_lower = req_skill.lower()
        if any(req_lower in curr or curr in req_lower for curr in normalized_current) or ("basic" in req_lower and "electrical" in normalized_current):
            # Exception mapping for demo ("basic electrical" matches "Basic Wiring")
            if req_lower == "basic wiring" and "electrical" in normalized_current:
                matched.append(req_skill)
            else:
                matched.append(req_skill)
        else:
            missing.append(req_skill)
            
    # Remove duplicates from matched if any
    matched = list(set(matched))

    score = 0
    if len(required) > 0:
        score = int((len(matched) / len(required)) * 100)

    return {
        "targetOccupation": target_occupation,
        "matchScore": score,
        "matchedSkills": matched,
        "missingSkills": missing
    }
