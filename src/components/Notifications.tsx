import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, Calendar, BookOpen, AlertTriangle, Users, Trophy, Clock, CheckCircle, X } from 'lucide-react';

interface NotificationsProps {
  currentUser: string;
  onBack: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'assignment' | 'lecture' | 'event' | 'deadline' | 'grade' | 'general';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  dueDate?: string;
  subject?: string;
  professor?: string;
  location?: string;
}

export function Notifications({ currentUser, onBack }: NotificationsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Prova de Inteligência Artificial - Lembrete',
      message: 'A prova de IA será realizada amanhã (19/12) às 14h. Não esqueça de levar calculadora e documento com foto.',
      type: 'exam',
      priority: 'high',
      timestamp: '2024-12-18T10:30:00',
      isRead: false,
      actionRequired: true,
      dueDate: '2024-12-19T14:00:00',
      subject: 'Inteligência Artificial',
      professor: 'Prof. Carlos Eduardo',
      location: 'Sala 401'
    },
    {
      id: '2',
      title: 'Trabalho de Programação Web - Prazo Final',
      message: 'Último dia para entrega do projeto final de Programação Web. Envie através da plataforma até 23h59.',
      type: 'assignment',
      priority: 'high',
      timestamp: '2024-12-18T08:00:00',
      isRead: false,
      actionRequired: true,
      dueDate: '2024-12-20T23:59:00',
      subject: 'Programação Web',
      professor: 'Prof. Fernanda Alves'
    },
    {
      id: '3',
      title: 'Palestra: "Futuro da Computação Quântica"',
      message: 'Palestra especial sobre computação quântica hoje às 16h no Auditório Principal. Palestrante: Dr. Roberto Quantum (MIT).',
      type: 'lecture',
      priority: 'medium',
      timestamp: '2024-12-18T07:45:00',
      isRead: true,
      dueDate: '2024-12-18T16:00:00',
      location: 'Auditório Principal'
    },
    {
      id: '4',
      title: 'Nota Disponível - Engenharia de Software',
      message: 'A nota da segunda unidade de Engenharia de Software já está disponível no sistema. Você obteve 8.7.',
      type: 'grade',
      priority: 'medium',
      timestamp: '2024-12-17T14:20:00',
      isRead: true,
      subject: 'Engenharia de Software',
      professor: 'Prof. Marina Santos'
    },
    {
      id: '5',
      title: 'Seminário de Projeto de Software - Sua Apresentação',
      message: 'Sua apresentação do projeto está agendada para sexta-feira (20/12) às 10h. Tempo: 15 minutos + 5 para perguntas.',
      type: 'event',
      priority: 'high',
      timestamp: '2024-12-17T11:30:00',
      isRead: false,
      actionRequired: true,
      dueDate: '2024-12-20T10:00:00',
      subject: 'Projeto de Software',
      professor: 'Prof. Gabriel Santos',
      location: 'Sala 205'
    },
    {
      id: '6',
      title: 'Workshop: Desenvolvimento com React e Next.js',
      message: 'Inscrições abertas para workshop prático de React e Next.js. Amanhã das 14h às 18h. Vagas limitadas!',
      type: 'event',
      priority: 'medium',
      timestamp: '2024-12-17T09:15:00',
      isRead: true,
      dueDate: '2024-12-19T14:00:00',
      location: 'Lab 102'
    },
    {
      id: '7',
      title: 'Monitoria de Algoritmos - Sessão Extra',
      message: 'Sessão extra de monitoria hoje às 15h para tirar dúvidas sobre árvores binárias e grafos.',
      type: 'general',
      priority: 'low',
      timestamp: '2024-12-18T13:00:00',
      isRead: false,
      location: 'Sala 301'
    },
    {
      id: '8',
      title: 'Hackathon UFPE 2025 - Inscrições Abertas',
      message: 'Inscrições abertas para o Hackathon UFPE 2025! Evento de 48h com prêmios incríveis. Inscreva-se até 15/01.',
      type: 'event',
      priority: 'medium',
      timestamp: '2024-12-16T16:00:00',
      isRead: true,
      dueDate: '2025-01-15T23:59:00'
    },
    {
      id: '9',
      title: 'Trabalho de Computação Gráfica - Entrega Parcial',
      message: 'Lembrete: entrega da primeira parte do projeto de ray tracing até sexta-feira (20/12) às 18h.',
      type: 'assignment',
      priority: 'medium',
      timestamp: '2024-12-16T10:30:00',
      isRead: false,
      actionRequired: true,
      dueDate: '2024-12-20T18:00:00',
      subject: 'Computação Gráfica',
      professor: 'Prof. Helena Lima'
    },
    {
      id: '10',
      title: 'Alteração de Horário - Aula de IA',
      message: 'A aula de IA de quinta-feira (19/12) foi transferida para sexta-feira (20/12) no mesmo horário.',
      type: 'general',
      priority: 'high',
      timestamp: '2024-12-15T15:45:00',
      isRead: true,
      subject: 'Inteligência Artificial',
      professor: 'Prof. Carlos Eduardo'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Calendar className="w-4 h-4" />;
      case 'lecture': return <Users className="w-4 h-4" />;
      case 'event': return <Trophy className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'grade': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Prova';
      case 'assignment': return 'Trabalho';
      case 'lecture': return 'Palestra';
      case 'event': return 'Evento';
      case 'deadline': return 'Prazo';
      case 'grade': return 'Nota';
      default: return 'Geral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Há poucos minutos';
    } else if (diffInHours < 24) {
      return `Há ${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'urgent':
        return notifications.filter(n => n.priority === 'high' || n.actionRequired);
      case 'exams':
        return notifications.filter(n => n.type === 'exam');
      case 'assignments':
        return notifications.filter(n => n.type === 'assignment');
      case 'events':
        return notifications.filter(n => n.type === 'event' || n.type === 'lecture');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'high' || n.actionRequired).length;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 relative bg-gray-50">
      <div className="container mx-auto max-w-4xl">
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
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-gray-800">Notificações</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} nova(s)
              </Badge>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-gray-800 mb-1">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-red-600 mb-1">{unreadCount}</div>
              <div className="text-sm text-gray-600">Não Lidas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-orange-600 mb-1">{urgentCount}</div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">
                {notifications.filter(n => n.actionRequired).length}
              </div>
              <div className="text-sm text-gray-600">Ação Necessária</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Não Lidas
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="urgent">Urgentes</TabsTrigger>
            <TabsTrigger value="exams">Provas</TabsTrigger>
            <TabsTrigger value="assignments">Trabalhos</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification) => (
                  <Card key={notification.id} className={`transition-all ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <CardTitle className={`text-base leading-tight ${!notification.isRead ? 'text-blue-900' : 'text-gray-800'}`}>
                                {notification.title}
                              </CardTitle>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                {notification.priority === 'high' ? 'Alta' : 
                                 notification.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                              </Badge>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Ação Necessária
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <div className="flex gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm mb-3">
                        {notification.message}
                      </CardDescription>
                      
                      {/* Informações adicionais */}
                      {(notification.subject || notification.professor || notification.location || notification.dueDate) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {notification.subject && (
                            <div>
                              <strong>Disciplina:</strong> {notification.subject}
                            </div>
                          )}
                          {notification.professor && (
                            <div>
                              <strong>Professor:</strong> {notification.professor}
                            </div>
                          )}
                          {notification.location && (
                            <div>
                              <strong>Local:</strong> {notification.location}
                            </div>
                          )}
                          {notification.dueDate && (
                            <div className={notification.actionRequired ? 'text-red-600' : ''}>
                              <strong>Data/Hora:</strong> {formatDueDate(notification.dueDate)}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">
                    {activeTab === 'unread' ? 'Todas as notificações foram lidas!' :
                     activeTab === 'urgent' ? 'Nenhuma notificação urgente.' :
                     'Nenhuma notificação encontrada nesta categoria.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Ações rápidas */}
        {notifications.some(n => !n.isRead) && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar Todas como Lidas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}