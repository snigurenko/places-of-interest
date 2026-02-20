# Places of Interest

A Vue 3 application that lets you search for a city and discover nearby places of interest on an interactive map, powered by the OpenTripMap API and Mapbox GL.

!! Please create .env file to provide your API keys
VITE_MAPBOX_TOKEN=pk.ey....
VITE_RAPIDAPI_KEY=...
links: 
https://rapidapi.com/hub
https://www.mapbox.com

## API Limitations (Free Subscription)

- **Maximum 500 places per request.** The free tier caps results at 500, so for large cities not all points of interest within the 10 km radius may be returned.
- **Rate limiting may return 0 results.** Frequent requests can cause the API to respond with an empty array. If you see no results, wait a moment and try again.
- **Distance range for large agglomerations.** Because of the 500-place cap, in bigger cities the returned places may cover only a fraction of the 10 km search radius. Console logs are intentionally left in `mapService.ts` so you can verify the actual distance range of the data coming back.

## Design Decisions & Trade-offs

- **Default city: Alicante.** The app performs a search for Alicante on first load to immediately show content on the map.
- **No i18n.** This is a test/demo application, so internationalisation was not implemented.
- **No skeleton loading states in the detail modal.** Kept simple for the same reason.
- **Console logs in the service layer.** Left intentionally to inspect API responses (total count, distance distribution) during development.
- **Icons as emoji, not SVG components.** In a production app I would use SVG icons or an icon library, but for this scope emoji are sufficient.
- **Single Pinia store without modules.** The app has a single domain (places), so splitting into store modules would be unnecessary complexity.
- **No debounce on search input.** In a production app the search should be debounced (or throttled) to reduce API calls. Likewise, there is room for further performance optimisation when fetching and rendering large place lists. The current implementation covers the stated requirements without over-engineering.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
