import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Upload, FileSpreadsheet, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'professor' && user?.role !== 'secgrad')) {
    return <div className="min-h-screen flex items-center justify-center"><Card className="p-6"><p className="mb-4">Acesso restrito a administradores</p><Button asChild><a href={getLoginUrl()}>Login</a></Button></Card></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <Upload className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Painel Administrativo</span>
        </div>
      </header>
      <div className="container py-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-hover cursor-pointer">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />Upload de Planilhas</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Envie planilhas de horários, notas ou alunos</p><Button className="mt-4">Selecionar Arquivo</Button></CardContent>
          </Card>
          <Card className="card-hover cursor-pointer">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Criar Comunicado</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">Publique avisos e comunicados</p><Button className="mt-4" onClick={() => alert('Funcionalidade em desenvolvimento')}>Novo Comunicado</Button></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
