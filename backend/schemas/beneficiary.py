from pydantic import BaseModel
from typing import List, Optional

class SkillBase(BaseModel):
    skill_name: str
    level: str
    experience_years: float

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    beneficiary_id: int

    class Config:
        from_attributes = True

class BeneficiaryBase(BaseModel):
    name: str
    age: int
    gender: str
    location: str
    language: str
    education: str
    current_occupation: str
    employment_preference: str
    mobility_km: float

class BeneficiaryCreate(BeneficiaryBase):
    skills: List[SkillCreate] = []

class BeneficiaryResponse(BeneficiaryBase):
    id: int
    skills: List[SkillResponse] = []

    class Config:
        from_attributes = True
