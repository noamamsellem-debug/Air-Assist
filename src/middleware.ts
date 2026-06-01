import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Applique l'i18n à tout sauf l'API, l'admin (CRM interne), les assets et fichiers.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
