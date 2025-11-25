import React, { useState, useRef, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../_core/hooks/useAuth";
import { Bot, Send, Sparkles, User, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter"; // Importação necessária para navegação
import { Button } from "@/components/ui/button"; // Importação do botão padrão

const Chat: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useContext();
  const [, setLocation] = useLocation(); // Hook de navegação

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      
      {/* --- NOVO HEADER DE NAVEGAÇÃO (Estilo Horários) --- */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/dashboard")}
            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-lg text-slate-800">Hi Assistant</span>
          </div>
        </div>
      </header>

      {/* Container Principal (com padding-top para compensar o header fixo) */}
      <div className="container mx-auto p-4 pt-8 max-w-4xl">
        
        {/* Container do chat com glassmorphism */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden h-[calc(100vh-140px)] flex flex-col">
          
          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-bounce-subtle shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.conteudo}</div>
                    <div className={`text-[10px] mt-1.5 opacity-70 text-right`}>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <div className="relative group cursor-default">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-float">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-bold text-slate-800">
                  Olá! Sou o Hi Assistant <span className="inline-block animate-wave">👋</span>
                </h3>
                <p className="mt-3 text-slate-500 text-center max-w-md leading-relaxed">
                  Estou aqui para ajudar com suas notas, horários e dúvidas acadêmicas. 
                  <br/>O que você precisa hoje?
                </p>
              </div>
            )}

            {isTyping && (
              <div className="flex gap-3 items-end justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-bounce-subtle">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-bl-sm shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area com design moderno */}
          <div className="bg-white/50 backdrop-blur-sm p-4 border-t border-white/60">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm"></div>
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
                  className="relative w-full px-6 py-3.5 pr-12 rounded-full border border-slate-200 focus:border-blue-400 focus:ring-0 outline-none transition-all duration-300 bg-white/90 shadow-sm text-slate-800 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
                {texto && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isAuthenticated || isSending || !texto.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none group"
              >
                <Send className={`w-5 h-5 transition-transform duration-300 ${isSending ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-10deg); } }

        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2.5s ease-in-out infinite; }
        .animate-wave { animation: wave 1.5s ease-in-out infinite; transform-origin: 70% 70%; }

        .scroll-smooth { scroll-behavior: smooth; }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar { width: 5px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }
      `}</style>
    </div>
  );
};

export default Chat;