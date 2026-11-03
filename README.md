# VarsityMart

Campus marketplace for tertiary students and vendors in Ghana.

| Folder | What it is |
|---|---|
| [`web/`](web/README.md) | The Next.js web app. **Start with `web/README.md`**: setup, env vars, scripts, architecture, conventions and known issues. |
| `api_requests/` | [Bruno](https://www.usebruno.com) collection for the backend API (`https://api.varsitymart.org/v1`). |

The backend is a separate service and is not in this repository. The web app's copy of its OpenAPI schema lives in `web/openapi/`.

```bash
cd web
bun install
cp .env.example .env
bun dev
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests and a production build on every push and pull request.
