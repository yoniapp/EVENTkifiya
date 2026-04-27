import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Terminal, Code2, BookOpen, Key, Shield } from 'lucide-react';

const markdown = `
# Developer Protocol v1.5

## 01. Strategic Integration
Eventix provides a high-fidelity bridge for businesses to leverage cultural assets. Our API is designed for speed, security, and AI-readiness.

---

## 02. Authentication Protocol
Access is secured via **Bearer Token Auth**. Partners must provision a Service Account through our Business Portal.

\`\`\`bash
# Request Header
Authorization: Bearer <BUSINESS_SECRET_KEY>
\`\`\`

> **Note:** For development, use \`PROTOCOL_BETA_2024\` as your simulation key.

---

## 03. Endpoint Atlas

### A. Global Event Stream
Fetches a serialized list of all public events, including metadata for AI processing.

- **Endpoint:** \`GET /api/v1/events\`
- **Parameters:**
  - \`limit\`: Number of records (default 20)
  - \`category\`: Filter by type (Music, Workshop, etc.)

**Example Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "EVT_001",
      "title": "SYNTH WAVE NIGHT",
      "location": "VOID_MAIN",
      "dateTime": "2024-12-01T20:00:00Z"
    }
  ]
}
\`\`\`

### B. Identity Verification
High-security endpoint for real-time ticket validation. Used by physical security systems at venue entry points.

- **Endpoint:** \`POST /api/v1/validate\`
- **Payload:**
\`\`\`json
{
  "ticketId": "TCK_9921_X",
  "signature": "SHA256_BYTES"
}
\`\`\`

---

## 04. AI Integration Guide (Step-by-Step)
How to integrate Eventix data into your proprietary AI models (e.g., Gemini, GPT-4).

### Step 1: Resource Provisioning
Establish a secure connection to the \`/api/v1/events\` stream.

### Step 2: Context Injection
Pass the JSON output directly to your LLM's system prompt or use a Vector Database to index event descriptions.

### Step 3: Predictive Analytics
Use the AI to analyze \`category\` and \`velocity\` trends to forecast demand for your own business services.

\`\`\`javascript
// AI Processing Example
const events = await Eventix.getEvents();
const recommendation = await Gemini.generateContent(\`
  Analyze these events and suggest marketing copy:
  \${JSON.stringify(events)}
\`);
\`\`\`

---

## 05. System Invariants
- **Throughput:** 10,000 requests/day per tier
- **Consistency:** Eventual consistency (3ms latency)
- **Security:** AES-256 Encryption at Rest
`;

export default function Documentation() {
  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20">
        <div className="space-y-6">
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Developer Resources</span>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            Business <br/>Integrations.
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-20">
        <aside className="space-y-12">
          <section className="space-y-8 sticky top-32">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 block">Quick Jump</h2>
            <nav className="space-y-4">
              <a href="#01-strategic-integration" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Overview
              </a>
              <a href="#02-authentication-protocol" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <Key className="w-3.5 h-3.5" /> Authentication
              </a>
              <a href="#03-endpoint-atlas" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <Terminal className="w-3.5 h-3.5" /> Endpoint Atlas
              </a>
              <a href="#04-ai-integration-guide-step-by-step" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent hover:text-ink transition-colors">
                <Code2 className="w-3.5 h-3.5" /> AI Setup
              </a>
              <a href="#05-system-invariants" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <Shield className="w-3.5 h-3.5" /> Protocol Specs
              </a>
            </nav>
          </section>

          <div className="p-8 bg-paper border border-line border-l-4 border-l-ink">
            <p className="text-[10px] font-serif italic text-muted leading-relaxed">
              "The API is the product. The documentation is the user manual."
            </p>
          </div>
        </aside>

        <article className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-code:text-accent prose-code:bg-paper prose-code:p-1 prose-pre:bg-ink prose-pre:text-white prose-pre:rounded-none">
          <div className="markdown-body font-mono text-sm leading-relaxed text-zinc-600">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
