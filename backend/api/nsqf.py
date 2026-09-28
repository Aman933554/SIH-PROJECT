from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from ai.nsqf.recommender import recommend_training

router = APIRouter(
    prefix="/api/nsqf",
    tags=["nsqf"]
)

class TrainingRequest(BaseModel):
    missing_skills: List[str]
    education: Optional[str] = None
    location: Optional[str] = None

@router.post("/recommend")
async def get_training_recommendations(request: TrainingRequest):
    try:
        recommendations = recommend_training(
            missing_skills=request.missing_skills,
            education=request.education,
            location=request.location
        )
        return {"success": True, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
