---
name: git-create-pr
description: Pushes the current branch and opens a pull request following the project's PR template. Trigger when the user asks to "tạo pull request", "tạo PR", "create PR", "mở PR", or "push and open PR".
---

## Steps

### 1. Pre-flight checks
- Confirm current branch is not `main` or `develop`.
- Confirm there are commits ahead of the base branch (`git log <base>..HEAD`).
- Confirm working tree is clean (no uncommitted changes) — if not, ask whether to commit first (can delegate to the git-commit skill).

### 2. Push the branch
- Push with: `git push -u origin <current-branch>`
- If GitHub MCP is not connected, stop here and give the user the manual push command plus a link to open a PR on GitHub.

### 3. Fetch ticket info via Jira MCP
- Extract JIRA ID from branch name (e.g. feature/ZTRUYEN-3 → ZTRUYEN-3)
- Use the Jira MCP tool to fetch issue summary, description, and acceptance criteria for the ticket
- Build the "Why" section using the fetched summary
- Include a real link: https://<your-site>.atlassian.net/browse/<JIRA-ID>
- If the Jira MCP call fails, fall back to asking the user for the summary manually

### 4. Build PR title and description
- Title format: `[<JIRA-ID>] <short description>`
- Description template:
## What
<tóm tắt thay đổi>

## Why
Jira: <link hoặc ID>
<lý do của thay đổi>

## How to test
<các bước test thủ công>

## Screenshots
<Nếu là thay đổi UI thì yêu cầu người dùng đính kèm ảnh hoặc ghi "N/A">

### 5. Confirm before opening
- Show the proposed PR title, description, and target branch (default: `develop`, unless hotfix → `main`) to the user.
- Wait for explicit confirmation.

### 6. Open the PR
- Use GitHub MCP to create the PR with the confirmed title/description/base branch.
- Do not auto-merge. Do not auto-request specific reviewers unless the user specifies.

### 7. Report result
- Return the PR URL to the user.