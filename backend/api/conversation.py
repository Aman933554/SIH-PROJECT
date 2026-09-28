from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

# Add root to python path to import the ai module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from ai.nlp.extractor import get_extractor

router = APIRouter(
    prefix="/api/conversation",
    tags=["conversation"]
)

class ConversationInput(BaseModel):
    text: str
    language: str

@router.post("/extract-profile")
async def extract_profile_from_text(input_data: ConversationInput):
    extractor = get_extractor()
    try:
        profile = extractor.extract_profile(input_data.text)
        return {"success": True, "profile": profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
