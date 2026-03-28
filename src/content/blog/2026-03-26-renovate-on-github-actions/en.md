---
title: 'Running renovate on github actions without extra tokens'
description: |
  How to run renovate on github actions using the GA's ephemeral token to save
  a few clicks.
urlSlug: 'renovate-on-github-actions'
---

## The problem

I'd like to run [renovate](https://www.mend.io/renovate/) on github actions
but I really don't like the idea of creating tokens to give it permissions to
create issues and pull requests.

## The plan

In a quick google search I couldn't find any example of renovate using the
ephemeral github actions tokens (which are created for each run).

## When

First I want this to run once a week, so we use the github actions cron trigger
(you can use [crontab guru](https://crontab.guru/) for the syntax).

```yaml
on:
  schedule:
    - cron: '0 6 * * 1'
```

I'd also like to be able to trigger it manually:

```yaml
on:
  workflow_dispatch:
```

## Who

The github actions token has very few permissions to run renovate, so we need to
give it some.

```yaml
jobs:
  renovate:
    permissions:
      contents: write
      pull-requests: write
      issues: write
      packages: write
```

Here it depends on what we want renovate to do but:

- `contents`: To be able to create files in the repo, mainly to create PRs.
- `pull-requests`: If we want renovate to create PRs on its own.
- `issues`: So renovate can manage its own dashboard.

## What

Finally we need to pass the github actions token to the renovate action.

```yaml
jobs:
  renovate:
    steps:
      - uses: actions/checkout@v5
      - uses: renovatebot/github-action@v46.1.5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          RENOVATE_REPOSITORIES: ${{ github.repository }}
          # LOG_LEVEL: 'debug'
```

Note that we need to tell it the name of the repo we want it to work on because
renovate runs in a container so it doesn't have access to the repo. But we still
need checkout to get the renovate configuration.

## Debug

If something doesn't work we can pass LOG_LEVEL so renovate tells us in detail
what it's doing.

```yaml
jobs:
  renovate:
    steps:
      - uses: renovatebot/github-action@v46.1.5
        env:
          LOG_LEVEL: 'debug'
```

## One last detail for PRs

Finally if we want renovate to be able to create PRs we need to allow it on the
project settings, for example: 
https://github.com/USER/REPOSITORY/settings/actions. There we need to go to the
section `Workflow permissions` and enable
`Allow GitHub Actions to create and approve pull requests`.

## TLDR

In summary the file would go in `.github/workflows/renovate.yaml` with:

```yaml
name: Renovate
on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

jobs:
  renovate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      packages: write
    steps:
      - uses: actions/checkout@v5
      - uses: renovatebot/github-action@v46.1.5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          RENOVATE_REPOSITORIES: ${{ github.repository }}
          # LOG_LEVEL: 'debug'
```
