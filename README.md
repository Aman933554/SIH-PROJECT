# JeevikaAI – AI-Powered Multilingual Voice Livelihood Assistant

## Problem Statement
SC community beneficiaries under the PM-AJAY GIA scheme often lack digital literacy and access to proper guidance for livelihood opportunities. There's a disconnect between their current skills and the required NSQF-aligned training to secure viable jobs or self-employment.

## Solution
JeevikaAI provides an AI-powered, offline-first, voice-guided platform. It conducts a conversational interview to extract a structured livelihood profile, analyzes skill gaps against local opportunities and NSQF qualifications, and recommends a personalized livelihood pathway.

## Features
- **Voice-first Assessment**: Speech-to-text extraction of user profile (Hindi, English, Regional).
- **Skill Gap Analysis**: Compares current skills to target occupation requirements.
- **NSQF Mapping**: Recommends appropriate, verified NSQF training.
- **Local Opportunity Matching**: Recommends nearby jobs and self-employment paths.
- **Offline-First Mode**: PWA support allowing core operations without internet.
- **Admin Dashboard**: Government monitoring of metrics, demand, and placements.

## Architecture
- **Frontend**: React, TypeScript, Tailwind CSS, Vite.
- **Backend**: Python, FastAPI.
- **Database**: PostgreSQL with SQLAlchemy.
- **AI**: NLP services for intent and entity extraction based on a structured skill taxonomy.

## How to Run
*(Instructions to be added once frontend and backend setups are initialized)*

## Demo Credentials
*(To be populated in Demo Phase)*

## Limitations & Future Integrations
- Currently relies on demo data where live government APIs (like NCS) are unavailable.
- Future versions will integrate live WhatsApp & IVR channels.
