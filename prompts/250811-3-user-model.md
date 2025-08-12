Using best practices, please implement users in the backend/database. Users need to have an email, password, createdAt, updatedAt, email confirmation, and role (User, Admin). Feel free to include anything else that you think makes sense according to the README.md.

Create a typeorm migration, model definition, basic CRUD/Rest endpoints, and integration tests. Please use passport/bcrypt for authentication and authorization, preferably with JWTs, but use your best judgement.

Each step of the way, make sure the environment still works as expected - everything compiles, tests pass, etc. Keep the code clean, minimal, and avoid redundant comments.

Edit 1:

Fix backend build bug (pasted error)

Edit 2:

We don't want to use Postgres enums since they're annoying to update, we can do validation in the app. Please update the existing migration (don't create a new one). Make sure all DB naming is consistent - do not mix snake/camel case, etc. Also, please make the migration names and files a little more terse, and try to simplify naming everywhere you can.

Finally, please help improve the setup instructions and configuration files for running the backend/postgres/migrations in Docker compose. You won't be able to test this, so try your best to make sure the Docker environment is set up correctly and according to best practices.

Edit 3:

When running db:setup I get the following error. I'd like to not have a test database at all - use the same database name in all environments:
│ Error during migration run:
│ error: database "hacker_tracker" does not exist

Edit 4:

Please edit all services to run on 127.0.0.1, instead of 0.0.0.0 or localhost. The frontend is already set up to do this.

Edit 5:

There are currently some test failures when running `pnpm run test:integration`. Most of them seem to be related to authorization, and there are some discrepancies in error text. Make sure you are able to run them successfully in your environment. There also appears to be some supertest related typing issues.

You need to make sure the database is running in your environment. Feel free to create a script that safely and stably starts and/or recreates the database from scratch, so that you can avoid these request timeouts.

You can't run docker in your environment. Postgres is already available in your environment, so your script just needs to make sure that it's running and in a good state.

Edit 6:

Can you help fix the docker environment setup? Now I get `error: password authentication failed for user "postgres"` when I do `pnpm run db:reset`, then `pnpm run test:integration`. Remember, you can't run the docker commands yourself, so please just try to fix the setup as best you can.
