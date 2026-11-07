# OIBSIP: Oasis Infobyte Summer Internship Program

**Intern:** Rahab Mwanza
**Track:** Web Development & Designing
**Level completed:** Level 2 (all 4 tasks)

This repository holds my task submissions for the Oasis Infobyte Summer Internship Program (OIBSIP). Every project lives in its own folder, named `WebDev-L2-[ProjectName]`, with its source code, a project README and screenshots.

#oasisinfobyte #oasisinfobyteinternship #webdevelopment #internship

---

## Task completion

Web Development & Designing requires completing **all tasks in one chosen level**. I chose **Level 2**, which has 4 tasks, and completed all of them.

| # | Task | Folder | Tech | Live demo | Demo video |
|---|------|--------|------|-----------|------------|
| 1 | Calculator | [`WebDev-L2-Calculator`](./WebDev-L2-Calculator) | HTML5, CSS3, JavaScript | [View](https://mwanzarahab-wq.github.io/OIBSIP/WebDev-L2-Calculator/) | [See posts below](#linkedin-demo-posts) |
| 2 | Tribute Page | [`WebDev-L2-TributePage`](./WebDev-L2-TributePage) | HTML5, CSS3 | [View](https://adalocelacetribute-page.vercel.app/) | [See posts below](#linkedin-demo-posts) |
| 3 | To-Do Web App | [`WebDev-L2-NotesApp`](./WebDev-L2-NotesApp) | HTML5, CSS3, JavaScript | [View](https://vermillion-pegasus-7b7462.netlify.app/) | [See posts below](#linkedin-demo-posts) |
| 4 | Login Authentication System | [`WebDev-L2-LoginAuthSystem`](./WebDev-L2-LoginAuthSystem) | HTML5, CSS3, JavaScript, localStorage | [View](https://glib-nine.vercel.app/register.html) | [See posts below](#linkedin-demo-posts) |

---

## LinkedIn demo posts

Screen-recorded walkthroughs, posted on LinkedIn and tagging Oasis Infobyte:

- [Demo post 1](https://lnkd.in/p/dva5Y93N)
- [Demo post 2](https://lnkd.in/p/drpuRUPp)
- [Demo post 3](https://lnkd.in/p/dM5HZ88r)
- [Demo post 4](https://lnkd.in/p/d6QPVssP)

---

## Project summaries

### 1. Calculator
A browser-based calculator with a CSS Grid button layout.
- Digits 0–9, decimal point, and the four operators (+, −, ×, ÷)
- Equals, Clear (C) and Backspace buttons
- Division-by-zero shows an error message instead of crashing
- Operator chaining without a full reset
- Logic written with variables and conditionals (no `eval()`)
- All buttons wired with event listeners (no inline `onclick`)

### 2. Tribute Page
A responsive tribute page dedicated to a figure I admire.
- Title with a one-line tagline and a prominent royalty-free image
- Original biography written in my own words
- Timeline of key achievements and a distinctly styled quote block
- At least two background colours and two font styles across sections
- Responsive layout for desktop and mobile

### 3. To-Do Web App
A task manager that separates pending and completed work.
- Add tasks; new tasks appear immediately under Pending
- Mark complete (moves to Completed), edit inline, and delete
- Live counters for pending and completed tasks
- Timestamps on tasks and persistence across refreshes with `localStorage`
- Friendly empty-state messages

### 4. Login Authentication System
A front-end authentication flow using `localStorage` (approach A in the task card).
- Registration with password rules (minimum 8 characters, at least 1 number)
- Duplicate username/email check
- Login with a generic error that does not reveal which field was wrong
- Protected dashboard that redirects to login without a session
- Logout that clears the session
- Passwords are hashed, not stored in plain text
- Form validation on both pages

---

## Repository structure

```
OIBSIP/
├── README.md
├── WebDev-L2-Calculator/
├── WebDev-L2-TributePage/
├── WebDev-L2-NotesApp/
└── WebDev-L2-LoginAuthSystem/
```

Each project folder contains its source code, a `README.md` describing the project, and screenshots.

## Run any project locally

These are static front-end projects, so no build step or install is needed.

1. Clone the repo: `git clone https://github.com/mwanzarahab-wq/OIBSIP.git`
2. Open a project folder, for example `WebDev-L2-Calculator`
3. Open `index.html` in your browser

---

## Note on security

The Login Authentication System stores data in the browser's `localStorage`, so it is a learning project and not suitable for protecting real user data. A production system needs a backend, server-side session handling and a proper password hashing library such as bcrypt.

## About me

Computer Science student at the University of Zambia, based in Lusaka.

- 🌐 Portfolio: [fluffy-broccoli-x36o.vercel.app](https://fluffy-broccoli-x36o.vercel.app/)
- 💼 LinkedIn: [Rahab Mwanza](https://www.linkedin.com/in/rahab-juvenalis-mwanza-543311261)
- 📧 Email: mwanza.rahab@cs.unza.zm

## Acknowledgements

Thanks to the Oasis Infobyte team for the structured task list and the opportunity to build and ship real projects. [oasisinfobyte.com](https://www.oasisinfobyte.com)
