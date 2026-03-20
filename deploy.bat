@echo off
setlocal enabledelayedexpansion

:: ============================================================
::  VORTT — Deploy Script
::  Commits all changes, pushes to GitHub, deploys to Vercel
:: ============================================================

title VORTT Deploy

echo.
echo ========================================
echo   VORTT Deployment Script
echo ========================================
echo.

:: ── Check git is initialized ────────────────────────────────
set COMMIT_MSG=feat: custom VORTT favicon and metadata
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo  [SETUP] Git not initialized. Setting up now...
    git init
    echo.
    set /p REPO_URL="  Enter your GitHub repo URL (e.g. https://github.com/you/vortt.git): "
    git remote add origin !REPO_URL!
    echo  [OK] Remote set to !REPO_URL!
    echo.
)

:: ── Check for a remote ──────────────────────────────────────
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] No git remote configured.
    echo  Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    echo.
    pause
    exit /b 1
)

:: ── Commit message ──────────────────────────────────────────
set /p COMMIT_MSG="  Commit message (press Enter for 'Update VORTT'): "
if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update VORTT

:: ── Stage and commit ────────────────────────────────────────
echo.
echo  [1/3] Staging all changes...
git add .

git diff --cached --quiet
if not errorlevel 1 (
    echo  [INFO] Nothing new to commit. Proceeding to push...
    goto :push
)

echo  [1/3] Committing: !COMMIT_MSG!
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo  [ERROR] Commit failed.
    pause
    exit /b 1
)

:push
:: ── Push to GitHub ──────────────────────────────────────────
echo  [2/3] Pushing to GitHub...

:: Try main branch first, fall back to master
git push origin main 2>nul
if errorlevel 1 (
    git push -u origin main 2>nul
    if errorlevel 1 (
        git push -u origin master
        if errorlevel 1 (
            echo  [ERROR] Git push failed. Check your remote URL and credentials.
            pause
            exit /b 1
        )
    )
)
echo  [2/3] Pushed to GitHub successfully.

:: ── Vercel deploy ───────────────────────────────────────────
echo  [3/3] Deploying to Vercel...

:: Check if Vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo  [INFO] Vercel CLI not found. Installing...
    npm install -g vercel
    if errorlevel 1 (
        echo  [ERROR] Could not install Vercel CLI.
        echo  If GitHub is connected to Vercel, your push already triggered a deploy.
        goto :done_no_vercel
    )
)

:: If this is the first deploy, run interactive setup; otherwise --prod
if not exist ".vercel\project.json" (
    echo.
    echo  [SETUP] First-time Vercel setup. Follow the prompts below.
    echo  - Select your Vercel account
    echo  - Link to existing project OR create new
    echo  - Set root directory to: .  (just press Enter)
    echo.
    vercel --prod
) else (
    vercel --prod --yes
)

if errorlevel 1 (
    echo  [WARN] Vercel CLI deploy had an issue, but your GitHub push
    echo  may have already triggered an auto-deploy in Vercel dashboard.
    goto :done_warn
)

echo.
echo  ================================
echo   Deploy complete!
echo   Check vercel.com for your URL
echo  ================================
echo.
pause
exit /b 0

:done_no_vercel
echo.
echo  ================================
echo   GitHub push complete.
echo   If Vercel is connected to your
echo   repo, it will auto-deploy now.
echo   vercel.com/dashboard
echo  ================================
echo.
pause
exit /b 0

:done_warn
echo.
echo  ================================
echo   GitHub push complete.
echo   Check vercel.com/dashboard
echo   for deployment status.
echo  ================================
echo.
pause
exit /b 0
