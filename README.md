# Todo Cloud CSR

A proof of concept todo app (yes, yet another TODO app demo) using Cloudflare with a client-side rendered app.

> [!WARNING]  
> This project is meant to explore the future of full-stack, and so uses many unstable and beta services and tools.
> **It is not intended for a production template**

# Contributing

This project is not ready for contributions.

## Prerequisites

- NodeJS

## Getting started

### Secrets

Secrets are managed by setting them in `.dev.vars`. [Check out the Cloudflare docs](https://developers.cloudflare.com/workers/configuration/secrets/#secrets-in-development). Here's an example with the keys required for this project to run (replace `SECRET_HERE` with the secret values):

```
JWT_CLIENT_ID=SECRET_HERE
```

## Progress

- API (using Hono + Cloudflare Workers) ✅
- SQL database (using Cloudflare D1) ✅
- Frontend (using Remix + Vite) ❌
