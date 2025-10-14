import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArrowLeft, AlertTriangle, Calendar, FileText, GraduationCap, Briefcase, Clock } from 'lucide-react';

interface AnnouncementsProps {
  currentUser: string;
  onBack: () => void;
}

interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export function Announcements({ currentUser, onBack }: AnnouncementsProps) {
  const [activeTab, setActiveTab] = useState('urgent');

  // Avisos urgentes
  const urgentAnnouncements: AnnouncementItem[] = [
    {
      id: '1',
      title: 'ATENÇÃO: Último dia para colação de grau',
      description: 'Hoje é o último dia para solicitação de colação de grau do semestre 2024.2. Procure a secretaria até às 17h.',
      date: '2024-12-18',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Prazo final para trancamento de disciplinas',
      description: 'Lembrete: O prazo para trancamento de disciplinas encerra amanhã (19/12). Não perca o prazo!',
      date: '2024-12-17',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Início do período de provas finais',
      description: 'As provas finais começam na próxima segunda-feira (23/12). Consulte os horários na secretaria.',
      date: '2024-12-16',
      priority: 'medium'
    }
  ];

  // Seções do mural principal
  const muralSections = {
    enrollment: {
      title: 'Matrículas e Ajustes',
      icon: <GraduationCap className="w-5 h-5" />,
      announcements: [
        {
          id: 'e1',
          title: 'Divulgação das datas de matrícula para 2025.1',
          description: 'Confira o cronograma completo de matrículas para o próximo semestre letivo.',
          date: '2024-12-15',
          category: 'Matrícula'
        },
        {
          id: 'e2',
          title: 'Lista de disciplinas com vagas remanescentes',
          description: 'Disciplinas com vagas disponíveis após o período regular de matrículas.',
          date: '2024-12-14',
          category: 'Vagas'
        },
        {
          id: 'e3',
          title: 'Procedimento para ajuste de matrícula',
          description: 'Saiba como realizar ajustes na sua matrícula após o período regular.',
          date: '2024-12-10',
          category: 'Ajustes'
        }
      ]
    },
    deadlines: {
      title: 'Prazos e Calendário Acadêmico',
      icon: <Calendar className="w-5 h-5" />,
      announcements: [
        {
          id: 'd1',
          title: 'Calendário acadêmico 2025.1 aprovado',
          description: 'Confira as datas importantes do próximo semestre letivo.',
          date: '2024-12-12',
          category: 'Calendário'
        },
        {
          id: 'd2',
          title: 'Recesso acadêmico de fim de ano',
          description: 'Período de recesso: 23/12/2024 a 07/01/2025.',
          date: '2024-12-08',
          category: 'Recesso'
        },
        {
          id: 'd3',
          title: 'Prazo para entrega de relatórios de estágio',
          description: 'Estudantes em estágio devem entregar relatórios até 20/12/2024.',
          date: '2024-12-05',
          category: 'Estágio'
        }
      ]
    },
    schedules: {
      title: 'Horários e Salas',
      icon: <Clock className="w-5 h-5" />,
      announcements: [
        {
          id: 's1',
          title: 'Alteração de sala - Disciplina Algoritmos',
          description: 'A disciplina Algoritmos II será realizada na sala 301 a partir de segunda-feira.',
          date: '2024-12-16',
          category: 'Mudança'
        },
        {
          id: 's2',
          title: 'Horários de laboratório para 2025.1',
          description: 'Confira os novos horários dos laboratórios de informática.',
          date: '2024-12-11',
          category: 'Laboratório'
        },
        {
          id: 's3',
          title: 'Reserva de auditório para eventos',
          description: 'Novo sistema de reserva de auditórios está disponível.',
          date: '2024-12-09',
          category: 'Reserva'
        }
      ]
    },
    documents: {
      title: 'Documentos e Procedimentos',
      icon: <FileText className="w-5 h-5" />,
      announcements: [
        {
          id: 'doc1',
          title: 'Novo procedimento para solicitação de histórico escolar',
          description: 'Processo simplificado para solicitação de documentos acadêmicos.',
          date: '2024-12-13',
          category: 'Documentos'
        },
        {
          id: 'doc2',
          title: 'Atualização do formulário de requerimento geral',
          description: 'Nova versão do formulário já está disponível online.',
          date: '2024-12-07',
          category: 'Formulários'
        },
        {
          id: 'doc3',
          title: 'Como dar entrada no diploma',
          description: 'Guia completo para solicitação de diploma após formatura.',
          date: '2024-12-06',
          category: 'Diploma'
        }
      ]
    },
    opportunities: {
      title: 'Oportunidades',
      icon: <Briefcase className="w-5 h-5" />,
      announcements: [
        {
          id: 'o1',
          title: 'Abertura de edital para monitoria',
          description: 'Inscrições abertas para programa de monitoria em diversas disciplinas.',
          date: '2024-12-14',
          category: 'Monitoria'
        },
        {
          id: 'o2',
          title: 'Empresa TechCorp busca estagiários',
          description: 'Oportunidade de estágio em desenvolvimento de software.',
          date: '2024-12-12',
          category: 'Estágio'
        },
        {
          id: 'o3',
          title: 'Inscrições abertas para a Semana Acadêmica',
          description: 'Participe da Semana Acadêmica 2025 com palestras e workshops.',
          date: '2024-12-10',
          category: 'Evento'
        }
      ]
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const renderAnnouncementCard = (announcement: AnnouncementItem, showPriority = false) => (
    <Card key={announcement.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-base leading-tight">
            {announcement.title}
          </CardTitle>
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              {formatDate(announcement.date)}
            </span>
            {showPriority && announcement.priority && (
              <Badge variant={getPriorityColor(announcement.priority)} className="text-xs">
                {announcement.priority === 'high' ? 'Urgente' : 
                 announcement.priority === 'medium' ? 'Importante' : 'Informativo'}
              </Badge>
            )}
            {announcement.category && (
              <Badge variant="outline" className="text-xs">
                {announcement.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm">
          {announcement.description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 relative bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h1 className="text-gray-800">Comunicados</h1>
          </div>
        </div>

        {/* Tabs Container */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="urgent" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Avisos Urgentes
            </TabsTrigger>
            <TabsTrigger value="board" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Mural Principal
            </TabsTrigger>
          </TabsList>

          {/* Avisos Urgentes */}
          <TabsContent value="urgent" className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-red-800">Avisos Urgentes</h3>
              </div>
              <p className="text-sm text-red-700">
                Comunicados importantes que requerem atenção imediata dos estudantes.
              </p>
            </div>

            <div className="grid gap-4">
              {urgentAnnouncements.map(announcement => 
                renderAnnouncementCard(announcement, true)
              )}
            </div>
          </TabsContent>

          {/* Mural Principal */}
          <TabsContent value="board" className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-800">Mural Principal</h3>
              </div>
              <p className="text-sm text-blue-700">
                Informações organizadas por categoria para facilitar sua consulta.
              </p>
            </div>

            {/* Seções do Mural */}
            <div className="grid gap-8">
              {Object.entries(muralSections).map(([key, section]) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    {section.icon}
                    <h2 className="text-gray-800">{section.title}</h2>
                  </div>
                  
                  <div className="grid gap-3">
                    {section.announcements.map(announcement => 
                      renderAnnouncementCard(announcement)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}