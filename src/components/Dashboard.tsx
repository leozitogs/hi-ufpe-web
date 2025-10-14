import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { LogOut, Bell, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { DayProgressCircle } from './DayProgressCircle';
import { SmartSearch } from './SmartSearch';

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
  onNavigate: (optionId: string) => void;
}

export function Dashboard({ currentUser, onLogout, onNavigate }: DashboardProps) {
  const dashboardOptions = [
    {
      id: 'chatbox',
      title: 'Chatbox',
      description: 'Converse com nossa IA assistente',
      image: 'https://images.unsplash.com/photo-1725798451557-fc60db3eb6a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0Ym90JTIwY29udmVyc2F0aW9uJTIwYnViYmxlfGVufDF8fHx8MTc1ODY2ODY4Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'schedule',
      title: 'Consultar Horários e Salas',
      description: 'Visualize seus horários e salas de aula',
      image: 'https://images.unsplash.com/photo-1617131633412-39437b40a16b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hlZHVsZSUyMGNhbGVuZGFyJTIwY2xvY2t8ZW58MXx8fHwxNzU4NjY4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'student-info',
      title: 'Informações do Aluno',
      description: 'Acesse suas informações acadêmicas',
      image: 'https://images.unsplash.com/photo-1659080907168-d567d70d27ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaW5mb3JtYXRpb24lMjBwcm9maWxlfGVufDF8fHx8MTc1ODY2ODY4Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'announcements',
      title: 'Comunicados',
      description: 'Veja as últimas notícias e comunicados',
      image: 'https://images.unsplash.com/photo-1710392046859-dba4aa3cd0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5vdW5jZW1lbnRzJTIwbWVnYXBob25lJTIwbm90aWNlfGVufDF8fHx8MTc1ODY2ODY4M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'chatbox') {
      onNavigate('chatbox');
    } else if (optionId === 'announcements') {
      onNavigate('announcements');
    } else if (optionId === 'schedule') {
      onNavigate('schedule');
    } else if (optionId === 'student-info') {
      onNavigate('student-info');
    } else if (optionId === 'notifications') {
      onNavigate('notifications');
    } else {
      // Outras funcionalidades serão implementadas em breve
      alert(`Funcionalidade "${optionId}" será implementada em breve!`);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 relative bg-gray-50">
      {/* Header com nome do usuário e botão de logout */}
      <div className="container mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-gray-800 mb-2">Bem-vindo, {currentUser}!</h1>
            <p className="text-gray-600">
              Seu hub acadêmico inteligente
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => handleOptionClick('notifications')}
              className="flex items-center gap-2 relative"
            >
              <Bell className="w-4 h-4" />
              Notificações
              <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0">
                5
              </Badge>
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Círculo de progresso do dia */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-gray-800 mb-4">Progresso do Dia</h2>
          <DayProgressCircle className="bg-white rounded-xl p-6 shadow-sm" />
        </div>

        {/* Cards de informações importantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-800 mb-2">Próxima Aula</h3>
              <p className="text-sm text-gray-600 mb-1">Inteligência Artificial</p>
              <p className="text-xs text-blue-600">Hoje às 14:00 - Sala 401</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-800 mb-2">Trabalhos Pendentes</h3>
              <p className="text-sm text-gray-600 mb-1">2 entregas</p>
              <p className="text-xs text-orange-600">Prog. Web até amanhã</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-red-600" />
                <Badge variant="destructive" className="ml-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  5
                </Badge>
              </div>
              <h3 className="text-gray-800 mb-2">Notificações</h3>
              <p className="text-sm text-gray-600 mb-1">5 não lidas</p>
              <p className="text-xs text-red-600">3 urgentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Busca Rápida */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-gray-800 mb-6">Busca Rápida</h2>
          <SmartSearch onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}