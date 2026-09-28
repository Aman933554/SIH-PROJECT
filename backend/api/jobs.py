from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from ai.matching.job_matcher import match_jobs, match_self_employment

router = APIRouter(
    prefix="/api/opportunities",
    tags=["opportunities"]
)

class MatchRequest(BaseModel):
    user_skills: List[str]
    target_occupation: str
    location: Optional[str] = None
    mobility_km: Optional[float] = None
    employment_preference: Optional[str] = "Wage Employment"

@router.post("/match")
async def get_opportunity_matches(request: MatchRequest):
    try:
        results = {}
        if request.employment_preference == "Wage Employment":
            results["jobs"] = match_jobs(
                user_skills=request.user_skills,
                target_occupation=request.target_occupation,
                location=request.location,
                mobility_km=request.mobility_km
            )
        elif request.employment_preference == "Self Employment":
            results["enterprises"] = match_self_employment(
                user_skills=request.user_skills,
                target_occupation=request.target_occupation
            )
        else:
            # Return both if preference is broad or missing
            results["jobs"] = match_jobs(
                user_skills=request.user_skills,
                target_occupation=request.target_occupation,
                location=request.location,
                mobility_km=request.mobility_km
            )
            results["enterprises"] = match_self_employment(
                user_skills=request.user_skills,
                target_occupation=request.target_occupation
            )
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
