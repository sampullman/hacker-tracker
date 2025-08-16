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

Edit 2:
Please update the frontend to run on port 3050 in dev, and the backend to 3051. Make sure you adjust all references in .env.example, integration tests, e2e tests, code, README, agents files, etc.

Edit 3:
I'm now getting some errors when running e2e tests, the main one seems to be "TypeError: page.getByLabelText is not a function". Can you fix this, and make sure you're actually getting the playwright tests to pass locally using the documented (non-Docker) steps detailed in the README/agent files? Feel free to reset your environment at any time to develop with a clean slate.

Edit 4:
Based on the instructions for agents, please set up your environment and run the playwright tests. Chromium for playwright should already be installed. You should notice that the e2e tests are failing, if so please iterate on them until they are fixed. The errors may be frontend or backend related. If you cannot replicate the failures, please figure out why and report back. If you notice anything about the environment that isn't documented, please add to the appropriate place - README.md for humans, and CLAUDE.md/AGENTS.md for agents.

Edit 5:
The working changes in this branch are intended to fix issues with Playwright tests. There are several problems:

- Playwright tests still don't pass
- packages/e2e-test/mock-server.cjs is not necessary, please remove it and only use the real backend
- Review environment setup (and reset) procedures to keep them as simple as possible.

Refer to updated CLAUDE.md as needed, note that backend servers may not currently be running, but packages are installed and Playwright is now available in your environment.
