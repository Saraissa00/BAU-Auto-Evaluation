# BAU Auto Evaluation

A Tampermonkey userscript that automatically fills and submits course evaluation forms on the BAU student portal — saves you from clicking through every question manually.

## About

BAU's course evaluation portal requires clicking through a full survey, per instructor, every semester — with a CAPTCHA on each submission and no way to speed it up manually. This userscript turns that multi-step, per-instructor chore into a single click: it detects any number of questions on the page, picks your chosen rating strategy, solves the CAPTCHA, and loops through every instructor unattended.

## Demo

https://github.com/user-attachments/assets/591caafd-104f-4ede-864b-0db911dd1ee7

## One-Click Install

> Requires the [Tampermonkey](https://www.tampermonkey.net/) browser extension (Chrome, Edge, or Firefox).

**[Install Script](https://github.com/Saraissa00/BAU-Auto-Evaluation/raw/refs/heads/main/code/bau_eval.user.js)**

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
