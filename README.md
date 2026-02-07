# Versa Arch AI - The Real-Time System Teacher 🧠✨

> **Built for the Gemini 3 Global Hackathon: Transitioning from Static Chat to Autonomous Agentic Orchestration.**

[![Versa Arch AI](https://via.placeholder.com/1200x600?text=Versa+Arch+AI+Dashboard)](http://localhost:3000)

**VersaArch AI** is a multi-agent reasoning engine designed to decompose, visualize, and teach complex systems at the speed of thought. By leveraging **Gemini 3 Pro** (Adaptive Reasoning) and **Gemini 3 Flash** (High-Speed Fallback), we've built more than a chatbot; we've built a **Real-Time Teacher** that senses user intent, dissects external sources (Videos/Books), and orchestrates a network of 7 autonomous agents to create a high-fidelity, adaptive learning environment.

---

## 🏛️ System Architecture

VersaArch AI operates on a **Multimodal Agentic Loop** powered by Gemini 3 and LangGraph. It is designed to model "Cause and Effect" in complex architectures rather than just retrieving text.

```mermaid
graph TD
    User([Learner Input]) --> A[Agent A: Intent Classifier]
    
    A -- DISSECT --> D_Util[Dissection Utility]
    D_Util --> YT[YouTube Transcript]
    D_Util --> BK[Book Content]
    
    A -- FLOW --> B[Agent B: Visualizer]
    A -- CONTEXT --> E[Agent E: Knowledge RAG]
    A -- PLAN --> D[Agent D: Scaffolder]
    
    E & D & YT & BK --> C[Agent C: Personalization]
    B --> F[Agent F: Evaluator]
    C --> F
    
    F --> G[Agent G: Feedback Engine]
    G --> UI[/Dynamic ReactFlow Dashboard/]
    
    subgraph "The Orchestration Layer"
    B
    E
    D
    C
    F
    end
```

---

## 🚀 Strategic Features (Action Era Ready)

### 1. **Autonomous Dissection Engine** (Multimodal Reasoning)
*   **Video Dissection**: Paste a YouTube link. The system extracts transcripts and senses the temporal flow of information to generate a logic-accurate system diagram.
*   **Book Dissection**: Deep-dives into specific literature, extracting "First Principles" rather than generic summaries.
*   **Contextual Priority**: Uses Gemini 3's high-context window to prioritize provided source material over generic knowledge bases.

### 2. **7-Agent Orchestrator** (High-Fidelity Granular Streaming)
Our architecture utilizes specialized agents for complex reasoning tasks, executing in parallel for sub-second hydration:
*   **Agent A (Intent)**: Senses learner needs (Visualize vs. Evaluate).
*   **Agent B (Visualizer)**: Generates valid React Flow JSON for architectural mapping.
*   **Agent C-E (Cognitive Cluster)**: Handles Personalization (Vibes), Scaffolding (Prerequisites), and Knowledge Retrieval.
*   **Agent H (Content Swarm)**: A swarm of 8 sub-agents for granular content generation:
    *   **H1 (Analogy)**: "City Traffic" vs "Water Pipes" metaphors.
    *   **H2 (Flashcards)**: Active recall decks.
    *   **H3 (Cheat Sheet)**: Markdown-rich summaries.
    *   **H4 (Resources)**: Curated external links/books.
    *   **H5 (Pareto Digest)**: 80/20 Principle analysis.
    *   **H6 (Quiz Generator)**: Scenario-based micro-assessments.
    *   **H7 (Infographics)**: "Nano Banana" generative visuals powered by **Google Cloud Vertex AI (Imagen 4)** with semantic fallback.
    *   **H8 (Mnemonics)**: Creative memory aids and acronyms.

### 3. **The Real-Time Teacher Flow**
*   **Interactive System Diagrams**: Dynamic, draggable visualizations of concepts.
*   **Nano Banana Infographics**: AI-generated visual summaries (beta).
*   **Persistent Memory System**: Short and long-term context tracking via `memory_manager`.
*   **Modular Skills**: Decoupled capabilities like image generation and memory access.
*   **Study Tools**: Integrated flashcards, quizzes, and mnemonics that update in real-time.

---

## 🛠️ Tech Stack & Integration

| Component | Technology | Role |
| :--- | :--- | :--- |
| **LLM Backend** | Gemini 3 Pro & Flash | Primary reasoning with robust fallback and mock support. |
| **Orchestration** | LangGraph.js | Stateful, multi-actor agent management |
| **Frontend** | Next.js 14 (App Router) | SSR Stability & specialized routing hooks |
| **Visuals** | React Flow & Vertex AI Imagen | Interactive architecture graphing & Generative Infographics |
| **Styling** | Tailwind CSS + Framer Motion | Premium glassmorphic "Vibe Engineering" |
| **State** | Zustand | Real-time UI theme and state synchronization |

---

## ❓ FAQ & Troubleshooting (VersaArchAI)

### **General Questions**
**Q: How is this different from a normal RAG chatbot?**
A: Most RAG bots just retrieve text. VersaArch AI **orchestrates agents** to redraw diagrams, build prerequisite trees, and create scenario-based quizzing environments. It reasons over the *structure* of data, not just the keywords.

**Q: Can I use it for non-technical topics?**
A: While optimized for "Systems Thinking" (Coding, Cloud, Engineering), the engine can dissect any logical structure, including history timelines or biological processes.

### **Dissection Features**
**Q: Does it actually watch the video?**
A: In the current Beta, it utilizes Gemini 3's ability to reason over long-form transcripts and metadata to understand cause-and-effect within the video duration.

**Q: How do I trigger Book dissection?**
A: Simply type `Book: [Title] [Topic]` or `Analyze this book: [Title]`. The Intent Agent (Agent A) will automatically route to the Dissection Engine.

### **Common Issues**
**Q: My GUI isn't updating after a change?**
A: Because of our heavy use of Next.js 14 static optimization, a **Hard Refresh (Ctrl+F5)** is recommended to sync the browser with the latest agentic build.

**Q: "Address already in use" or Project stuck loading?**
A: This usually means a previous Node process is stuck.
1.  Open Terminal.
2.  Run: `taskkill /F /IM node.exe` (Windows) or `pkill -f node` (Mac/Linux).
3.  Restart: `npm run dev`.

### **Testing**
**Q: How do I run the test suite?**
A: We use **Vitest**. Run `npm run test` (or `npx vitest run src/tests`) to execute the full suite. All tests are consolidated in the `src/tests` directory.

---

## 📦 Quick Start

1.  **API Keys**: Add `GEMINI_API_KEY` to `.env.local`.
2.  **Install**: `npm install`
3.  **Launch**: `npm run dev`
4.  **Try this**: Paste `https://youtu.be/kOa_llowQ1E` into the playground.

---

> **Note**: This project is built as a submission for the Gemini 3 Global Hackathon. It focuses on the **Real-Time Teacher** and **Vibe Engineering** tracks by integrating autonomous testing loops and immersive UI.
