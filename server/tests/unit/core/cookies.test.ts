import { describe, it, expect } from 'vitest';
import { getSessionCookieOptions } from '../../../_core/cookies';
import type { Request } from 'express';

// Helper simples para criar um objeto Request falso sem precisar do Express real
function mockRequest(protocol: string, headers: Record<string, string | string[]> = {}): Request {
  return {
    protocol,
    headers,
    // Adicionamos outras props obrigatórias do TS como 'any' se necessário, 
    // mas para essa função específica, só isso basta.
  } as unknown as Request;
}

describe('Unit: Cookie Security Logic', () => {
  
  it('deve definir secure=false para conexões HTTP diretas (Localhost)', () => {
    const req = mockRequest('http');
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(false);
    expect(options.httpOnly).toBe(true); // Padrão de segurança sempre ativo
    expect(options.sameSite).toBe('none');
  });

  it('deve definir secure=true para conexões HTTPS diretas', () => {
    const req = mockRequest('https');
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(true);
  });

  it('deve definir secure=true quando atrás de um proxy HTTPS (Header x-forwarded-proto)', () => {
    // Cenário: Node roda em HTTP, mas o Load Balancer (Vercel/AWS) recebeu HTTPS
    const req = mockRequest('http', {
      'x-forwarded-proto': 'https'
    });
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(true);
  });

  it('deve lidar com múltiplos proxies no header (lista separada por vírgula)', () => {
    // Cenário: Passou por Cloudflare -> AWS -> Node
    const req = mockRequest('http', {
      'x-forwarded-proto': 'https, http, https'
    });
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(true);
  });

  it('deve ignorar proxies se o protocolo original for http', () => {
    const req = mockRequest('http', {
      'x-forwarded-proto': 'http'
    });
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(false);
  });
  
  it('deve ser resiliente a headers ausentes ou arrays', () => {
    // Cenário: Header enviado como array de strings (comportamento do Express em alguns casos)
    const req = mockRequest('http', {
      'x-forwarded-proto': ['https']
    });
    const options = getSessionCookieOptions(req);
    
    expect(options.secure).toBe(true);
  });
});