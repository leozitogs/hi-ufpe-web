import { useState } from 'react';
import { LoginSection } from './components/LoginSection';
import { RegisterSection } from './components/RegisterSection';
import { Dashboard } from './components/Dashboard';
import { ChatBox } from './components/ChatBox';
import { Announcements } from './components/Announcements';
import { Schedule } from './components/Schedule';
import { StudentInfo } from './components/StudentInfo';
import { Notifications } from './components/Notifications';
import { BottomNavigation } from './components/BottomNavigation';
import { Button } from './components/ui/button';
import { ArrowLeft } from 'lucide-react';
import backgroundImage from "./assets/bg.png";

type ViewState = 'login' | 'register' | 'dashboard' | 'chatbox' | 'announcements' | 'schedule' | 'student-info' | 'notifications';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [registeredUsers, setRegisteredUsers] = useState<{[key: string]: string}>({
    admin: 'admin123' // usuário padrão para teste
  });

  const handleLogin = (username: string, password: string) => {
    // Simula verificação de login
    if (registeredUsers[username] && registeredUsers[username] === password) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      setCurrentView('dashboard');
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleRegister = (username: string, password: string, confirmPassword: string) => {
    // Verifica se o usuário já existe
    if (registeredUsers[username]) {
      alert('Este usuário já existe');
      return;
    }

    // Adiciona novo usuário
    setRegisteredUsers(prev => ({
      ...prev,
      [username]: password
    }));
    
    // Volta para a tela de login após criar conta
    setCurrentView('login');
  };

  const showRegisterView = () => {
    setCurrentView('register');
  };

  const showLoginView = () => {
    setCurrentView('login');
  };

  const showChatBox = () => {
    setCurrentView('chatbox');
  };

  const showAnnouncements = () => {
    setCurrentView('announcements');
  };

  const showSchedule = () => {
    setCurrentView('schedule');
  };

  const showStudentInfo = () => {
    setCurrentView('student-info');
  };

  const showNotifications = () => {
    setCurrentView('notifications');
  };

  const showDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen relative">
      {/* Dashboard (após login) */}
      {currentView === 'dashboard' && isLoggedIn && (
        <Dashboard 
          currentUser={currentUser!}
          onLogout={handleLogout}
          onNavigate={(optionId) => {
            if (optionId === 'chatbox') {
              showChatBox();
            } else if (optionId === 'announcements') {
              showAnnouncements();
            } else if (optionId === 'schedule') {
              showSchedule();
            } else if (optionId === 'student-info') {
              showStudentInfo();
            } else if (optionId === 'notifications') {
              showNotifications();
            }
          }}
        />
      )}

      {/* ChatBox */}
      {currentView === 'chatbox' && isLoggedIn && (
        <ChatBox 
          currentUser={currentUser!}
          onBack={showDashboard}
        />
      )}

      {/* Announcements */}
      {currentView === 'announcements' && isLoggedIn && (
        <Announcements 
          currentUser={currentUser!}
          onBack={showDashboard}
        />
      )}

      {/* Schedule */}
      {currentView === 'schedule' && isLoggedIn && (
        <Schedule 
          currentUser={currentUser!}
          onBack={showDashboard}
        />
      )}

      {/* Student Info */}
      {currentView === 'student-info' && isLoggedIn && (
        <StudentInfo 
          currentUser={currentUser!}
          onBack={showDashboard}
        />
      )}

      {/* Notifications */}
      {currentView === 'notifications' && isLoggedIn && (
        <Notifications 
          currentUser={currentUser!}
          onBack={showDashboard}
        />
      )}

      {/* Bottom Navigation - Aparece em todas as telas após login */}
      {isLoggedIn && (
        <BottomNavigation
          currentView={currentView}
          onNavigate={(viewId) => {
            if (viewId === 'dashboard') {
              showDashboard();
            } else if (viewId === 'chatbox') {
              showChatBox();
            } else if (viewId === 'announcements') {
              showAnnouncements();
            } else if (viewId === 'schedule') {
              showSchedule();
            } else if (viewId === 'student-info') {
              showStudentInfo();
            }
          }}
        />
      )}

      {/* Telas de Login e Registro */}
      {(currentView === 'login' || currentView === 'register') && (
        <div className="min-h-screen pt-20 pb-16 px-4 relative">
          {/* Fundo com imagem da SINA */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          />
          
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Conteúdo principal */}
          <div className="container mx-auto relative z-10">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="mb-4 text-white">Bem vindo ao UFPE Hub Inteligente</h1>
              <p className="text-white/80 max-w-md mx-auto">
                {currentView === 'login' 
                  ? 'Faça login para acessar sua conta ou crie uma nova conta'
                  : 'Preencha os dados abaixo para criar sua nova conta'
                }
              </p>
            </div>

            {/* Navegação de volta para login (apenas na tela de registro) */}
            {currentView === 'register' && !isLoggedIn && (
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={showLoginView}
                  className="flex items-center gap-2 text-white hover:text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para Login
                </Button>
              </div>
            )}
            
            {/* Seção de Login */}
            {currentView === 'login' && (
              <>
                <LoginSection
                  onLogin={handleLogin}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />

                {!isLoggedIn && (
                  <div className="text-center mt-8">
                    <Button 
                      variant="ghost" 
                      onClick={showRegisterView}
                      className="flex items-center gap-2 mx-auto text-white hover:text-white hover:bg-white/20"
                    >
                      Não tem uma conta? Criar agora
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Seção de Registro */}
            {currentView === 'register' && !isLoggedIn && (
              <RegisterSection onRegister={handleRegister} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}