from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
import random

router = APIRouter(
    prefix="/api/interview",
    tags=["interview"]
)

class InterviewContext(BaseModel):
    job_title: str
    skills: List[str]

class AnswerSubmission(BaseModel):
    question_id: int
    answer: str

# Mocked questions database (In a real app, this would use LLM)
MOCK_QUESTIONS = {
    "Carpenter": [
        "What kind of wood have you worked with mostly?",
        "Can you explain how you ensure a perfect 90-degree angle?",
        "What safety gear do you use when operating power tools?"
    ],
    "Electrician": [
        "How do you test if a circuit is live safely?",
        "What is the difference between a parallel and series circuit?",
        "How do you handle a short circuit situation?"
    ]
}

@router.post("/start", response_model=Dict[str, Any])
def start_interview(context: InterviewContext):
    # Select job-specific questions or fall back to general ones
    questions_list = MOCK_QUESTIONS.get(context.job_title, [
        "Tell me about your previous work experience.",
        "What do you consider your greatest skill?",
        "Why are you interested in this role?"
    ])
    
    return {
        "status": "started",
        "job_title": context.job_title,
        "questions": [
            {"id": idx, "text": q} for idx, q in enumerate(questions_list)
        ]
    }

@router.post("/evaluate", response_model=Dict[str, Any])
def evaluate_answer(submission: AnswerSubmission):
    # Simple mock evaluation
    word_count = len(submission.answer.split())
    feedback = "Good answer." if word_count > 5 else "Please provide more details."
    score = min(100, word_count * 10)
    
    return {
        "question_id": submission.question_id,
        "score": score,
        "feedback": feedback
    }
