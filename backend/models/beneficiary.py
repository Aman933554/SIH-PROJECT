from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from db.database import Base

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    location = Column(String)
    language = Column(String)
    education = Column(String)
    current_occupation = Column(String)
    employment_preference = Column(String)
    mobility_km = Column(Float)

    skills = relationship("BeneficiarySkill", back_populates="beneficiary")

class BeneficiarySkill(Base):
    __tablename__ = "beneficiary_skills"

    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"))
    skill_name = Column(String, index=True)
    level = Column(String)
    experience_years = Column(Float)

    beneficiary = relationship("Beneficiary", back_populates="skills")
