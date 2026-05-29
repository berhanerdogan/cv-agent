# cv-agent

Generate tailored, ATS-friendly one-page CV PDFs using AI coding agents — via OpenCode commands or a built-in TUI dashboard.

## Pipeline

```
Job posting (URL or text)
        │
        ▼
  Fetch & Parse         ← Playwright (URLs) or direct text
        │
        ▼
  Fit Assessment        ← Score /5, gaps, recommendation
        │
        ▼
  Generate Content      ← Select projects, tailor bullets, weave ATS keywords
        │
        ▼
  Fill Template         ← Replace placeholders in HTML
        │
        ▼
  Export PDF            ← WeasyPrint HTML → PDF
```

## Usage

### Mode A: OpenCode Commands

Run OpenCode from the project root and use the built-in commands:

```
/cvagent https://job.board/viewjob?jk=...
/cvagent [paste full job description]
/cleanout
```

- `/cvagent` — reads your profile, fetches/parses the job posting, scores your fit, generates a tailored one-page CV, saves HTML + PDF to `output/`, and logs the application to `data/applications.json`
- `/cleanout` — removes all generated CVs from the `output/` directory

### Mode B: TUI Dashboard

A simple terminal UI for tracking applications and generating CVs interactively.

**Prerequisite:** [OpenCode](https://opencode.ai) must be installed and available on your `PATH` — the dashboard uses it under the hood to run CV generation in the Agent tab.

```bash
cd dashboard && bun install && cd ..
cd dashboard && bun run src/index.ts
```

- **Dashboard** tab — browse all applications, open links/PDFs, update application status
- **Agent** tab — paste a job URL or description. 

## Quick Start

```bash
# Clone
git clone https://github.com/berhanerdogan/cv-agent.git && cd cv-agent

# Python environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install browser (for fetching job URLs)
playwright install chromium

# TUI dashboard dependencies (optional)
cd dashboard && bun install && cd ..
```

## Customization

| File | What to edit |
|---|---|
| `profile.md` | Your projects, experience, education, certifications, skills, additional writing rules (optional) |
| `templates/CV_Template.html` | Layout, fonts, colors, section order |

## Project Structure

```
cv-agent/
├── AGENTS.md                  Workflow instructions for the AI agent
├── profile.md                 Your data (copy profile.md.template → profile.md)
├── requirements.txt           Python dependencies
├── scripts/
│   └── generate_pdf.py        HTML → PDF converter (WeasyPrint)
├── templates/
│   └── CV_Template.html       One-page CV template
├── data/
│   └── applications.json      Application log
├── output/                    Generated CVs (gitignored)
├── dashboard/                 Terminal UI (Bun/TypeScript)
├── .agents/skills/
│   ├── bowser/                Browser automation (Playwright)
│   └── pdf-reader/            PDF extraction (PyMuPDF)
└── .opencode/commands/
    ├── cvagent.md             /cvagent command definition
    └── cleanout.md            /cleanout command definition
```

## Dependencies

- **Python 3.10+** — weasyprint, playwright
- **Bun** (optional) — for the TUI dashboard

## License

MIT
