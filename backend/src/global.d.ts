declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    FRONTEND_ORIGIN?: string;
    PUBLIC_BASE_URL?: string;
  }
}
