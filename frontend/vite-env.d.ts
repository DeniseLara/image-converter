// src/types/env.d.ts (o src/vite-env.d.ts)

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // ✅ Declara aquí todas las variables VITE_ que uses
  readonly VITE_API_URL: string; 
  // Si tuvieras otra variable, iría aquí:
  // readonly VITE_ALGUNA_OTRA_VAR: string; 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}