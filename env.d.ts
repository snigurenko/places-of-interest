interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_OPENTRIPMAP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
// TODO: add after create accoutns
VITE_MAPBOX_TOKEN=your_token_here
VITE_OPENTRIPMAP_KEY=your_key_here