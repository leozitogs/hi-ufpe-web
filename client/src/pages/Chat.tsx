import React, { useState, useRef, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../_core/hooks/useAuth";
import { Bot, Send, Sparkles, User } from "lucide-react";

const Chat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useContext();

  const [conversaAtual, setConversaAtual] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: conversaData, isFetching: loadingConversa } = trpc.chat.getConversa.useQuery(
    { id: conversaAtual ?? "" },
    { enabled: !!conversaAtual }
  );

  const enviarMutation = trpc.chat.enviarMensagem.useMutation({
    onSuccess: (data) => {
      if (data?.conversaId) {
        setConversaAtual(data.conversaId);
        utils.chat.getConversa.invalidate({ id: data.conversaId }).catch(() => {});
      }
      setTexto("");
      setIsTyping(false);
      inputRef.current?.focus();
    },
    onError: (err) => {
      console.error("Erro ao enviar mensagem:", err);
      setIsTyping(false);
    },
  });

  const isSending =
    enviarMutation.status === "pending" ||
    Boolean((enviarMutation as any).isLoading) ||
    Boolean((enviarMutation as any).isMutating);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!texto.trim()) return;

    setIsTyping(true);
    enviarMutation.mutate({
      conversaId: conversaAtual ?? undefined,
      mensagem: texto.trim(),
    });
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversaData?.mensagens?.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com animação */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-blue-100 animate-fade-in">
            <Bot className="w-6 h-6 text-blue-600 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
              Hi Assistant
            </h1>
            <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
          </div>
        </div>

        {/* Container do chat com glassmorphism */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Área de mensagens */}
          <div className="h-[65vh] overflow-y-auto p-6 space-y-4 scroll-smooth">
            {loadingConversa && (
              <div className="flex justify-center items-center py-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {conversaData?.mensagens?.length ? (
              conversaData.mensagens.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-end animate-slide-in ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {msg.role !== "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-bounce-subtle">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.conteudo}</div>
                    <div className={`text-xs mt-2 ${msg.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-float">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-700">
                  Olá! Sou o Hi Assistant 👋
                </h3>
                <p className="mt-2 text-gray-500 text-center max-w-md">
                  Digite uma mensagem para começar!
                </p>
              </div>
            )}

            {isTyping && (
              <div className="flex gap-3 items-end justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-bounce-subtle">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-sm shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area com design moderno */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-4 border-t border-gray-200">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder={
                    isAuthenticated
                      ? "Digite sua mensagem..."
                      : "Faça login para usar o chat"
                  }
                  disabled={!isAuthenticated || isSending}
                  className="w-full px-5 py-3 pr-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {texto && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isAuthenticated || isSending || !texto.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                <Send className={`w-5 h-5 transition-transform duration-300 ${isSending ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Chat;
