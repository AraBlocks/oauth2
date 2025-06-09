//./src/auth.js
import {SvelteKitAuth} from '@auth/sveltekit'

import googleProvider  from '@auth/sveltekit/providers/google'
import twitterProvider from "@auth/sveltekit/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/sveltekit/providers/github'
import discordProvider from '@auth/sveltekit/providers/discord'
import twitchProvider  from '@auth/sveltekit/providers/twitch'
import redditProvider  from '@auth/sveltekit/providers/reddit'

function includeResponse(configuration) {//takes a provider-specific Auth.js configuration object
	let profileFunction = configuration.profile//saves the reference to Auth's response parsing function
	configuration.profile = async (...a) => {//to replace it with this one
		let pulled = await profileFunction(...a)//which starts out by calling it to get .id .name .email and .image
		return {...pulled, response: a[0]}//and alongside those, also includes the response body from the provider, which is the first argument
	}
	return configuration
}

export const {handle, signIn, signOut} = SvelteKitAuth(async (event) => {
	const settings = {

		//google, https://console.cloud.google.com/apis/credentials
		//also must verify site ownership, https://search.google.com/search-console/ownership
		//and google deletes if no activity for 6 months, https://support.google.com/cloud/answer/15549257#unused-client-deletion
		google: {//uses Google’s OAuth 2.0 via OpenID Connect
			clientId: event.platform.env.AUTH_GOOGLE_ID, clientSecret: event.platform.env.AUTH_GOOGLE_SECRET,
		},

		//X, https://developer.x.com/en/portal/projects-and-apps
		twitter: {//uses X API v2 via OAuth 2.0 (PKCE)
			clientId: event.platform.env.AUTH_TWITTER_ID, clientSecret: event.platform.env.AUTH_TWITTER_SECRET,
			authorization: {params: {scope: 'users.read'}},//only request the minimal "users.read" scope; default is "users.read tweet.read offline.access" which would need more approval, and tell the user our site could see their tweets
		},

		//github, github.com, Your Organizations, Settings, left bottom Developer settings, OAuth Apps
		github: {//uses GitHub’s OAuth 2.0 Web Application Flow
			clientId: event.platform.env.AUTH_GITHUB_ID, clientSecret: event.platform.env.AUTH_GITHUB_SECRET,
		},

		//discord, https://discord.com/developers/applications
		discord: {//uses Discord’s OAuth2
			clientId: event.platform.env.AUTH_DISCORD_ID, clientSecret: event.platform.env.AUTH_DISCORD_SECRET,
		},
	}
	const options = {
		providers: [
			includeResponse(googleProvider(settings.google)),
			includeResponse(twitterProvider(settings.twitter)),
			includeResponse(githubProvider(settings.github)),
			includeResponse(discordProvider(settings.discord)),//for each of these, we call Auth's function to turn the settings for this provider we prepared into a configuration object, and then use our helper function to augment the profile function with one that also includes the raw response body from the provider
		],
		trustHost: true,//trust the incoming request's Host and X-Forwarded-Host headers to work with Cloudflare's reverse proxy
		callbacks: {

			async signIn({account, profile}) {//Auth calls our signIn() method once when the user and Auth have finished successfully with the third-party provider

				console.log('✅ Proof received for:', profile?.email, 'via', account.provider)//you can store this or pass it to internal systems
				return true//allow flow to continue
			},
		},
		session: {
			maxAge: 900,//15 minutes in seconds; intending us to identify our user with this cookie, Auth's default is 30 days
			updateAge: 0,//tell Auth.js to never refresh this cookie; it will expire naturally shortly
		},
		secret: event.platform.env.AUTH_SECRET,//Auth.js needs a random secret we define to sign things; we don't have to rotate it; generate with $ openssl rand -hex 32
	}
	return options
})
