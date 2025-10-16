import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleProps {
  currentUser: string;
  onBack: () => void;
}

interface ClassItem {
  id: string;
  subject: string;
  professor: string;
  room: string;
  time: string;
  duration: number; // em horas
  type: 'lecture' | 'lab' | 'seminar';
  color: string;
}

interface DaySchedule {
  [key: string]: ClassItem[];
}

export function Schedule({ currentUser, onBack }: ScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [activeView, setActiveView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(0);

  // Dados simulados da agenda
  const weeklySchedule: DaySchedule = {
    'Segunda': [
      {
        id: '1',
        subject: 'Algoritmos e Estruturas de Dados',
        professor: 'Prof. Maria Silva',
        room: 'Sala 201',
        time: '08:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-blue-500'
      },
      {
        id: '2',
        subject: 'Cálculo Diferencial',
        professor: 'Prof. João Santos',
        room: 'Sala 305',
        time: '14:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-green-500'
      }
    ],
    'Terça': [
      {
        id: '3',
        subject: 'Laboratório de Programação',
        professor: 'Prof. Ana Costa',
        room: 'Lab 102',
        time: '10:00',
        duration: 2,
        type: 'lab',
        color: 'bg-purple-500'
      },
      {
        id: '4',
        subject: 'Física Geral',
        professor: 'Prof. Carlos Lima',
        room: 'Sala 403',
        time: '16:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-orange-500'
      }
    ],
    'Quarta': [
      {
        id: '5',
        subject: 'Banco de Dados',
        professor: 'Prof. Fernanda Rocha',
        room: 'Sala 301',
        time: '08:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-red-500'
      },
      {
        id: '6',
        subject: 'Seminário de Pesquisa',
        professor: 'Prof. Roberto Mendes',
        room: 'Auditório 1',
        time: '14:00',
        duration: 1,
        type: 'seminar',
        color: 'bg-indigo-500'
      }
    ],
    'Quinta': [
      {
        id: '7',
        subject: 'Engenharia de Software',
        professor: 'Prof. Lucia Fernandes',
        room: 'Sala 205',
        time: '10:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-teal-500'
      },
      {
        id: '8',
        subject: 'Laboratório de Redes',
        professor: 'Prof. Pedro Oliveira',
        room: 'Lab 205',
        time: '16:00',
        duration: 2,
        type: 'lab',
        color: 'bg-pink-500'
      }
    ],
    'Sexta': [
      {
        id: '9',
        subject: 'Inteligência Artificial',
        professor: 'Prof. Amanda Souza',
        room: 'Sala 401',
        time: '08:00',
        duration: 2,
        type: 'lecture',
        color: 'bg-cyan-500'
      }
    ]
  };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    
    return days.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getClassAtTime = (day: string, time: string) => {
    const daySchedule = weeklySchedule[day] || [];
    return daySchedule.find(classItem => {
      const classHour = parseInt(classItem.time.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return slotHour >= classHour && slotHour < classHour + classItem.duration;
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'Aula';
      case 'lab': return 'Laboratório';
      case 'seminar': return 'Seminário';
      default: return 'Aula';
    }
  };

  const currentWeekDates = getWeekDates(currentWeek);

  const renderWeekView = () => (
    <div className="space-y-4">
      {/* Header da semana */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h3 className="text-gray-800">
              {formatDate(currentWeekDates[0])} - {formatDate(currentWeekDates[4])}
            </h3>
            <p className="text-sm text-gray-600">
              {currentWeek === 0 ? 'Semana atual' : 
               currentWeek > 0 ? `${currentWeek} semana(s) à frente` : 
               `${Math.abs(currentWeek)} semana(s) atrás`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(0)}
        >
          Semana atual
        </Button>
      </div>

      {/* Grade de horários */}
      <div className="grid grid-cols-6 gap-2 text-sm">
        {/* Header dos dias */}
        <div className="p-2 text-center bg-gray-100 rounded-lg">
          <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
          <span className="block text-xs text-gray-600">Horário</span>
        </div>
        {days.map((day, index) => (
          <div key={day} className="p-2 text-center bg-gray-100 rounded-lg">
            <span className="block text-gray-800">{day}</span>
            <span className="block text-xs text-gray-600">
              {formatDate(currentWeekDates[index])}
            </span>
          </div>
        ))}

        {/* Grade de horários */}
        {timeSlots.map(time => (
          <div key={`row-${time}`} className="contents">
            <div className="p-2 text-center bg-gray-50 rounded text-xs text-gray-600 flex items-center justify-center">
              {time}
            </div>
            {days.map(day => {
              const classItem = getClassAtTime(day, time);
              return (
                <div key={`${day}-${time}`} className="p-1 min-h-[60px] flex items-center">
                  {classItem && time === classItem.time && (
                    <Card 
                      className={`w-full ${classItem.color} text-white border-0 shadow-sm`}
                      style={{ minHeight: `${classItem.duration * 60}px` }}
                    >
                      <CardContent className="p-2">
                        <div className="text-xs space-y-1">
                          <div className="text-white truncate">{classItem.subject}</div>
                          <div className="text-white/80 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {classItem.room}
                          </div>
                          <div className="text-white/80 text-xs flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {classItem.professor}
                          </div>
                          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                            {getTypeLabel(classItem.type)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => {
    const selectedDayName = days[selectedDay];
    const dayClasses = weeklySchedule[selectedDayName] || [];
    const selectedDate = currentWeekDates[selectedDay];

    return (
      <div className="space-y-4">
        {/* Seletor de dia */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {days.map((day, index) => (
            <Button
              key={day}
              variant={selectedDay === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(index)}
              className="flex flex-col gap-1 h-auto py-2"
            >
              <span className="text-xs">{day}</span>
              <span className="text-xs opacity-70">
                {formatDate(currentWeekDates[index])}
              </span>
            </Button>
          ))}
        </div>

        {/* Aulas do dia */}
        <div className="space-y-4">
          <h3 className="text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {selectedDayName}, {formatDate(selectedDate)}
          </h3>

          {dayClasses.length > 0 ? (
            <div className="space-y-3">
              {dayClasses.map(classItem => (
                <Card key={classItem.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-4 h-full ${classItem.color} rounded`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-gray-800">{classItem.subject}</h4>
                          <Badge variant="outline">
                            {getTypeLabel(classItem.type)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {classItem.time} - {String(parseInt(classItem.time.split(':')[0]) + classItem.duration).padStart(2, '0')}:00
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {classItem.room}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {classItem.professor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">Nenhuma aula agendada para {selectedDayName}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 relative bg-gray-50">
      <div className="container mx-auto max-w-7xl">
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
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-gray-800">Horários e Salas</h1>
          </div>
        </div>

        {/* Resumo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Agenda de {currentUser}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-gray-800">15</div>
                <div className="text-sm text-gray-600">Disciplinas</div>
              </div>
              <div>
                <div className="text-gray-800">28</div>
                <div className="text-sm text-gray-600">Aulas/semana</div>
              </div>
              <div>
                <div className="text-gray-800">6</div>
                <div className="text-sm text-gray-600">Laboratórios</div>
              </div>
              <div>
                <div className="text-gray-800">08:00-18:00</div>
                <div className="text-sm text-gray-600">Horário</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualização de horários */}
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'week' | 'day')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="week" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Visão Semanal
            </TabsTrigger>
            <TabsTrigger value="day" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Visão Diária
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            {renderWeekView()}
          </TabsContent>

          <TabsContent value="day">
            {renderDayView()}
          </TabsContent>
        </Tabs>

        {/* Legenda */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-sm">Aulas Teóricas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span className="text-sm">Laboratórios</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-500 rounded" />
                <span className="text-sm">Seminários</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}