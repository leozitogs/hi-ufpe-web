// Mantemos as exportações que podem ser usadas em outros lugares
export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Hi UFPE";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=Hi";

export const getLoginUrl = () => "/app-auth";