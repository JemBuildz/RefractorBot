# RefactorBot 🤖 – Agent Society for Code Refactoring

**Track:** Agent Society (Track 3) – Global AI Hackathon with Qwen Cloud

## Overview
RefactorBot is a multi-agent system that autonomously refactors legacy code into modern frameworks. Five specialized AI agents collaborate, negotiate, and resolve conflicts to deliver production-ready code.

## The Agent Society
| Agent | Role |
|-------|------|
| **Parser** | Extracts structure from legacy code (functions, classes, imports). |
| **Architect** | Designs the target framework structure (routes, models, dependencies). |
| **Dev** | Writes the actual code based on the Architect's plan. |
| **QA** | Reviews code for syntax errors, missing imports, and logic flaws. |
| **Reviewer** | Mediates when QA rejects code – provides fix instructions. |

## How It Works
1. User provides legacy code + target framework (e.g., FastAPI).
2. Parser extracts structure → Architect designs plan → Dev writes code.
3. QA reviews → if rejected, Reviewer provides feedback → Dev rewrites.
4. Loop continues until QA approves or max attempts (3) reached.
5. Approved code is saved to `output/` and optionally uploaded to Alibaba OSS.

## Tech Stack
- **Language:** TypeScript (Node.js)
- **AI:** Qwen Plus (via Qwen Cloud API)
- **Cloud:** Alibaba Cloud Function Compute + OSS (optional)

## Setup & Run Locally
```bash
# Install dependencies
npm install

# Add your Qwen API key
cp .env.example .env
# Edit .env with your QWEN_API_KEY

# Run the orchestrator
npm run dev
