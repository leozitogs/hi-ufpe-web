import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Clock, MapPin, RefreshCcw } from "lucide-react";
import { useLocation } from "wouter";

export default function Horarios() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // 1. Capturamos o isLoading aqui
  const { data: horarios, isLoading } = trpc.horarios.listByAluno.useQuery(
    { periodo: "2025.1" }, 
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
        <Card className="p-6">
          <Button asChild>
            <a href={getLoginUrl()}>Login</a>
          </Button>
        </Card>
      </div>
    );
  }

  // 2. Tela de Carregamento (Evita o Crash)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5 text-primary">
        <RefreshCcw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg font-medium">Carregando sua grade...</p>
      </div>
    );
  }

  // 3. Ajuste dos nomes para bater com o banco de dados (Feira)
  const dias = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />Voltar
          </Button>
          <Calendar className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Meus Horários</span>
        </div>
      </header>

      <div className="container py-8 space-y-6 px-4">
        {dias.map((dia) => {
          // Filtro robusto: verifica estrutura plana ou aninhada
          const aulasDoDia = horarios?.filter((h: any) => {
            const diaAula = h.diaSemana || h.horario?.diaSemana;
            return diaAula === dia;
          }) || [];

          if (aulasDoDia.length === 0) return null;

          return (
            <div key={dia}>
              <h2 className="text-xl font-semibold mb-4 text-primary">{dia}</h2>
              <div className="space-y-4">
                {aulasDoDia.map((item: any, index: number) => {
                  // Extração segura dos dados
                  const nomeDisciplina = item.disciplina?.nome || item.nome || "Disciplina";
                  const horaInicio = item.horaInicio || item.horario?.horaInicio;
                  const horaFim = item.horaFim || item.horario?.horaFim;
                  const sala = item.sala || item.horario?.sala || item.horario?.local || "S/L";
                  const professor = item.professor?.nome || "A definir";

                  return (
                    <Card key={item.id || index} className="card-hover border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">{nomeDisciplina}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{horaInicio} - {horaFim}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Sala {sala}</span>
                        </div>
                        <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                          Prof. {professor}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {(!horarios || horarios.length === 0) && (
          <Card className="p-12 text-center text-muted-foreground border-dashed bg-transparent">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Nenhum horário encontrado para este período.</p>
          </Card>
        )}
      </div>
    </div>
  );
}