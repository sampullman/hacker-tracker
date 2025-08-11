# Using Claude Code in a Dev Container

**NEVER run Claude Code or any other assistant directly on your machine.** Normally, it would have the same permissions as your own user, and therefore be able to copy all your files (including secrets) to a remote destination.

**If you have an assistant installed, delete it now, and follow this guide instead.**

This devcontainer includes Claude's standard configuration plus PostgreSQL and PNPM for development work. In the devcontainer, Claude will only have access to the files in your VS Code workspace. Also, there's a firewall that limits which domains it can access to reduce risk of exfiltration.

## Setup

1. Install the Dev Containers extension in VS Code
2. Run "Dev Containers: Reopen in Container"
3. **Verify the bottom-left corner says: "Dev Container: Claude Code Sandbox"**
4. PostgreSQL will automatically start during container initialization
5. Open a terminal and run `claude --dangerously-skip-permissions`

## Additional Tools Available

This devcontainer includes:
- **PNPM**: Package manager (`pnpm` command available)
- **PostgreSQL**: Database server with `hacker_tracker` database pre-created
  - Connect with: `psql -U postgres -d hacker_tracker`
  - No password required (trust authentication for local development)
- **Development utilities**: `htop`, `tree`, `curl`, `wget`, etc.

## Database Usage

PostgreSQL runs locally in the container. To use it:

```bash
# Connect to database
psql -U postgres -d hacker_tracker

# Check if postgres is running
sudo /usr/local/bin/start-postgres.sh

# Create additional databases if needed
createdb -U postgres myapp_test
```

## More Information

- https://docs.anthropic.com/en/docs/claude-code/devcontainer
- https://code.visualstudio.com/docs/devcontainers/containers
