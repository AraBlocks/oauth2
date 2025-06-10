//this implementation is [@auth/sveltekit] in [SvelteKit] deploying to [oauth2.ara.team] ~ works but downloads too low

//this file is ./src/auth.js
import {SvelteKitAuth} from '@auth/sveltekit'//using Auth.js, formerly NextAuth, 1.4 million weekly downloads, with SvelteKit, as Auth's Nuxt integration isn't finished

//Auth has submodules that know the details about how popular providers speak OAuth
import googleProvider  from '@auth/sveltekit/providers/google'
import twitterProvider from "@auth/sveltekit/providers/twitter"//𝕏, of course, but Auth.js still calls it twitter
import githubProvider  from '@auth/sveltekit/providers/github'
import discordProvider from '@auth/sveltekit/providers/discord'
import twitchProvider  from '@auth/sveltekit/providers/twitch'
import redditProvider  from '@auth/sveltekit/providers/reddit'

export const {handle, signIn, signOut} = SvelteKitAuth(async (event) => {

	//secrets come in async on the event object; locally from .dev.vars and deployed from the Cloudflare dashboard
	let googleSettings  = {clientId: event.platform.env.AUTH_GOOGLE_ID,  clientSecret: event.platform.env.AUTH_GOOGLE_SECRET}
	let twitterSettings = {clientId: event.platform.env.AUTH_TWITTER_ID, clientSecret: event.platform.env.AUTH_TWITTER_SECRET}
	let githubSettings  = {clientId: event.platform.env.AUTH_GITHUB_ID,  clientSecret: event.platform.env.AUTH_GITHUB_SECRET}
	let discordSettings = {clientId: event.platform.env.AUTH_DISCORD_ID, clientSecret: event.platform.env.AUTH_DISCORD_SECRET}

	//google, https://console.cloud.google.com/apis/credentials
	//also must verify site ownership, https://search.google.com/search-console/ownership
	//and google deletes if no activity for 6 months, https://support.google.com/cloud/answer/15549257#unused-client-deletion
	if (true) googleSettings.profile = (raw) => {//we're replacing Auth.js's response parsing function with our own
		return {
			//1 match Auth.js's profile parsing for google
			id:             raw.sub,//"108691239685192314259"
			name:           raw.name,//"Jane Doe"
			email:          raw.email,//"jane.doe@gmail.com"
			image:          raw.picture,
			email_verified: raw.email_verified,

			//2 augment with our own customizations
			//no handle, google doesn't give users a named public page
			emailVerified: raw.email_verified,

			//3 also include the provider name, for convenience, and the whole response to be able to see it later
			provider: 'google',
			response: raw,
		}
	}

	//X, https://developer.x.com/en/portal/projects-and-apps
	if (true) twitterSettings.profile = (raw) => {
		return {
			id:    raw.data.id,//"2244994945"
			name:  raw.data.name,//"Jane Doe"
			email: undefined,//we could get email with more permissions and another request, though
			image: raw.data.profile_image_url,//matches Auth.js's profile() for twitter

			handle: raw.data.username,//"janedoe_123", the @handle

			provider: 'twitter',
			response: raw,
		}
	}

	//github, github.com, Your Organizations, Settings, left bottom Developer settings, OAuth Apps
	if (false) githubSettings.profile = (raw) => {
		return {
			tomato: '',//see if you can get this to run at all

			id:    String(raw.id),//"9837451" arrives as a number so turn it into text
			name:  raw.name ?? raw.login,//"Jane Doe"
			email: raw.email,//like "9837451+janedoe@users.noreply.github.com" from response.email; often a disposable forwarding address if the user at github has chosen keep my email private; no email verified
			image: raw.avatar_url,

			handle: raw.login,//"janedoe"

			provider: 'github',
			response: raw,
		}
	}

	//discord, https://discord.com/developers/applications
	if (false) discordSettings.profile = (raw) => {
		return {
			id:    raw.id,//"80351110224678912"
			name:  raw.username,//"JaneDoe"
			email: raw.email,//"jane.doe@gmail.com"
			image: raw.avatar ? `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar}.png` : null,

			handle:        `${raw.username}#${raw.discriminator}`,//like "JaneDoe#8890"
			emailVerified: raw.verified,//true if user has verified email with discord

			provider: 'discord',
			response: raw,
		}
	}

	let authOptions = {
		providers: [
			googleProvider(googleSettings),
			twitterProvider(twitterSettings),
			githubProvider(githubSettings),
			discordProvider(discordSettings),
		],
		trustHost: true,//trust the incoming request's Host and X-Forwarded-Host headers to work with Cloudflare's reverse proxy
		callbacks: {

			async signIn({account, profile}) {//Auth calls our signIn() method once when the user and Auth have finished successfully with the third-party provider

				console.log('proof has arrived ✉️', JSON.stringify({account, profile}, null, 2))//ttd june, stringify to avoid [Object object]

				return true//allow flow to continue
			},
		},
		session: {
			maxAge: 900,//15 minutes in seconds; intending us to identify our user with this cookie, Auth's default is 30 days
			updateAge: 0,//tell Auth.js to never refresh this cookie; it will expire naturally shortly
		},
		secret: event.platform.env.AUTH_SECRET,//Auth.js needs a random secret we define to sign things; we don't have to rotate it; generate with $ openssl rand -hex 32
	}
	return authOptions
})
