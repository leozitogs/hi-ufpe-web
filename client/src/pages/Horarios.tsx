import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useLocation } from "wouter";

export default function Horarios() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: horarios } = trpc.horarios.listByAluno.useQuery({ periodo: "2025.1" }, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><Card className="p-6"><Button asChild><a href={getLoginUrl()}>Login</a></Button></Card></div>;
  }

  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <Calendar className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Meus Horários</span>
        </div>
      </header>
      <div className="container py-8 space-y-6">
        {dias.map((dia) => {
          const aulasDoDia = horarios?.filter((h) => h.horario.diaSemana === dia) || [];
          if (aulasDoDia.length === 0) return null;
          return (
            <div key={dia}>
              <h2 className="text-xl font-semibold mb-4">{dia}</h2>
              <div className="space-y-4">
                {aulasDoDia.map((item) => (
                  <Card key={item.horario.id} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.disciplina.nome}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /><span>{item.horario.horaInicio} - {item.horario.horaFim}</span></div>
                      <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>Sala {item.horario.sala}</span></div>
                      <div className="text-sm text-muted-foreground">Prof. {item.professor.nome}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        {!horarios || horarios.length === 0 && <Card className="p-12 text-center text-muted-foreground">Nenhum horário encontrado</Card>}
      </div>
    </div>
  );
}