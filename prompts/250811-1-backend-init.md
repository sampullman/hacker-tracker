Now, let's spend some time setting up the backend environment. The goal is to have a separate package to run Typeorm migration, and a separate package for types shared between the frontend, backend, migrations, and any other backend service.

In development mode, type completions should work as expected, and updates to packages dependencies should trigger hot reload in the dev servers.

Please take your time to set up these packages as described, and implement a User model as the initial TypeORM migration. Make sure to include some integration tests, and a clean way to create and reset the Postgres database. The development environment should be isolated where possible, and should take no more than two or three commands from the root package.json to set up from scratch.

Make adjustments to README.md as needed.

Edit 1:
The working changes in this repository contain a basic backend setup with docker-compose for running the database, app, and tests. Please attempt to verify and fix any issues in this setup, and report back immediately if you can't get anything to run due to permissions, firewall, or anything else outside your control.

You shouldn't need to start docker yourself, but can check that it's running properly with:
pgrep -a dockerd || true
docker info
