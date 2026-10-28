# Publish this release to the MaraTable GitHub repository

The destination repository `Kmuroki73/Maratable---Final` was checked and is empty. This release should be pushed to a review branch first, leaving the default branch untouched until the site is approved.

## Windows / Git Bash
1. Download `MaraTable_Africa_Focused_Release_FINAL.zip` and extract it to a folder, e.g. `C:\MaraTable_Africa_Focused_Release_FINAL`.
2. Open Git Bash in that extracted folder.
3. Run:

```bash
git init -b release/africa-focused-final
git add .
git commit -m "Prepare final Africa-focused MaraTable site"
git remote add origin https://github.com/Kmuroki73/Maratable---Final.git
git push -u origin release/africa-focused-final
```

Git may ask you to authenticate with GitHub. Do not put passwords or access tokens into the command.

## Vercel preview
Import `Kmuroki73/Maratable---Final` into Vercel and select `release/africa-focused-final` as the deployment branch. Use the `Other` framework preset, no build command, and the repository root as the output directory. Preview it first; do not attach `maratable.com` until Nancy approves and the release gates in `QA_AUDIT.md` pass.
