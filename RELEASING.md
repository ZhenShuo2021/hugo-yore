## Releasing

1. Update theme version in 2 files:
   1. `package.json`
   2. `data/theme.yaml`
2. Check whether need to update the minimal Hugo version in 3 files:
   1. `exampleSite/content/en/docs/40-getting-started/index.md`
   2. `layouts/baseof.html`
   3. `build.sh`

## gh Cheatsheet

```sh
gco main~4 -b
gh pr create -f
gh pr merge PR_NUMBER -s
git checkout main && git pull --rebase
git push -d origin BRANCH && git branch -D BRANCH
```
