import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ArrowLeft, User, GraduationCap, CreditCard, FileText, Award, Calendar, Phone, Mail, MapPin, Clock } from 'lucide-react';

interface StudentInfoProps {
  currentUser: string;
  onBack: () => void;
}

interface Grade {
  subject: string;
  code: string;
  credits: number;
  grade: number;
  status: 'approved' | 'failed' | 'enrolled' | 'withdrawn';
  semester: string;
  professor: string;
}

interface Payment {
  id: string;
  month: string;
  value: number;
  dueDate: string;
  paymentDate?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export function StudentInfo({ currentUser, onBack }: StudentInfoProps) {
  const [activeTab, setActiveTab] = useState('personal');

  // Dados pessoais simulados
  const studentData = {
    fullName: 'Ana Carolina Silva Santos',
    registration: '202401234567',
    course: 'Ciência da Computação',
    period: '6º Período',
    admission: '2022.1',
    expectedGraduation: '2025.2',
    email: 'ana.silva@estudante.ufpe.br',
    phone: '(81) 99999-8888',
    address: 'Rua das Flores, 123 - Boa Viagem, Recife/PE',
    birthDate: '15/03/2001',
    cpf: '123.456.789-00',
    rg: '1234567 SSP/PE',
    advisor: 'Prof. Dr. Roberto Silva',
    status: 'Matriculado Regular'
  };

  // Histórico de notas por período
  const academicHistory: { [key: string]: Grade[] } = {
    '2022.1': [
      { subject: 'Introdução à Computação', code: 'IF668', credits: 4, grade: 8.5, status: 'approved', semester: '2022.1', professor: 'Prof. João Lima' },
      { subject: 'Cálculo 1', code: 'MA026', credits: 4, grade: 7.2, status: 'approved', semester: '2022.1', professor: 'Prof. Maria Costa' },
      { subject: 'Álgebra Linear', code: 'MA531', credits: 4, grade: 6.8, status: 'approved', semester: '2022.1', professor: 'Prof. Carlos Santos' },
      { subject: 'Física 1', code: 'FI285', credits: 4, grade: 7.8, status: 'approved', semester: '2022.1', professor: 'Prof. Ana Ferreira' },
    ],
    '2022.2': [
      { subject: 'Programação 1', code: 'IF669', credits: 4, grade: 9.2, status: 'approved', semester: '2022.2', professor: 'Prof. Pedro Silva' },
      { subject: 'Cálculo 2', code: 'MA027', credits: 4, grade: 6.5, status: 'approved', semester: '2022.2', professor: 'Prof. Lucia Rocha' },
      { subject: 'Matemática Discreta', code: 'IF670', credits: 4, grade: 8.0, status: 'approved', semester: '2022.2', professor: 'Prof. Rafael Mendes' },
      { subject: 'Física 2', code: 'FI286', credits: 4, grade: 5.8, status: 'failed', semester: '2022.2', professor: 'Prof. Fernanda Lima' },
    ],
    '2023.1': [
      { subject: 'Estruturas de Dados', code: 'IF672', credits: 4, grade: 8.8, status: 'approved', semester: '2023.1', professor: 'Prof. Amanda Costa' },
      { subject: 'Programação 2', code: 'IF671', credits: 4, grade: 9.0, status: 'approved', semester: '2023.1', professor: 'Prof. Roberto Dias' },
      { subject: 'Física 2', code: 'FI286', credits: 4, grade: 7.0, status: 'approved', semester: '2023.1', professor: 'Prof. Marcos Silva' },
      { subject: 'Probabilidade', code: 'ET586', credits: 4, grade: 7.5, status: 'approved', semester: '2023.1', professor: 'Prof. Carla Santos' },
    ],
    '2023.2': [
      { subject: 'Algoritmos e Estruturas de Dados', code: 'IF673', credits: 4, grade: 8.5, status: 'approved', semester: '2023.2', professor: 'Prof. Luis Ferreira' },
      { subject: 'Banco de Dados', code: 'IF685', credits: 4, grade: 8.2, status: 'approved', semester: '2023.2', professor: 'Prof. Julia Lima' },
      { subject: 'Sistemas Operacionais', code: 'IF677', credits: 4, grade: 7.8, status: 'approved', semester: '2023.2', professor: 'Prof. Diego Costa' },
      { subject: 'Estatística', code: 'ET586', credits: 4, grade: 6.9, status: 'approved', semester: '2023.2', professor: 'Prof. Patricia Rocha' },
    ],
    '2024.1': [
      { subject: 'Redes de Computadores', code: 'IF678', credits: 4, grade: 8.0, status: 'approved', semester: '2024.1', professor: 'Prof. Ricardo Silva' },
      { subject: 'Engenharia de Software', code: 'IF682', credits: 4, grade: 8.7, status: 'approved', semester: '2024.1', professor: 'Prof. Marina Santos' },
      { subject: 'Compiladores', code: 'IF688', credits: 4, grade: 7.3, status: 'approved', semester: '2024.1', professor: 'Prof. André Lima' },
      { subject: 'Interface Humano-Computador', code: 'IF679', credits: 4, grade: 9.1, status: 'approved', semester: '2024.1', professor: 'Prof. Beatriz Costa' },
    ],
    '2024.2': [
      { subject: 'Inteligência Artificial', code: 'IF684', credits: 4, grade: 0, status: 'enrolled', semester: '2024.2', professor: 'Prof. Carlos Eduardo' },
      { subject: 'Programação Web', code: 'IF686', credits: 4, grade: 0, status: 'enrolled', semester: '2024.2', professor: 'Prof. Fernanda Alves' },
      { subject: 'Projeto de Software', code: 'IF687', credits: 4, grade: 0, status: 'enrolled', semester: '2024.2', professor: 'Prof. Gabriel Santos' },
      { subject: 'Computação Gráfica', code: 'IF680', credits: 4, grade: 0, status: 'enrolled', semester: '2024.2', professor: 'Prof. Helena Lima' },
    ]
  };

  // Histórico de pagamentos
  const paymentHistory: Payment[] = [
    { id: '1', month: 'Janeiro 2024', value: 1850.00, dueDate: '2024-01-10', paymentDate: '2024-01-08', status: 'paid' },
    { id: '2', month: 'Fevereiro 2024', value: 1850.00, dueDate: '2024-02-10', paymentDate: '2024-02-09', status: 'paid' },
    { id: '3', month: 'Março 2024', value: 1850.00, dueDate: '2024-03-10', paymentDate: '2024-03-12', status: 'paid' },
    { id: '4', month: 'Abril 2024', value: 1850.00, dueDate: '2024-04-10', paymentDate: '2024-04-07', status: 'paid' },
    { id: '5', month: 'Maio 2024', value: 1850.00, dueDate: '2024-05-10', paymentDate: '2024-05-10', status: 'paid' },
    { id: '6', month: 'Junho 2024', value: 1850.00, dueDate: '2024-06-10', paymentDate: '2024-06-11', status: 'paid' },
    { id: '7', month: 'Julho 2024', value: 1850.00, dueDate: '2024-07-10', paymentDate: '2024-07-09', status: 'paid' },
    { id: '8', month: 'Agosto 2024', value: 1850.00, dueDate: '2024-08-10', paymentDate: '2024-08-08', status: 'paid' },
    { id: '9', month: 'Setembro 2024', value: 1850.00, dueDate: '2024-09-10', paymentDate: '2024-09-10', status: 'paid' },
    { id: '10', month: 'Outubro 2024', value: 1850.00, dueDate: '2024-10-10', paymentDate: '2024-10-09', status: 'paid' },
    { id: '11', month: 'Novembro 2024', value: 1850.00, dueDate: '2024-11-10', paymentDate: '2024-11-08', status: 'paid' },
    { id: '12', month: 'Dezembro 2024', value: 1850.00, dueDate: '2024-12-10', status: 'pending' },
  ];

  // Cálculos acadêmicos
  const calculateGPA = () => {
    const completedSubjects = Object.values(academicHistory)
      .flat()
      .filter(grade => grade.status === 'approved' || grade.status === 'failed');
    
    if (completedSubjects.length === 0) return 0;
    
    const totalPoints = completedSubjects.reduce((sum, grade) => sum + (grade.grade * grade.credits), 0);
    const totalCredits = completedSubjects.reduce((sum, grade) => sum + grade.credits, 0);
    
    return totalPoints / totalCredits;
  };

  const calculateProgress = () => {
    const totalSubjects = Object.values(academicHistory).flat();
    const completedSubjects = totalSubjects.filter(grade => grade.status === 'approved');
    const totalCreditsNeeded = 160; // Total de créditos do curso
    const completedCredits = completedSubjects.reduce((sum, grade) => sum + grade.credits, 0);
    
    return {
      completedCredits,
      totalCreditsNeeded,
      percentage: (completedCredits / totalCreditsNeeded) * 100,
      approvedSubjects: completedSubjects.length,
      totalSubjects: totalSubjects.filter(grade => grade.status !== 'enrolled').length
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'failed': return 'destructive';
      case 'enrolled': return 'secondary';
      case 'withdrawn': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'failed': return 'Reprovado';
      case 'enrolled': return 'Cursando';
      case 'withdrawn': return 'Trancado';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const progress = calculateProgress();
  const gpa = calculateGPA();

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
            <User className="w-6 h-6 text-blue-600" />
            <h1 className="text-gray-800">Informações do Aluno</h1>
          </div>
        </div>

        {/* Resumo do Estudante */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {studentData.fullName}
                </CardTitle>
                <CardDescription className="mt-1">
                  Matrícula: {studentData.registration} • {studentData.course} • {studentData.period}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {studentData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl text-gray-800 mb-1">{gpa.toFixed(2)}</div>
                <div className="text-sm text-gray-600">CRA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-gray-800 mb-1">{progress.completedCredits}</div>
                <div className="text-sm text-gray-600">Créditos Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-gray-800 mb-1">{progress.percentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Progresso do Curso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-gray-800 mb-1">{studentData.expectedGraduation}</div>
                <div className="text-sm text-gray-600">Previsão de Formatura</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso do Curso</span>
                <span>{progress.completedCredits}/{progress.totalCreditsNeeded} créditos</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Informações */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Pessoais
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
          </TabsList>

          {/* Informações Pessoais */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Nome Completo:</span>
                    <span className="col-span-2 text-gray-800">{studentData.fullName}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Data de Nascimento:</span>
                    <span className="col-span-2 text-gray-800">{studentData.birthDate}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">CPF:</span>
                    <span className="col-span-2 text-gray-800">{studentData.cpf}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">RG:</span>
                    <span className="col-span-2 text-gray-800">{studentData.rg}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">{studentData.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span className="text-sm text-gray-800">{studentData.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Acadêmicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Matrícula:</span>
                    <span className="col-span-2 text-gray-800">{studentData.registration}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Curso:</span>
                    <span className="col-span-2 text-gray-800">{studentData.course}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Período Atual:</span>
                    <span className="col-span-2 text-gray-800">{studentData.period}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Ingresso:</span>
                    <span className="col-span-2 text-gray-800">{studentData.admission}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">Orientador:</span>
                    <span className="col-span-2 text-gray-800">{studentData.advisor}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Histórico Acadêmico */}
          <TabsContent value="academic" className="space-y-6">
            {Object.entries(academicHistory).reverse().map(([semester, grades]) => (
              <Card key={semester}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{semester}</span>
                    <Badge variant="outline">
                      {grades.filter(g => g.status === 'approved').length}/{grades.length} Aprovado(s)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grades.map((grade, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-800">{grade.subject}</span>
                            <Badge variant="outline" className="text-xs">
                              {grade.code}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {grade.professor} • {grade.credits} créditos
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {grade.status !== 'enrolled' && (
                            <div className="text-right">
                              <div className="text-gray-800">{grade.grade.toFixed(1)}</div>
                              <div className="text-xs text-gray-600">Nota</div>
                            </div>
                          )}
                          <Badge variant={getStatusColor(grade.status)}>
                            {getStatusText(grade.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Situação Financeira */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-green-700">Mensalidades Pagas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-700 mb-1">11</div>
                  <div className="text-sm text-gray-600">de 12 mensalidades</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-orange-700">Valor Total Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-orange-700 mb-1">R$ 20.350</div>
                  <div className="text-sm text-gray-600">em 2024</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-blue-700">Próximo Vencimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-blue-700 mb-1">10/12</div>
                  <div className="text-sm text-gray-600">R$ 1.850,00</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de Pagamentos 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-800">{payment.month}</span>
                          <Badge variant={getPaymentStatusColor(payment.status)}>
                            {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Vencimento: {payment.dueDate.split('-').reverse().join('/')}
                          {payment.paymentDate && ` • Pago em: ${payment.paymentDate.split('-').reverse().join('/')}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800">R$ {payment.value.toFixed(2).replace('.', ',')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Documentos Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Histórico Escolar Completo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Declaração de Matrícula
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Comprovante de Rendimento
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório de Integralização
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Solicitações Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-800">Histórico Escolar</div>
                      <div className="text-xs text-gray-600">Solicitado em 10/12/2024</div>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Processando
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-800">Declaração de Matrícula</div>
                      <div className="text-xs text-gray-600">Solicitado em 05/12/2024</div>
                    </div>
                    <Badge variant="default">
                      Concluído
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm text-blue-800 mb-1">Renovação de Matrícula</h4>
                  <p className="text-sm text-blue-700">
                    O período de renovação de matrícula para 2025.1 será de 15 a 25 de janeiro de 2025.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm text-green-800 mb-1">Situação Regular</h4>
                  <p className="text-sm text-green-700">
                    Sua matrícula está regular e você está apto para cursar o próximo período.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm text-yellow-800 mb-1">Pendência Financeira</h4>
                  <p className="text-sm text-yellow-700">
                    Mensalidade de dezembro/2024 com vencimento em 10/12/2024.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}