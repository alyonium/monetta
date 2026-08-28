# Monetta 🪙

Monetta is a personal-finance PWA.

Users sign in with a Firefly III Personal Access Token and the URL of their Firefly III instance. After signing in, the app provides four screens (tabs): Budget, History, Analytics, and Settings.

Monetta has no backend of its own. It talks to [Firefly III](https://www.firefly-iii.org/) over the HTTP API. You need a running Firefly III instance (usually self-hosted) and a token for it.

## Sign in

1. Create a Personal Access Token in Firefly III: Options → Profile → OAuth / Personal Access Tokens.
2. Enter that token and the instance URL.

The Firefly instance must allow CORS from the origin where Monetta is served.
