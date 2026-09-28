from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from models.beneficiary import Beneficiary, BeneficiarySkill
from schemas.beneficiary import BeneficiaryCreate, BeneficiaryResponse

router = APIRouter(
    prefix="/api/beneficiaries",
    tags=["beneficiaries"]
)

@router.post("/", response_model=BeneficiaryResponse)
def create_beneficiary(beneficiary: BeneficiaryCreate, db: Session = Depends(get_db)):
    db_beneficiary = Beneficiary(
        name=beneficiary.name,
        age=beneficiary.age,
        gender=beneficiary.gender,
        location=beneficiary.location,
        language=beneficiary.language,
        education=beneficiary.education,
        current_occupation=beneficiary.current_occupation,
        employment_preference=beneficiary.employment_preference,
        mobility_km=beneficiary.mobility_km
    )
    db.add(db_beneficiary)
    db.commit()
    db.refresh(db_beneficiary)

    for skill in beneficiary.skills:
        db_skill = BeneficiarySkill(
            beneficiary_id=db_beneficiary.id,
            skill_name=skill.skill_name,
            level=skill.level,
            experience_years=skill.experience_years
        )
        db.add(db_skill)
    
    db.commit()
    db.refresh(db_beneficiary)
    
    return db_beneficiary

@router.get("/", response_model=List[BeneficiaryResponse])
def get_beneficiaries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Beneficiary).offset(skip).limit(limit).all()

@router.get("/{beneficiary_id}", response_model=BeneficiaryResponse)
def get_beneficiary(beneficiary_id: int, db: Session = Depends(get_db)):
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return beneficiary
