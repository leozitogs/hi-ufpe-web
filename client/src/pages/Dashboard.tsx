'use client';

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Bell,
  TrendingUp,
  Clock,
  ArrowRight,
  LogOut,
  Home,
  MoreVertical,
  Moon,
  Sun,
  Settings,
  User,
  HelpCircle,
  Zap,
  UserCircle,
  PieChart,
  RefreshCcw
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

/* --------------------------
   Helper: Próxima aula
   -------------------------- */
const calculateNextClass = (horarios: any[] | undefined) => {
  if (!horarios || horarios.length === 0) return "N/A";

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const agora = new Date();
  const diaAtualIndex = agora.getDay() === 0 ? 6 : agora.getDay() - 1;
  const diaAtual = diasSemana[diaAtualIndex];
  const horaAtual = agora.getHours() * 100 + agora.getMinutes();

  let nextClass = null;

  const aulasHoje = horarios
    .filter((h: any) => h.horario.diaSemana === diaAtual)
    .sort((a: any, b: any) =>
      a.horario.horaInicio.localeCompare(b.horario.horaInicio)
    );

  for (const aula of aulasHoje) {
    const horaInicioAula = parseInt(aula.horario.horaInicio.replace(":", ""));
    if (horaInicioAula > horaAtual) {
      nextClass = aula;
      break;
    }
  }

  if (!nextClass) {
    for (let i = 1; i <= 7; i++) {
      const proximoDiaIndex = (diaAtualIndex + i) % diasSemana.length;
      const proximoDia = diasSemana[proximoDiaIndex];

      const aulasProximoDia = horarios
        .filter((h: any) => h.horario.diaSemana === proximoDia)
        .sort((a: any, b: any) =>
          a.horario.horaInicio.localeCompare(b.horario.horaInicio)
        );

      if (aulasProximoDia.length > 0) {
        nextClass = aulasProximoDia[0];
        break;
      }
    }
  }

  if (nextClass) {
    return `${nextClass.horario.horaInicio} • ${nextClass.horario.diaSemana.substring(0, 3)}`;
  }

  return "N/A";
};

/* --------------------------
   Animated counter hook
   -------------------------- */
