interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_KEY: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
