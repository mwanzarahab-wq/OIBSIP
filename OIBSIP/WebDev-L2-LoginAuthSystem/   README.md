# Login Authentication System (Web Development, Level 2, Task 4)

A front-end login system for **Mitengo**, a Zambian price comparison app. Built with plain HTML, CSS and JavaScript (Approach A: localStorage).

## Pages
- `register.html` - create an account
- `login.html` - log in
- `dashboard.html` - protected page, only opens with an active session

## Features
- Registration with username or email + password
- Password rules: minimum 8 characters, at least 1 number (live checklist while typing)
- Duplicate username/email check
- Login with one generic error ("Incorrect username/email or password.") so it never reveals which field was wrong
- Dashboard redirects to login if opened directly without a session
- Logout button clears the session and returns to login
- Passwords are never stored in plain text: each one is salted with a random value and hashed with SHA-256 (Web Crypto API)
- Empty-field validation on both forms, show/hide password button
- Responsive layout (works on phone width)
- All events use `addEventListener` (no inline `onclick`)

## How it works
- Accounts are saved in `localStorage` under `mitengo_users` (id, display name, salt, hash, created time)
- The login session is saved in `sessionStorage` under `mitengo_session` and removed on logout (closing the tab also ends it)

## Run it
Open `login.html` in a browser. Web Crypto needs a secure context, so use `localhost`, `file://` in most browsers, or GitHub Pages (https).

## Limitations
This is a front-end learning project. localStorage can be read and edited by anyone using the browser, so this is not real security. A real system needs a backend (Node/Express + bcrypt, or Flask).

## Design
Colours and layout follow the Mitengo app: red header, gold and orange accents, cream patterned background. The Log in / Register switch is styled like folder tabs.

## Submission
Place this folder in the repo as `OIBSIP/WebDev-L2-LoginAuthSystem/`.
