# Nx OpenNext example

This repository is intended as an example for integrating [`open-next`](https://github.com/sst/open-next) within an [Nx](https://nx.dev) monorepo.

This was made possible by the recently introduced `app-path` and `build-output-path` options, released in [`open-next@2.2.1`](https://github.com/sst/open-next/releases/tag/v2.1.1).

## Setup

This repository exposes two different projects lined out in the following chapters.

### libs/nx-open-next

A custom [Nx plugin](https://nx.dev/extending-nx/intro/getting-started) which exposes a `build` executor.

In it's most simple form the `open-next` command can be executed in the following manner:

```zsh
pnpm open-next build --build-command "pnpm nx build open-next-example-web" --app-path "apps/open-next-example-web" --build-output-path "dist/apps/open-next-example-web"
```

#### Options

The Nx plugin sets this command up with the following provided options:

- `buildTarget`: the `Nx` build target to use in the format `project:target` or `project:target:configuration`.
- `sourceRoot`: the path to the root of the Next.js application's source code.
- `buildCommand?`: maps directly to the `build-command` flag. This is defaulted to "exit 0" because most projects can be built using Nx's [`dependsOn`](https://nx.dev/reference/project-configuration#dependson) project option, read more about this in [apps/open-next-example-web](#appsopen-next-example-web).

### apps/open-next-example-web

An example Next.js application which integrates the [`nx-open-next`](#libsnx-open-next) plugin.

#### next.config.js

It's important to note that the Next app is built in standalone mode. When generating a new Next app make sure to include the following option in `next.config.js`:

```typescript
const nextConfig = {
  output: 'standalone',
  ...
};
```

#### project.json

The `project.json` is set up in a way to utilise the [Nx cache](https://nx.dev/concepts/how-caching-works) for both the Next.js build and `open-next` transforming your build output.

In order to achieve this you can rename the default Next.js `build` target to the `build-next` target. The reason for this is that we're actually going to use the `build` target for executing `open-next` as the entry point.

The build target looks something like the following:

```json
{
    ...
    "targets" {
        ...
        "build": {
            "executor": "@nx-open-next/nx-open-next:build",
            "outputs": ["{options.outputPath}"],
            "defaultConfiguration": "production",
            "options": {
                "buildTarget": "open-next-example-web:build-next",
                "sourceRoot": "apps/open-next-example-web"
            },
            "dependsOn": ["build-next"]
        }
    }
},
```

Specifcally note the `dependsOn` option. This will make sure the `build-next` target is ran with the same configuration.

This makes sure that both commands are using Nx as the execution layer, allowing these outputs to be cached by Nx.

## Publishing and other concerns

This repository is meant as an example repository for the Nx enthousiasts in the [SST Discord](https://sst.dev/discord).

I will soon look into publishing this as an Nx plugin. There are several possibilities of expanding this further, potentially even by supporting a custom [Nx generator](https://nx.dev/extending-nx/recipes/local-generators) which includes this setup by default.

If you have any issues in the meantime setting this up, or have any improvements for this setup, feel free to reach out. You can create an issue on this repository or reach out on the [SST Discord](https://sst.dev/discord), make sure to tag my handle `@lorenzodejong`.
