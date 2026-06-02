# BAU Auto Evaluation

A Tampermonkey userscript that automatically fills and submits course evaluation forms on the BAU student portal — saves you from clicking through every question manually.

## Demo

<video src="https://github.com/Saraissa00/BAU-Auto-Evaluation/releases/download/v1.0/demo.mp4" controls width="100%"></video>

## One-Click Install

> Requires the [Tampermonkey](https://www.tampermonkey.net/) browser extension (Chrome, Edge, or Firefox).

**[Install Script](https://github.com/Saraissa00/BAU-Auto-Evaluation/raw/refs/heads/main/bau_eval.user.js)**

## How It Works

1. Open any evaluation page on `app2.bau.edu.jo`
2. A popup appears asking: **"What is your rating for this instructor?"**
   - **Always Agree** — selects the first option for every question
   - **Sometimes Agree** — selects the middle option
   - **Never Agree** — selects the last option
3. If no choice is made within 10 seconds, defaults to **Always Agree**
4. The script then automatically:
   - Selects the correct radio button on each question
   - Reads and fills in the CAPTCHA number
   - Submits the form or clicks Next
   - Repeats for every instructor

## Features

- Popup rating choice per instructor with 10-second auto-timeout
- Automatic CAPTCHA detection and fill
- Auto-submit on final page
- Loops across all instructors without manual input
- Clean white UI, RTL Arabic interface

## Requirements

- [Tampermonkey](https://www.tampermonkey.net/) installed in your browser
- Access to `https://app2.bau.edu.jo:7799/eval/*`
