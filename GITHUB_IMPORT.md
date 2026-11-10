# Publish the MaraTable release candidate to GitHub

The uploaded source matches the current `main` branch for the core website files. The corrected package is prepared locally and should be reviewed in a separate release branch before production deployment.

## Windows PowerShell
1. Extract `MaraTable_Final_Release_Candidate.zip` into a working folder.
2. Open PowerShell in that folder.
3. Check the current branch and status before committing:

```powershell
git status
git branch --show-current
```

4. If this is a fresh clone, create a release branch from the repository's current main branch:

```powershell
git switch main
git pull
git switch -c release/maratable-final
```

5. Copy the corrected package contents into the repository folder, then:

```powershell
git add .
git commit -m "Prepare MaraTable final release candidate"
git push -u origin release/maratable-final
```

6. Import the release branch into Vercel as a Preview deployment. Do not merge or attach the production domain until Resend environment variables are configured and the preview contact test succeeds.

Never commit `.env` files, Resend API keys or other credentials.
