from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from ai.skill_gap.analyzer import analyze_skill_gap

router = APIRouter(
    prefix="/api/skill-gap",
    tags=["skill-gap"]
)

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_occupation: str

@router.post("/analyze")
async def analyze_gap(request: SkillGapRequest):
    try:
        result = analyze_skill_gap(request.current_skills, request.target_occupation)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
