# JeevikaAI System Architecture

## Overview
JeevikaAI follows a decoupled architecture, balancing a rich web client with a robust Python backend. It specifically emphasizes an offline-first capability for low-connectivity environments.

## Components

### 1. Frontend Client (React + Vite)
- **Offline PWA**: Service Workers cache assets and IndexedDB stores reference data.
- **Voice Interaction Module**: Utilizes Web Speech API (with fallback logic) to gather inputs.
- **Recommendation Engine (Offline)**: Runs lightweight logic on cached data when offline.

### 2. Backend Server (FastAPI)
- **REST APIs**: Manages profile creation, sync operations, and complex matches.
- **AI/NLP Layer**: Extracts entities and intents from text (transcribed voice) to build a structured profile.
- **Skill & Gap Engine**: Compares User Profile against NSQF Reference DB.

### 3. Database (PostgreSQL)
- **Entities**: Beneficiary, Skill, NSQFQualification, JobOpportunity, EnterpriseOpportunity, Outcome.

## Core Workflows
1. **Voice → Profile**: Voice is transcribed, text is parsed for entities (skills, experience, location), structured into JSON.
2. **Profile → Gap Analysis**: Current skills mapped against required competencies for a target occupation.
3. **Gap → Recommendation**: Missing competencies mapped to NSQF-aligned training and local opportunities.
4. **Offline Sync**: Operations performed offline are stored locally and sent to the backend when connectivity is restored via a Conflict-Free Replicated Data Type (CRDT) or Last-Write-Wins logic.
