# Using Claude Code in a Dev Container

**NEVER run Claude Code or any other assistant directly on your machine.** Normally, it would have the same permissions as your own user, and therefore be able to copy all your files (including secrets) to a remote destination.

**If you have an assistant installed, delete it now, and follow this guide instead.**

This doc contains info on how to use Claude Code in a Dev Container. It is only tested with VS Code.

## Setup

This directory (.devcontainer) already includes a copy of Claude's devcontainer configuration (with modifications for Plasmic). In the devcontainer, Claude will only have access to the files in your VS Code workspace. Also, there's a firewall that limits which domains it can access to reduce risk of exfiltration.

To setup Claude in a devcontainer, perform the following steps within VS Code:

1. Install the Dev Containers extension
2. Run "Dev Containers: Reopen in Container"
3. **Verify the bottom-left corner says: "Dev Container: Claude Code Sandbox"**
4. Open a terminal and run `claude --dangerously-skip-permissions`

## More information

- https://docs.anthropic.com/en/docs/claude-code/devcontainer
- https://code.visualstudio.com/docs/devcontainers/containers
