<script>
/*
in the [oauth2.ara.team] [SvelteKit] repo using [@auth/sveltekit],
this is the file ./src/routes/continue/[provider]/+page.svelte

this page shows no content at all; our goal is it's invisible to the user
*/

import {onMount} from 'svelte'
import {page} from '$app/stores'
import {get} from 'svelte/store'

onMount(() => {

	const provider = get(page).params.provider

	const form = document.createElement('form')
	form.method = 'POST'
	form.action = `/auth/signin/${provider}`

	form.style.display = 'none'//hide the empty form node to avoid flashing the DOM
	document.body.append(form)
	form.submit()
})

</script>
