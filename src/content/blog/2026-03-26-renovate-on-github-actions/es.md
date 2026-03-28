---
title: 'Corriendo renovate en github actions sin tokens de más'
description: |
  Como correr renovate en github actions usando el token efimero por defecto
  para ahorrarnos algunos clicks.
urlSlug: 'renovate-en-github-actions'
---

## El problema

Me gustaría correr [renovate](https://www.mend.io/renovate/) en github actions
pero realmente no me gusta la idea de crear tokens para darle permisos para
crear issues y pull requests.

## El plan

En un rapido googleo no encontre ningún ejemplo de renovate usando los tokens
efimeros de github actions (que sea crean por cada corrida).

## Cuando

Primero quiero que esto corra una vez por semana, entonces usamos el trigger de
cron de github actions (podés usar [crontab guru](https://crontab.guru/) para
la sintaxis).

```yaml
on:
  schedule:
    - cron: '0 6 * * 1'
```

También me gustaría poder triggerearlo manualmente:

```yaml
on:
  workflow_dispatch:
```

## Quién

El token de github actions tiene muy pocos permisos para correr renovate, así
que tenemos que darle algunos.

```yaml
jobs:
  renovate:
    permissions:
      contents: write
      pull-requests: write
      issues: write
      packages: write
```

Acá depende de que queremos que haga renovate pero:

- `contents`: Para poder crear archivos en el repo, principalmente para poder
              crear PRs.
- `pull-requests`: Si queremos que renovate cree PRs por si solo.
- `issues`: Para que renovate maneje su propio dashboard.

## Que

Finalmente tenemos que pasarle el token de github actions a la action de
renovate.

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

Notese que hay que decirle el nombre del repo sobre el que queremos que trabaje
porque renovate corre en un container así que no tiene acceso al repo. Pero
igual necesitamos checkout para conseguir la configuración de renovate.

## Detalle para crear PRs

Finalmente si queremos que renovate tenga la capacidad de crear PRs tenemos que
habilitarlo en los settings del proyecto, por ejemplo:
https://github.com/USUARIO/REPOSITORIO/settings/actions ahí luego necesitamos
ir a la sección `Workflow permissions` y habilitar
`Allow GitHub Actions to create and approve pull requests`.

## Debug

Si algo no funciona podemos pasar LOG_LEVEL para que renovate no cuente en
detalle de que esta haciendo.

```yaml
jobs:
  renovate:
    steps:
      - uses: renovatebot/github-action@v46.1.5
        env:
          LOG_LEVEL: 'debug'
```


## TLDR

En resumen el archivo quedaría en `.github/workflows/renovate.yaml` con:

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
