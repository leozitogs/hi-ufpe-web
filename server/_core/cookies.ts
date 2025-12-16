import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  // Se estiver no Render (produção), sempre consideramos seguro
  if (process.env.NODE_ENV === "production") return true;

  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

// [CORREÇÃO] Mudamos o tipo de retorno para 'any' ou estendemos para evitar erro de TS
// pois 'partitioned' é muito recente.
export function getSessionCookieOptions(req: Request): any {
  // O código antigo de domínio estava comentado, mantivemos assim.
  // Para Cross-Site no Render, não devemos forçar o domínio manualmente
  // deixamos o navegador inferir.

  const isSecure = isSecureRequest(req);

  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecure, // Obrigatório ser true para SameSite=None
    partitioned: true, // <--- A PEÇA QUE FALTAVA! (Permite cookie em aba anônima/cross-site)
  };
}