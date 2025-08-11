Please implement a signup/login modal using best practices, and maintain the splash page style where possible. Do your best to keep styles abstracted, reusable, and readable.

Deliverables:

- Clicking the SignupButton shows the modal
- Modal includes standard email/password inputs and "Sign Up" button
- Modal has an industry standard toggle between login/signup
- Include small text "Log in" below the SignupButton that opens the modal in Sign In mode
- Clicking "Sign Up" or "Log In" in the modal will later send an API call, for now set up the scaffolding for an API layer based on browser fetch.

Edit 1:
There are a few problems with the implementation in the current unstaged git files, please update the following:

- Login link should be directly below the signup button on the splash page, e.g. above "Track up to 5 keywords"
- Login link opens the modal in the signup state, it should open directly to login
- Modal animation is too slow, make it about twice as fast.

Edit 2:
Please go through and clean up the code as much as possible, withough affecting any functionality or UI. For example, comments like {/_ Auth Modal _/}<AuthModal ... /> are not useful to humans or AI. Where possible, simplify tailwind usage or extract common themes and styles. Take your time and pay attention to best practices!
