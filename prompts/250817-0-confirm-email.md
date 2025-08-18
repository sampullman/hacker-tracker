It's time to implement a feature for confirming the user's email address after signup. There is a backend component, frontend component, and jobs component. A database migration may be necessary.
Task details:
- Implement a third state in the auth modal, besides signup/login, for entering a confirmation code.
- After signup, and after logging in to an account that hasn't confirmed their email, show the auth modal in confirmation code state.
- Implement an unauthorized endpoint for entering an email confirmation code.
- Trigger sending confirmation email in auth registration endpoint.
- Do not send the code during the request, instead create a new job (and job type), and handle the actual confirmation email send in the job. With pg-boss, we can create the job with its initial state in the same transaction as the user registration, to avoid sending mail when registration fails (and guaranteeing it's only sent once).
- In development and CI, there should be a way for tests to either access or generate the confirmation code themselves.
- In production, a real email will be sent. For this task, please stub the implementation.

This is a big task, so please try to take it one step at a time, and if you get stuck do not attempt to work around your issues with non-idiomatic code.

In the future, a similar system may be reused as an alternate login method, e.g. logging in via email code instead of password. Please keep this in mind, so that we can avoid code duplication and unnecessary work.