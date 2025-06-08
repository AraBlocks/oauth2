//./src/auth.js
import {SvelteKitAuth} from '@auth/sveltekit'

import googleProvider  from '@auth/sveltekit/providers/google'
import twitterProvider from "@auth/sveltekit/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/sveltekit/providers/github'
import discordProvider from '@auth/sveltekit/providers/discord'
import twitchProvider  from '@auth/sveltekit/providers/twitch'
import redditProvider  from '@auth/sveltekit/providers/reddit'

export const {handle, signIn, signOut} = SvelteKitAuth(async (event) => {
	const authOptions = {
		providers: [
			googleProvider ({
				clientId: event.platform.env.AUTH_GOOGLE_ID,
				clientSecret: event.platform.env.AUTH_GOOGLE_SECRET,
			}),
			twitterProvider ({
				clientId: event.platform.env.AUTH_TWITTER_ID,
				clientSecret: event.platform.env.AUTH_TWITTER_SECRET,
			}),
		],
		secret: event.platform.env.AUTH_SECRET,
		trustHost: true,
	}
	return authOptions
})
