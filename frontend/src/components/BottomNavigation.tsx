import { Home, PenTool, Calendar, Megaphone, FileText } from 'lucide-react';
import { Badge } from './ui/badge';

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function BottomNavigation({ currentView, onNavigate }: BottomNavigationProps) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      hasNotification: false
    },
    {
      id: 'chatbox',
      label: 'Chat',
      icon: PenTool,
      hasNotification: false
    },
    {
      id: 'schedule',
      label: 'Horários',
      icon: Calendar,
      hasNotification: false
    },
    {
      id: 'announcements',
      label: 'Comunicados',
      icon: Megaphone,
      hasNotification: true,
      notificationCount: 3
    },
    {
      id: 'student-info',
      label: 'Notas',
      icon: FileText,
      hasNotification: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 relative ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 mb-1 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} 
                />
                {item.hasNotification && item.notificationCount && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {item.notificationCount}
                  </Badge>
                )}
              </div>
              <span className={`text-xs ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}