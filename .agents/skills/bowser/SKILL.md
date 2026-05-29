---
name: bowser
description: Headless browser automation using Python Playwright. Use when you need headless browsing, parallel browser sessions, UI testing, screenshots, web scraping, or browser automation that can run in the background. Keywords - playwright, headless, browser, test, screenshot, scrape, parallel.
allowed-tools: Bash
---

# Bowser (Python Playwright)

## Purpose

Automate browsers using Python's `playwright` package. No Node.js needed — everything is Python-only.

## Key Details

- **Headless by default** — set `headless=False` in `launch()` to see the browser
- **Session isolation** — each script creates its own browser context
- **Token-efficient** — write ephemeral Python scripts, run them, discard them
- **Screenshots** saved to `/tmp/` and read back via the `read` tool

## Core Pattern

Write a Python script to `/tmp/bowser_<task>.py` and run it with the project venv:

```bash
source venv/bin/activate
python3 /tmp/bowser_<task>.py
```

Every script follows this structure:

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        viewport={'width': 1440, 'height': 900}
    )
    page = context.new_page()
    page.goto('https://example.com', wait_until='domcontentloaded', timeout=20000)
    page.wait_for_timeout(3000)

    # --- do stuff ---
    result = page.evaluate('() => document.body.innerText')
    print(result)

    browser.close()
```

Output goes to stdout (use `print` / `json.dumps`). Screenshots go to `/tmp/`.

## Common Operations

| Goal | Code |
|---|---|
| Navigate to URL | `page.goto(url, wait_until='domcontentloaded')` |
| Get page title | `page.title()` |
| Get all visible text | `page.evaluate('() => document.body.innerText')` |
| Get structured data | `page.evaluate('() => ({ title: document.title, body: document.body.innerText })')` |
| Click element | `page.click('button#submit')` or `page.click('text=Apply Now')` |
| Fill input | `page.fill('input#search', 'text')` |
| Press key | `page.press('input#search', 'Enter')` |
| Wait for element | `page.wait_for_selector('.job-description')` |
| Take screenshot | `page.screenshot(path='/tmp/shot.png', full_page=True)` |
| Close browser | `browser.close()` |

## URL Fetching Template (for CV Agent)

When the CV agent needs to fetch a job posting from a URL:

```python
import json
from playwright.sync_api import sync_playwright

url = '<JOB_URL>'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        viewport={'width': 1440, 'height': 900}
    )
    page = context.new_page()
    page.goto(url, wait_until='domcontentloaded', timeout=20000)
    page.wait_for_timeout(3000)

    data = page.evaluate('''() => {
        return {
            title: document.title,
            text: document.body.innerText
        }
    }''')

    print(json.dumps(data))
    browser.close()
```

Run it:

```bash
source venv/bin/activate
python3 /tmp/bowser_fetch_job.py
```

## Python package

The `playwright` package is in `requirements.txt`. After pip install, run once:

```bash
playwright install chromium
```
