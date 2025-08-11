In the most recent commit, some backend scaffolding was included. There is some setup for docker-compose based development/deployment, but we also need to support running everything locally, without containers.

You have postgres in your environment already, the goal for this task is to make the backend app and migrations work as expected. There should be a straightforward way to reset the database, run all services without docker, and run tests.

Please continue working until you can make everything run as expected in your environment. Let me know if you are missing any critical tools or network access.

Edit 1:
The current unstaged changes contain some fixes for the backend environment. Please update a few things:

- Merge package.json commands with :local suffix. Just maintain one set of commands that operates on the current environment. For example, db:setup:local -> db:setup
- Remove `TEST_` from env in `packages/integration-test/src/setup/database.ts`, the environment should provide values and the packages shouldn't need to distinguish between them itself.

Take a look for similar issues and clean up/simplify the environment where possible. Feel free to reset the database as needed for testing.
