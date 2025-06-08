# oauth2.ara.team

[SvelteKit](https://svelte.dev/docs/kit/adapter-cloudflare) on
[Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/) to use
[Auth.js](https://authjs.dev/reference/sveltekit)

scaffold:
```
$ wrangler whoami, logout, login

github.com, new repo, "oauth2.ara.team"  (note the periods)
$ git clone git@github.com:/AraBlocks/oauth2.ara.team.git
but then don't cd into it, instead...

$ yarn create cloudflare --platform=pages
╰ In which directory do you want to create your application? also used as application name
./oauth2-ara-team  (note the hyphens)
Need to install the following packages: sv@0.8.7
◇  Which template would you like?
│  SvelteKit minimal
◆  Add type checking with TypeScript?
│  ● No
no additional packages
yarn, correctly picks up yarn 1
no git
yes deploy to cloudflare, got the domain:
https://oauth2-ara-team.pages.dev/

move files and folders from oauth2-ara-team to oauth2.ara.team
edit in .gitignore, LICENSE, and README.md
do first git commit

$ yarn build
$ yarn dev  (you also always add "local" in package.json scripts)
$ yarn deploy
```

files:
```
.dev.vars - api keys for local development; deployed they come from the cloudflare dashboard
src/auth.js - Auth.js configuration and callback code
src/hooks.server.js - re-exports the handle hook from auth.js
src/routes/+page.svelte - home page component we've edited
```

and the rest is from SvelteKit:

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
