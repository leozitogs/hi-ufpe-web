import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { invokeLLM, type Message } from '../../../_core/llm';

// 1. Mock das Variáveis de Ambiente
vi.mock('../../../_core/env', () => ({
  ENV: {
    forgeApiKey: 'sk-test-123',
    forgeApiUrl: 'https://api.teste.com'
  }
}));

describe('Core: LLM Integration (invokeLLM)', () => {
  // Mock do fetch global
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deve montar o payload corretamente para mensagens simples', async () => {
    // Configura o fetch para retornar sucesso falso
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [] })
    });

    const messages: Message[] = [
      { role: 'user', content: 'Olá' }
    ];

    await invokeLLM({ messages });

    // VERIFICAÇÃO CRÍTICA:
    // O fetch foi chamado?
    expect(fetchMock).toHaveBeenCalledTimes(1);
    
    // O corpo da requisição estava correto?
    const callArgs = fetchMock.mock.calls[0]; // [url, options]
    const url = callArgs[0];
    const options = callArgs[1];
    const body = JSON.parse(options.body);

    expect(url).toContain('https://api.teste.com');
    expect(options.headers.authorization).toBe('Bearer sk-test-123');
    expect(body.model).toBe('gpt-4o-mini');
    expect(body.messages[0]).toEqual({ role: 'user', content: 'Olá' });
  });

  it('deve normalizar e preservar tool_calls no histórico (Crítico para o Chatbot)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    // Cenário: O assistente chamou uma função anteriormente
    // O código deve preservar o 'tool_calls' ao enviar de volta para a API
    const messages: any[] = [
      { 
        role: 'assistant', 
        content: null, 
        tool_calls: [{ id: 'call_123', function: { name: 'test' } }] 
      }
    ];

    await invokeLLM({ messages });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    
    // Se essa lógica falhar, a API da OpenAI rejeita o histórico
    expect(body.messages[0]).toHaveProperty('tool_calls');
    expect(body.messages[0].tool_calls[0].id).toBe('call_123');
  });

  it('deve lançar erro formatado se a API responder com erro', async () => {
    // Simula erro 500 da API
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Erro interno na IA'
    });

    await expect(invokeLLM({ messages: [] }))
      .rejects
      .toThrow('LLM invoke failed: 500 Internal Server Error – Erro interno na IA');
  });

  it('deve formatar ToolChoice corretamente quando for "required"', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    await invokeLLM({
      messages: [],
      tools: [{ type: 'function', function: { name: 'minha_funcao' } }],
      toolChoice: 'required'
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    
    // Verifica se transformou "required" no objeto explícito que a API exige
    expect(body.tool_choice).toEqual({
      type: 'function',
      function: { name: 'minha_funcao' }
    });
  });
});