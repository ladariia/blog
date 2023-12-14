import NextAuth from "next-auth";
import jwt_decode from "jwt-decode";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
console.log("%c⧭ publicRuntimeConfig", "color: #00e600", publicRuntimeConfig);
const useSecureCookies = process.env.NEXTAUTH_URL.startsWith("https://");

const inforProvider = {
    id: "infor",
    name: "Infor",
    type: "oauth",
    version: "2.0",
    scope: "openid",
    // idToken: true,
    params: { grant_type: "authorization_code" },
    // accessTokenUrl: 'https://infor.trans-monitor.ru:8143/sso-ws/auth/openid-connect/token',
    accessTokenUrl: publicRuntimeConfig.ssoUri + "/auth/openid-connect/token",
    // authorizationUrl: 'https://infor.trans-monitor.ru:8143/sso-ws/auth/login',
    authorizationUrl: publicRuntimeConfig.ssoUri + "/auth/login",
    profileUrl: "http://localhost:3000/api/auth/infor_profile",
    async profile(profile, tokens) {
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth provider does not return e-mail by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
            id: 1,
            id: profile.id,
            name: profile.name,
            email: profile.email,
            uk: profile.uniqueKey,
        };
    },
    clientId: "Notification",
    clientSecret: "a73bb0b6-1331-4512-8980-5f88eebf6297",
    // params: {
    // responce_type: "code",
    // },
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
    try {
        const url =
            publicRuntimeConfig.ssoUri +
            "/auth/openid-connect/token?" +
            // "https://infor.trans-monitor.ru:8143/sso-ws/auth/openid-connect/token?" +
            new URLSearchParams({
                client_id: "Notification",
                client_secret: "a73bb0b6-1331-4512-8980-5f88eebf6297",
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
                redirect_uri: "http://localhost:3000/api/auth/callback/infor",
            });

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: {},
        });

        const refreshedTokens = await response.json();

        // console.log(
        //     "%capi/auth/refreshAccessToken: refreshedTokens",
        //     "color: #733d00",
        //     refreshedTokens
        // );

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        // Providers.GitHub({
        //   clientId: process.env.GITHUB_ID,
        //   clientSecret: process.env.GITHUB_SECRET,
        // }),
        inforProvider,
    ],
    // jwt: {
    // 	signingKey: {
    // 		kty: 'oct',
    // 		kid: '5mZgtiGqLQJsQwWdsxlMF_38eEFJ6mK1S_YRaZ5uILw',
    // 		alg: 'HS512',
    // 		k: '5AIW36kvUw3ozCk-_prrV8DnE_aJZAfxarBKmnZMt78'
    // 	}
    // },
    callbacks: {
        async jwt(token, user, account) {
            // console.log("%c⧭ token, user, account", "color: #00736b", token, user, account);
            // Initial sign in
            if (account && user) {
                const { exp, iat } = jwt_decode(account.accessToken);

                const tokens = {
                    accessToken: account.accessToken,
                    accessTokenExpires: exp * 1000,
                    refreshToken: account.refresh_token,
                    user,
                };
                // console.log("%capi/auth/NextAuth: tokens", "color: #733d00", tokens);
                return tokens;
            }

            // console.log(
            //   "%c⧭ Date.now(), accessTokenExpires",
            //   "color: #007300",
            //   Date.now(),
            //   token.accessTokenExpires
            // );

            // Return previous token if the access token has not expired yet
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has expired, try to update it
            const newToken = await refreshAccessToken(token);
            // console.log("%c⧭ newToken", "color: #d0bfff", newToken);
            return newToken;
        },
        async session(session, token) {
            // console.log('%c⧭ session, token', 'color: #99614d', session, token);
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
                session.error = token.error;
            }

            return session;
        },
    },

    cookies: {
        sessionToken: {
            name: `constructor-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        callbackUrl: {
            name: `constructor-next-auth.callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        csrfToken: {
            name: `constructor-next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        pkceCodeVerifier: {
            name: `constructor-next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
    },
    // debug: true,
    // A database is optional, but required to persist accounts in a database
    //   database: process.env.DATABASE_URL,
    // logger: {
    //   error(code, ...message) {
    //     console.log("error", { code, message });
    //   },
    //   warn(code, ...message) {
    //     console.log("warn", { code, message });
    //   },
    //   debug(code, ...message) {
    //     console.log("debug", code, message);
    //   },
    // },
});
