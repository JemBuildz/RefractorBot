# 🤖 RefactorBot Society

![Hackathon](https://img.shields.io/badge/Track_3-Agent_Society-blue?style=for-the-badge)
![Cloud](https://img.shields.io/badge/Hosted_on-Alibaba_Cloud-FF6600?style=for-the-badge&logo=alibabacloud&logoColor=white)
![AI](https://img.shields.io/badge/Powered_by-Qwen_Turbo-8B5CF6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**RefactorBot Society** is an autonomous, serverless multi-agent pipeline hosted on Alibaba Cloud Function Compute. Designed to modernize and secure legacy code, it triggers a "society" of specialized AI personas powered by Qwen Large Language Models to architect, write, and aggressively QA code before it ever reaches production.

Built by JemBuildz.

---

## 💡 Inspiration
Legacy code modernization is usually a painful, manual process. While single-prompt LLMs can translate code from one language to another, they frequently hallucinate, introduce security vulnerabilities (like SSRF or CORS misconfigurations), and fail to grasp enterprise architecture. We wanted to build a system that doesn't just translate code, but *engineers* it.

## ⚙️ How The Society Works
When fed legacy monolithic code via the interactive Glassmorphism UI, it triggers a rigorous negotiation loop between five distinct personas:

1. **The Parser:** Dissects the legacy logic and identifies deprecated patterns.
2. **The Architect:** Designs a modern, asynchronous target framework (e.g., FastAPI).
3. **The Developer:** Drafts the initial code based on the Architect's blueprint.
4. **The QA Engineer:** A ruthless security and performance reviewer. It actively hunts for resource leaks, unhandled exceptions, and architectural flaws, rejecting the code until it meets enterprise standards.
5. **The Senior Reviewer:** Mediates any QA rejections and provides actionable fix instructions back to the Developer.

Code is only output to the user once it survives this loop and passes the QA Engineer's strict approval.

---

## 🗺️ Architecture Flow

```mermaid
graph TD
    %% Styling
    classDef user fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff;
    classDef cloud fill:#f97316,stroke:#c2410c,stroke-width:2px,color:#fff;
    classDef agent fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef qwen fill:#8b5cf6,stroke:#5b21b6,stroke-width:2px,color:#fff;

    %% Nodes
    A[User Frontend UI]:::user -->|POST /refactor| B(Alibaba Function Compute)
    
    subgraph Serverless Backend [Alibaba Cloud Custom Runtime]
        B:::cloud --> C{Orchestrator Loop}
        
        C --> D[Parser Agent]:::agent
        C --> E[Architect Agent]:::agent
        
        %% Negotiation Loop
        subgraph Agent Negotiation Loop
            F[Developer Agent]:::agent --> G{QA Engineer}:::agent
            G -- Rejects Code --> H[Senior Reviewer]:::agent
            H -- Fix Instructions --> F
        end
        
        E --> F
        G -- Approves Code --> I[Final Code Output]
    end

    %% API Calls
    D -.->|API Call| Q[Qwen Cloud API]:::qwen
    E -.->|API Call| Q
    F -.->|API Call| Q
    G -.->|API Call| Q
    H -.->|API Call| Q

    I -->|JSON Response| A
