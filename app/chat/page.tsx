"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import { SendIcon } from "@/components/icons";

type Msg = { id: number; from: "bot" | "you"; text: string; time: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text:
        "Olá klarissa! Sou a assistente virtual do UFPE Hub Inteligente. Como posso ajudá-lo hoje?",
      time: "22:51",
    },
    {
      id: 2,
      from: "bot",
      text:
        "Posso ajudá-lo a navegar pelas funcionalidades do sistema. Qual é sua dúvida?",
      time: "22:51",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // sempre rola pro fim
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isBotTyping]);

  function nowHM() {
    return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function send() {
    const text = input.trim();
    if (!text) return;

    // adiciona sua mensagem
    setMessages((m) => [...m, { id: Date.now(), from: "you", text, time: nowHM() }]);
    setInput("");

    // resposta simulada (sem API)
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Anotado! 😉 (resposta simulada — sem API)",
          time: nowHM(),
        },
      ]);
      setIsBotTyping(false);
    }, 900);
  }

  return (
    <section className="bg-neutral-50">
      {/* wrapper CENTRALIZADO e em COLUNA */}
      <div className="mx-auto w-full max-w-3xl min-h-[100dvh] flex flex-col bg-white">

        {/* HEADER */}
        <header className="border-b px-4 py-3 text-sm font-semibold">
          Chat com IA
        </header>

        {/* LISTA de mensagens (cresce e rola) */}
        <div ref={listRef} className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
          {messages.map((m) => (
            <ChatBubble key={m.id} from={m.from} time={m.time}>
              {m.text}
            </ChatBubble>
          ))}
          {isBotTyping && <ChatBubble from="bot">Digitando…</ChatBubble>}
        </div>

        {/* INPUT + BOTÃO (fixo embaixo) */}
        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 max-h-40 min-h-[44px] h-[44px] px-3 py-2 rounded-md border outline-none resize-none"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              onClick={send}
              aria-label="Enviar"
              className="inline-flex items-center gap-2 h-11 px-3 rounded-md bg-blue-600 text-white text-sm font-medium"
            >
              <SendIcon className="w-5 h-5" />
              Enviar
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pressione Enter para enviar ou Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </section>
  );
}
