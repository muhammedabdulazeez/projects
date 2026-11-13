param(
  [ValidateSet("--public", "--private")]
  [string]$Visibility = "--public"
)

$ErrorActionPreference = "Stop"

# Push every folder inside .\github-repos as its own GitHub repository.
# Prerequisites:
#   1. Install GitHub CLI (winget install GitHub.cli) and Git
#   2. Authenticate once: gh auth login
#   3. Run: .\push-all-to-github.ps1

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) is not installed. Install with: winget install GitHub.cli"
}

gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Not logged in to GitHub CLI. Run: gh auth login"
}

$ghUser = (gh api user --jq ".login").Trim()
Write-Host "Authenticated as GitHub user: $ghUser"
Write-Host "Using visibility: $Visibility`n"

$reposDir = Join-Path $PSScriptRoot "github-repos"
Get-ChildItem -Path $reposDir -Directory | ForEach-Object {
  $repoName = $_.Name
  $dir = $_.FullName
  Write-Host "=== Processing $repoName ==="

  Push-Location $dir
  try {
    if (-not (Test-Path ".git")) {
      git init -b main
    }
    git add README.md images/
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
      git commit -m "Add README and documentation screenshots"
    }

    gh repo view "$ghUser/$repoName" *> $null
    if ($LASTEXITCODE -eq 0) {
      Write-Host "Repository $ghUser/$repoName already exists; pushing updates..."
      git remote remove origin 2>$null
      git remote add origin "https://github.com/$ghUser/$repoName.git"
      git push -u origin main
    } else {
      gh repo create $repoName $Visibility --source=. --remote=origin --push
    }
    Write-Host "Done: https://github.com/$ghUser/$repoName`n"
  } finally {
    Pop-Location
  }
}
