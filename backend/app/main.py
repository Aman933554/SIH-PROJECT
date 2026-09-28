from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import beneficiary, auth, conversation, skill_gap, nsqf, jobs, resume, interview

app = FastAPI(
    title="JeevikaAI API",
    description="AI-Powered Multilingual Voice Livelihood Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to JeevikaAI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(beneficiary.router)
app.include_router(auth.router)
app.include_router(conversation.router)
app.include_router(skill_gap.router)
app.include_router(nsqf.router)
app.include_router(jobs.router)
app.include_router(resume.router)
app.include_router(interview.router)