function useAnimatedNumber(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

/* --------------------------
   Dashboard component
   -------------------------- */
export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // queries (sempre no topo)
  const { data: comunicados } = trpc.comunicados.list.useQuery();
  const { data: matriculas } = trpc.matriculas.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: horarios } = trpc.horarios.listByAluno.useQuery(
    { alunoId: user?.id || "", periodo: user?.periodo || "2025.1" },
    { enabled: isAuthenticated }
  );

  // animated numbers (hooks também no topo)
  const disciplinasCount = useAnimatedNumber(matriculas?.length || 0, 900);
  const comunicadosCount = useAnimatedNumber(comunicados?.length || 0, 900);

  // mounted + theme (hooks)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // accessibility: respect reduce motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    try { localStorage.setItem("theme", newTheme); } catch (e) {}
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  /* ======================
     3D tilt handlers (declarados antes de qualquer early return)
     ====================== */

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleTilt = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const maxDeg = 6; // intensidade moderada
    const rx = ((y - cy) / cy) * maxDeg * -1;
    const ry = ((x - cx) / cx) * maxDeg;

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    el.style.transition = 'transform 120ms linear';
    el.style.willChange = 'transform';
  }, [prefersReducedMotion]);

  const handleLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = '';
    el.style.transition = 'transform 400ms cubic-bezier(.2,.9,.2,1)';
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = 'scale(1.02)';
    el.style.transition = 'transform 160ms ease';
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = '';
    el.style.transition = 'transform 400ms cubic-bezier(.2,.9,.2,1)';
  }, []);

  /* --------------------------
     End of hooks / handlers — safe to return after this
     -------------------------- */

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-yellow-50">
        <Card className="w-full max-w-md shadow-2xl border border-white/40 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-blue-700">Acesso Restrito</CardTitle>
            <CardDescription className="text-center text-blue-600">
              Faça login para acessar o dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mounted) return null;

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  /* Quick actions: removed stripes, added simple CTA button */
  const quickActions = [
    { icon: MessageSquare, title: "Chatbot", description: "Converse com a IA", href: "/chat" },
    { icon: Calendar, title: "Horários", description: "Ver grade horária", href: "/horarios" },
    { icon: TrendingUp, title: "Notas", description: "Acompanhar desempenho", href: "/notas" },
    { icon: Bell, title: "Comunicados", description: "Ver avisos", href: "/comunicados" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-gray-900 overflow-y-auto antialiased">
      {/* Floating glass accents */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-16 w-[520px] h-[520px] rounded-full bg-blue-200/30 mix-blend-multiply blur-3xl animate-blob-slow" />
        <div className="absolute top-24 right-8 w-[420px] h-[420px] rounded-full bg-yellow-200/18 mix-blend-multiply blur-3xl animate-blob-mid" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <div
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-lg transform transition-all duration-300"
              onClick={() => setLocation("/")}
            >
              <span className="text-white font-bold">Hi</span>
            </div>
            <div className="leading-none">
              <div className="text-blue-800 font-bold">UFPE</div> {/* azul conforme solicitado */}
              <div className="text-xs text-blue-600">Hub Inteligente</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="hidden md:flex text-blue-600 hover:bg-blue-50">
              <Home className="h-4 w-4 mr-2" /> <span className="hidden lg:inline">Início</span>
            </Button>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Olá, {user?.name || "Estudante"}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-blue-50 transition-colors">
                  <MoreVertical className="h-5 w-5 text-blue-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setLocation('/profile')}><UserCircle className="mr-2 h-4 w-4" /> Perfil</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation('/settings')}><Settings className="mr-2 h-4 w-4" /> Configurações</DropdownMenuItem>

                {/* Theme toggle as single item (clearer and aligned) */}
                <DropdownMenuItem onSelect={toggleTheme}>
                  { theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" /> }
                  { theme === 'dark' ? 'Tema Claro' : 'Tema Escuro' }
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setLocation('/help')}><HelpCircle className="mr-2 h-4 w-4" /> Ajuda</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main container */}
      <div className="container mx-auto py-8 space-y-8 px-4 relative z-10">
        {/* Welcome + small summary */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Bem-vindo de volta! 👋</h1>
          <p className="text-blue-600">Resumo rápido das suas atividades acadêmicas — interativo e atualizado.</p>
        </div>

        {/* Top stats: removed non-functional labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Disciplinas */}
          <Card
            onMouseMove={handleTilt}
            onMouseLeave={handleLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative overflow-hidden card-tilt group border border-white/40 bg-white/75 backdrop-blur-md shadow-md"
          >
            <CardContent className="p-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Disciplinas</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-bold text-slate-900">{disciplinasCount}</h2>
                    <span className="text-sm text-blue-500">cadastradas</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:scale-110">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Período - removi rótulos não funcionais */}
          <Card
            onMouseMove={handleTilt}
            onMouseLeave={handleLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="card-tilt group border border-white/40 bg-white/75 backdrop-blur-md shadow-md"
          >
            <CardContent className="p-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Período</p>
                  <h2 className="text-3xl font-bold text-slate-900">{user?.periodo || '2025.1'}</h2>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comunicados - removido "Novos/Últimas 48h/Atualizado" */}
          <Card
            onMouseMove={handleTilt}
            onMouseLeave={handleLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="card-tilt group border border-white/40 bg-white/75 backdrop-blur-md shadow-md"
          >
            <CardContent className="p-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Comunicados</p>
                  <h2 className="text-3xl font-bold text-slate-900">{comunicadosCount}</h2>
                </div>
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próxima aula - removido avise-me */}
          <Card
            onMouseMove={handleTilt}
            onMouseLeave={handleLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="card-tilt group border border-white/40 bg-white/75 backdrop-blur-md shadow-md"
          >
            <CardContent className="p-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Próxima Aula</p>
                  <h2 className="text-3xl font-bold text-slate-900">{calculateNextClass(horarios)}</h2>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas — sem linhas, com botão pill animado */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-900">Ações Rápidas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              const accents = ['from-blue-600 to-blue-500','from-indigo-600 to-blue-500','from-cyan-500 to-blue-400','from-teal-500 to-blue-500'];
              const accent = accents[i % accents.length];
              return (
                <article
                  key={i}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  tabIndex={0}
                  role="button"
                  className="relative group cursor-pointer rounded-2xl overflow-hidden border border-white/30 bg-white/85 backdrop-blur-md p-4 shadow-md transition-all duration-300 hover:shadow-2xl focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-900">{a.title}</div>
                      <div className="text-sm text-blue-600 mt-1">{a.description}</div>
                    </div>

                    {/* CTA pill button: simples, sombra + scale on hover */}
                    <div className="ml-3">
                      <button
                        onClick={() => setLocation(a.href)}
                        className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-white border border-transparent shadow-sm hover:shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        aria-label={`Abrir ${a.title}`}
                      >
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Comunicados recentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-slate-900">Comunicados Recentes</h2>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/comunicados")} className="text-blue-600 hover:bg-blue-50">
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {comunicados && comunicados.length > 0 ? (
              comunicados.slice(0, 4).map((c) => (
                <article
                  key={c.id}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="relative overflow-hidden rounded-2xl p-4 border border-white/30 bg-white/80 backdrop-blur-md hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute -left-8 top-6 w-48 h-48 rounded-full bg-blue-100/40 blur-2xl pointer-events-none" />
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{c.titulo}</div>
                      <div className="text-xs text-blue-500 mt-1">Por {c.autor} • {new Date(c.dataPublicacao!).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        c.prioridade === "alta" ? "bg-red-100 text-red-700" : c.prioridade === "media" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                      }`}>{c.prioridade === "alta" ? "Alta" : c.prioridade === "media" ? "Média" : "Baixa"}</span>
                    </div>
                  </header>

                  <p className="mt-3 text-sm text-slate-700 line-clamp-3">{c.conteudo}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <Button size="sm" variant="ghost" onClick={() => setLocation(`/comunicados/${c.id}`)} className="text-blue-700">Ler mais</Button>
                    <div className="ml-auto text-xs text-blue-500">{new Date(c.dataPublicacao!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </article>
              ))
            ) : (
              <Card className="border border-white/30 bg-white/80 backdrop-blur-md">
                <CardContent className="p-8 text-center">
                  <Bell className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-600">Nenhum comunicado no momento</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Scoped styles & animations */}
      <style>{`
        /* Respect user preference for reduced motion */
        .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after {
          animation: none !important;
          transition: none !important;
        }

        /* Background blobs */
        @keyframes blob-slow { 0%,100%{ transform: translate(0,0) scale(1); } 33%{ transform: translate(24px,-30px) scale(1.05);} 66%{ transform: translate(-20px,10px) scale(0.95);} }
        @keyframes blob-mid { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(12px,-18px) scale(1.03);} }
        .animate-blob-slow { animation: blob-slow 14s ease-in-out infinite; }
        .animate-blob-mid { animation: blob-mid 10s ease-in-out infinite; }

        /* small entrance */
        @keyframes pop-up { from { opacity: 0; transform: translateY(8px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .pop { animation: pop-up 420ms cubic-bezier(.2,.9,.2,1) both; }

        /* tilt fallback */
        .card-tilt { transition: transform 300ms cubic-bezier(.2,.9,.2,1), box-shadow 300ms; transform-origin: center; }
        .card-tilt:hover { transform: translateY(-8px) perspective(800px) rotateX(0.6deg) rotateY(-0.6deg); box-shadow: 0 24px 60px rgba(14,65,255,0.06); }

        /* spin slow */
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }

        /* line clamp fallback */
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        @media (max-width: 640px) {
          .backdrop-blur-md { backdrop-filter: blur(6px); }
        }

        /* small accessibility helpers */
        article[role="button"] { min-height: 84px; }
      `}</style>
    </div>
  );
}
