import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Bell } from "lucide-react";
import { useLocation } from "wouter";

export default function Comunicados() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: comunicados } = trpc.comunicados.list.useQuery();

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><Card className="p-6"><Button asChild><a href={getLoginUrl()}>Login</a></Button></Card></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <Bell className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Comunicados</span>
        </div>
      </header>
      <div className="container py-8 space-y-4">
        {comunicados && comunicados.length > 0 ? (
          comunicados.map((com) => (
            <Card key={com.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{com.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Por {com.autor} • {new Date(com.dataPublicacao!).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${com.prioridade === 'alta' ? 'bg-red-100 text-red-700' : com.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{com.prioridade}</span>
                </div>
              </CardHeader>
              <CardContent><p className="text-muted-foreground">{com.conteudo}</p></CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center text-muted-foreground">Nenhum comunicado disponível</Card>
        )}
      </div>
    </div>
  );
}