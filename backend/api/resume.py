from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from db.database import get_db
from models.beneficiary import Beneficiary

router = APIRouter(
    prefix="/api/resume",
    tags=["resume"]
)

@router.get("/{beneficiary_id}", response_model=Dict[str, Any])
def generate_resume(beneficiary_id: int, db: Session = Depends(get_db)):
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    
    # Compile the core details into a structured dictionary suitable for rendering.
    resume_data = {
        "personal_info": {
            "name": beneficiary.name,
            "age": beneficiary.age,
            "gender": beneficiary.gender,
            "location": beneficiary.location,
            "language": beneficiary.language,
        },
        "professional_summary": f"Experienced professional in {beneficiary.current_occupation} with a strong desire for {beneficiary.employment_preference}.",
        "education": beneficiary.education,
        "skills": [
            {
                "name": skill.skill_name,
                "level": skill.level,
                "experience_years": skill.experience_years
            }
            for skill in beneficiary.skills
        ],
        "career_objective": "To secure a position or self-employment opportunity that utilizes my skills and contributes to the local community's development."
    }
    
    return resume_data
