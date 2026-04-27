/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAPA_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
