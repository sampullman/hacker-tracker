Please implement the following changes to the frontend and e2e-tests:

- Connect the auth modal signup form to the API
- Connect the auth modal login form to the API
- Implement an API layer abstraction that will work well for future features
- Ensure all types that can be shared between frontend/backend live in packages/shared-types
- Update existing e2e Playwright test to test actual signup/login
- Review updates and documentation, and adjust as needed

Edit 1:

The working changes in this branch include updates to enable auth on the frontend, via the splash page auth modal. However, there are some problems:

- The API calls seem to be going to :3000, while the backend is running on port :3001
- On login/signup, the user should be redirected to /track
- The e2e tests should check that the user is redirected to /track
- Everything should be written in an extensible way, assuming the app will become more complex over time
- Imports from packages should not use relative import syntax, for example `'../../../shared-types/src/index.js'` in `packages/frontend/src/services/api.ts` should correctly reference the shared types package. Please make any updates necessary for that to work.
