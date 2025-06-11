<!-- in the [oauth2.ara.team] [SvelteKit] repo using [@auth/sveltekit], this is the file ./src/routes/+page.svelte -->

<svelte:head>
<meta name="google-site-verification" content="_QVRB2Q1vXow6EkXoTMWm1AAZN-mOLJRwPx8g8YolU4" />
</svelte:head>

<main>

<h1>Welcome to SvelteKit</h1>
<p>This HTML comes from a file at <code>./src/routes/+page.svelte</code></p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<p>Preparing this minimal site for <i>oauth2.ara.team</i></p>

<h2>List</h2>
<p>List configured OAuth providers at <a href="/auth/providers">/auth/providers</a> and then</p>

<h2>Start flow with GET</h2>
<p><a href="/auth/signin/google">Continue with Google</a></p>
<p><a href="/auth/signin/twitter">Continue with Twitter</a></p>

<h2>Start flow with POST</h2>
<div><form method="POST" action="/auth/signin/google"><button type="submit">Continue with Google</button></form></div>
<div><form method="POST" action="/auth/signin/twitter"><button type="submit">Continue with Twitter</button></form></div>

</main>
