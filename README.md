# TradeEdge

TradeEdge is a trading journal and performance analytics web app. It brings trade review, account synchronization, and performance insights into one interface to help traders evaluate their execution and refine their strategies.

> **Project status:** This repository contains the frontend. The dashboard, account, and analytics workflows expect a compatible backend API. The Journal and Playbooks screens currently use sample data held in client-side state; changes made there are not persisted between reloads.

## Features

- **Account access:** Registration, email verification, login, password reset, and token refresh flows.
- **Trading account management:** Connect, synchronize, update, or disconnect trading accounts through the API.
- **Performance overview:** Review account vitals, equity growth, recent trades, risk, behavior, and advanced metrics.
- **Analytics:** Explore performance, time, psychology, distribution, edge, and stop-out analysis.
- **Trade journal interface:** Browse, search, filter, and edit example trade records, including notes, tags, ratings, emotions, and execution details.
- **Playbook interface:** Organize example strategies with rules, conditions, status, and performance summaries.
- **Responsive interface:** Built with reusable components, charts, and light/dark theme support.

### Integration status

The platform configuration currently marks MetaTrader 5 as available. Interactive Brokers, Binance, cTrader, TradingView, and manual import are marked as coming soon in the shared platform configuration. The synchronization screen includes additional UI concepts, but actual availability and behavior depend on the backend and the integration configuration.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Radix UI](https://www.radix-ui.com/) and shadcn/ui-style components
- [Recharts](https://recharts.org/) for charts
- [SWR](https://swr.vercel.app/) and Axios for API data fetching
- [Zustand](https://zustand.docs.pmnd.rs/) for client-side state

## Getting started

### Prerequisites

- Node.js (use a current LTS release)
- npm
- A compatible TradeEdge backend API for authentication, account synchronization, and live analytics

### Install

```bash
git clone https://github.com/NdipEstaban/quantl_frontend.git
cd quantl_frontend
npm ci
```

### Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_ACCESS_SECRET=replace-with-the-backend-access-token-secret
JWT_REFRESH_SECRET=replace-with-the-backend-refresh-token-secret
```

- `NEXT_PUBLIC_API_URL` is the base URL for the backend API. The frontend defaults to `http://localhost:5000` for API requests if it is not set.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are used by the Next.js route proxy to verify access and refresh tokens. Configure them to match the backend's signing secrets.
- Keep real secrets in your local environment or deployment provider. Do not commit `.env.local` or expose signing secrets in client-side code.
- OAuth providers, email verification, and password reset also require corresponding backend and provider configuration.

The API client sends requests with credentials and uses bearer access tokens. The backend must support the endpoints and response shapes consumed by the frontend services, and must be configured for the frontend's origin when running on a different port or host.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a compatible backend, authenticated screens and live account/analytics data will not work as intended. The sample journal and playbooks can be explored independently, but their state is temporary.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production app |
| `npm run start` | Start the production server (after building) |
| `npm run lint` | Run ESLint |

## Project structure

```text
app/
  (auth)/       Authentication pages
  app/          Authenticated application routes
components/
  app/          Feature-specific application components
  ui/           Reusable interface components
hooks/          Authentication, data-fetching, and UI hooks
lib/
  constants/    Shared platform and analytics configuration
  services/     Backend API service clients
  store/        Zustand client-side stores
  types/        Shared TypeScript types
public/         Icons and static assets
```

## API integration

Backend requests are organized in `lib/services/`. The main service areas are:

- Authentication: `/auth/*`
- Trading accounts: `/trade-accounts/*`
- Metrics: `/metrics/*`

See [lib/api-client.ts](./lib/api-client.ts), [lib/services/auth-service.ts](./lib/services/auth-service.ts), [lib/services/trading-account-service.ts](./lib/services/trading-account-service.ts), and [lib/services/metrics-service.ts](./lib/services/metrics-service.ts) for the frontend's current request paths and types. This repository does not include the API server or a complete backend API specification.

## Contributing

Contributions are welcome. To work on a change:

1. Fork the repository and create a feature branch.
2. Install dependencies with `npm ci`.
3. Make and test your change with the relevant scripts above.
4. Open a pull request describing the change and any backend or environment requirements.

For changes involving API-backed screens, include any required backend contract updates or call them out clearly in the pull request.

## License

No license is currently included in this repository. Unless a license is added, assume that standard copyright applies and check with the repository owner before redistributing or reusing the code.
