#!/usr/bin/env bash
set -euo pipefail

# Push every folder inside ./github-repos as its own public GitHub repository.
# Prerequisites:
#   1. Install GitHub CLI (https://cli.github.com/) and Git
#   2. Authenticate once: gh auth login
#   3. Run: chmod +x push-all-to-github.sh && ./push-all-to-github.sh

VISIBILITY="${1:---public}" # pass --private as first argument if desired
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPOS_DIR="$ROOT_DIR/github-repos"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is not installed. Install from https://cli.github.com/"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: Not logged in to GitHub CLI. Run: gh auth login"
  exit 1
fi

GH_USER="$(gh api user --jq '.login')"
echo "Authenticated as GitHub user: $GH_USER"
echo "Using visibility: $VISIBILITY"
echo ""

for dir in "$REPOS_DIR"/*/; do
  repo_name="$(basename "$dir")"
  echo "=== Processing $repo_name ==="
  (
    cd "$dir"
    if [ ! -d ".git" ]; then
      git init -b main
    fi
    git add README.md images/
    if ! git diff --cached --quiet; then
      git commit -m "Add README and documentation screenshots"
    fi

    if gh repo view "$GH_USER/$repo_name" >/dev/null 2>&1; then
      echo "Repository $GH_USER/$repo_name already exists; pushing updates..."
      git remote remove origin >/dev/null 2>&1 || true
      git remote add origin "https://github.com/$GH_USER/$repo_name.git"
      git push -u origin main
    else
      gh repo create "$repo_name" "$VISIBILITY" --source=. --remote=origin --push
    fi
  )
  echo "Done: https://github.com/$GH_USER/$repo_name"
  echo ""
done
