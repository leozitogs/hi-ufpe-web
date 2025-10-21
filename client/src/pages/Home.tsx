import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Calendar,
  TrendingUp,
  Zap,
  Brain,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

/**
 * Home.tsx — versão com Features interativas (sem botão "Abrir")
 * - Cards mostram título + descrição por padrão
 * - Ao hover / focus: card eleva, ícone ganha destaque e aparece uma info extra (exemplo)
 * - A ação "Abrir" foi removida, mantendo o componente meramente informativo
 */

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: "Chatbot Inteligente",
      description: "Tire dúvidas sobre horários, notas e informações acadêmicas com IA",
      example: 'Ex.: "Quais são minhas aulas hoje?"'
    },
    {
      icon: Calendar,
      title: "Horários Organizados",
      description: "Visualize sua grade horária de forma clara e responsiva",
      example: 'Ex.: "Mostrar grade da semana"'
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento de Notas",
      description: "Monitore seu desempenho acadêmico em tempo real",
      example: 'Ex.: "Qual minha média em Cálculo?"'
    },
    {
      icon: Zap,
      title: "Comunicados Instantâneos",
      description: "Receba avisos importantes da universidade imediatamente",
      example: 'Ex.: "Há algum comunicado novo?"'
    },
    {
      icon: Brain,
      title: "Interface Intuitiva",
      description: "Design pensado para facilitar sua navegação acadêmica",
      example: 'Dica: explore o painel lateral para atalhos'
    },
    {
      icon: Clock,
      title: "Informações em Tempo Real",
      description: "Dados sempre atualizados sobre sua vida acadêmica",
      example: 'Ex.: "Próxima aula hoje"'
    }
  ];

  const benefits = [
    "Interface moderna e responsiva",
    "Acesso rápido às informações",
    "Chatbot com inteligência artificial",
    "Notificações em tempo real",
    "Otimizado para todos os dispositivos",
    "Experiência acadêmica superior"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-gray-900 overflow-hidden">
      {/* Decorative floating blobs */}
      <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-8 w-96 h-96 rounded-full bg-blue-200/30 mix-blend-multiply filter blur-3xl animate-blob-slow"></div>
        <div className="absolute top-28 right-6 w-80 h-80 rounded-full bg-yellow-200/18 mix-blend-multiply filter blur-3xl animate-blob-mid"></div>
        <div className="absolute -bottom-12 left-24 w-72 h-72 rounded-full bg-indigo-200/15 mix-blend-multiply filter blur-3xl animate-blob-fast"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/60 bg-white/75 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            role="button"
            onClick={() => setLocation("/")}
            aria-label="Ir para a página inicial Hi UFPE"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center group-hover:shadow-lg transition-transform duration-300 transform-gpu">
              <span className="text-white font-bold text-lg select-none">Hi</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl text-blue-700">UFPE</span>
              <span className="text-xs text-blue-500 -mt-0.5">Hub Inteligente</span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <button
              className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setLocation("/dashboard")}
              aria-label="Entrar no dashboard"
            >
              Entrar
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-20 md:py-28 px-4 relative z-10">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-xl animate-appear-up">
            <div className="inline-block">
              <span className="bg-white/70 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-white/40 flex items-center gap-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Hub Inteligente UFPE
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Sua vida acadêmica{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400">
                simplificada
              </span>
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed">
              Acesse horários, notas e comunicados com uma interface moderna e intuitiva.
              Converse com nosso assistente inteligente e tenha todas as informações na palma da mão.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setLocation("/dashboard")}
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold shadow-lg transform-gpu hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Começar agora no Hi UFPE"
              >
                Começar Agora <ArrowRight className="ml-3 w-5 h-5" />
              </button>

              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg border border-blue-200 text-blue-700 hover:bg-white/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Saber mais sobre funcionalidades"
              >
                Saiba Mais
              </button>
            </div>
          </div>

          <div className="relative animate-appear-right">
            <div
              className="absolute inset-0 rounded-2xl blur-2xl"
              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.06), rgba(250,204,21,0.04))" }}
              aria-hidden
            />
            <Card className="relative border border-white/40 bg-white/70 backdrop-blur-md hover:shadow-2xl transition-transform duration-400 transform-gpu hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-sm">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">Chatbot IA</div>
                    <div className="text-sm text-blue-600">Online agora</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-800">Quais são meus horários de hoje?</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm text-gray-800">Você tem 3 aulas hoje: Cálculo às 8h, Programação às 10h e Física às 14h 📚</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-1" aria-hidden>
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.12s" }}></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: "0.24s" }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============================
              FEATURES — INTERACTIVE (NO BUTTON)
           ============================ */}
        <section id="features" className="mt-12 animate-appear-up">
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              Recursos <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">Principais</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Passe o cursor ou navegue por teclado para ver mais detalhes — informativo, sem navegação direta.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <article
                  key={idx}
                  tabIndex={0}
                  role="article"
                  aria-label={`${f.title} — ${f.description}`}
                  className="feature-card group relative rounded-2xl p-6 cursor-default border border-white/40 bg-white/75 backdrop-blur-md transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon with interactive effects */}
                    <div className="feature-icon flex-shrink-0 rounded-lg h-14 w-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-focus:scale-110">
                      <Icon className="h-7 w-7 text-white transition-transform duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-blue-800">{f.title}</h3>
                      <p className="text-sm text-blue-600 mt-1 leading-snug">{f.description}</p>

                      {/* Extra info revealed on hover/focus (informational only) */}
                      <div className="feature-extra mt-3 text-sm text-gray-700 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-focus:opacity-100 group-hover:max-h-40 group-focus:max-h-40">
                        <div className="rounded-md bg-blue-50/60 px-3 py-2 border border-blue-100 text-blue-800">
                          <strong className="text-xs text-blue-600">Exemplo:</strong> <span className="ml-2">{f.example}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative right accent that becomes visible on hover */}
                  <div aria-hidden className="absolute right-4 top-4 hidden h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:block group-focus:block transition-opacity duration-300"></div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-16 grid lg:grid-cols-2 gap-10 items-center animate-appear-up">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Por que escolher o <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">Hi UFPE</span>?
            </h2>
            <p className="text-lg text-gray-700 mt-3">
              Desenvolvido pensando na experiência do estudante, com foco em usabilidade, velocidade e acessibilidade.
            </p>

            <div className="mt-6 space-y-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-800">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setLocation("/dashboard")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Experimentar Agora
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border border-white/40 bg-white/70 backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-700">✨</div>
              <div className="text-sm text-blue-600">Design Moderno</div>
            </Card>
            <Card className="p-6 border border-white/40 bg-white/70 backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-700">⚡</div>
              <div className="text-sm text-blue-600">Muito Rápido</div>
            </Card>
            <Card className="p-6 border border-white/40 bg-white/70 backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-700">📱</div>
              <div className="text-sm text-blue-600">Responsivo</div>
            </Card>
            <Card className="p-6 border border-white/40 bg-white/70 backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-700">🤖</div>
              <div className="text-sm text-blue-600">Assistente IA</div>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 animate-appear-up">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-2xl">
            <CardContent className="p-10 text-center relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold">Pronto para transformar sua experiência acadêmica?</h2>
              <p className="text-lg mt-2 opacity-90">Comece a usar o Hi UFPE e descubra uma nova forma de gerenciar sua vida acadêmica</p>
              <div className="mt-6">
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-slate-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Começar Gratuitamente <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/40 bg-white/75 backdrop-blur-md">
        <div className="container mx-auto py-10 px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">Hi</span>
                </div>
                <span className="font-semibold text-blue-800">UFPE</span>
            </div>
              <p className="text-sm text-blue-600">Hub Inteligente para estudantes da UFPE</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-blue-800">Recursos</h4>
              <ul className="space-y-2 text-sm text-blue-600">
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Chatbot IA</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Horários</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Notas</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Comunicados</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-blue-800">Suporte</h4>
              <ul className="space-y-2 text-sm text-blue-600">
                <li className="hover:text-blue-800 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Documentação</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Contato</li>
                <li className="hover:text-blue-800 transition-colors cursor-pointer">Status</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-blue-800">Desenvolvido por</h4>
              <p className="text-sm text-blue-600 mb-3">Equipe <span className="text-blue-700 font-semibold">sCina</span></p>
              <div className="flex gap-3">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/40 pt-6 text-center text-sm text-blue-600">
            <p>© {new Date().getFullYear()} Hi UFPE. Desenvolvido com ❤️ pela equipe sCina para estudantes da UFPE.</p>
          </div>
        </div>
      </footer>

      {/* Component styles */}
      <style>{`
        /* Respect user preference for reduced motion */
        .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
          animation: none !important;
          transition: none !important;
        }

        /* Blob animations */
        @keyframes blob-slow {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          33% { transform: translateY(-30px) translateX(20px) scale(1.05); }
          66% { transform: translateY(20px) translateX(-10px) scale(0.95); }
        }
        @keyframes blob-mid {
          0%,100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-18px) translateX(12px) scale(1.03); }
        }
        @keyframes blob-fast {
          0%,100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-8px) translateX(6px) scale(1.02); }
        }
        .animate-blob-slow { animation: blob-slow 12s ease-in-out infinite; }
        .animate-blob-mid { animation: blob-mid 9s ease-in-out infinite; }
        .animate-blob-fast { animation: blob-fast 7s ease-in-out infinite; }

        /* Appear */
        @keyframes appear-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes appear-right { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        .animate-appear-up { animation: appear-up 0.7s cubic-bezier(.2,.9,.2,1) both; }
        .animate-appear-right { animation: appear-right 0.7s cubic-bezier(.2,.9,.2,1) both; }

        /* Feature card base */
        .feature-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 1rem;
          transition: transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms, border-color 260ms;
          will-change: transform;
        }

        /* Hover / focus interactions — purely visual (no navigation) */
        .feature-card:focus, .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 50px rgba(14,65,255,0.08);
          border-color: rgba(59,130,246,0.16);
        }

        /* Icon circle */
        .feature-icon {
          background: linear-gradient(135deg, rgba(14,165,233,1) 0%, rgba(59,130,246,1) 100%);
          box-shadow: 0 8px 24px rgba(59,130,246,0.12);
          transition: transform 260ms ease, box-shadow 260ms ease, filter 260ms ease;
        }
        .feature-card:hover .feature-icon, .feature-card:focus .feature-icon {
          transform: scale(1.12) translateZ(0);
          filter: brightness(1.03);
          box-shadow: 0 16px 40px rgba(59,130,246,0.16);
        }

        /* Extra info reveal */
        .feature-extra {
          transition: all 300ms cubic-bezier(.2,.9,.2,1);
        }
        .feature-card .feature-extra { opacity: 0; max-height: 0; transform: translateY(-4px); }
        .feature-card:hover .feature-extra, .feature-card:focus .feature-extra {
          opacity: 1;
          max-height: 200px;
          transform: translateY(0);
        }

        /* Decorative accent dot becomes visible on hover/focus */
        .feature-card .absolute.right-4.top-4 {
          opacity: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .feature-card { gap: 0.75rem; padding: 1rem; }
          .feature-icon { height: 48px; width: 48px; }
        }

        /* Softer shadow utility */
        .shadow-2xl { box-shadow: 0 18px 40px rgba(2,6,23,0.08); }
      `}</style>
    </div>
  );
}
