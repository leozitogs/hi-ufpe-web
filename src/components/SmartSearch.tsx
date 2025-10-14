import { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, Calendar, FileText, Megaphone, User } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface SmartSearchProps {
  onNavigate: (destination: string) => void;
}

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  destination: string;
  badge?: string;
}

export function SmartSearch({ onNavigate }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchOptions: SearchSuggestion[] = [
    {
      id: 'chat',
      title: 'ChatBox IA',
      description: 'Converse com nossa assistente inteligente',
      icon: MessageSquare,
      keywords: ['chat', 'conversa', 'ia', 'assistente', 'perguntar', 'ajuda', 'bot'],
      destination: 'chatbox'
    },
    {
      id: 'schedule',
      title: 'Horários e Salas',
      description: 'Consulte sua agenda acadêmica',
      icon: Calendar,
      keywords: ['horario', 'horários', 'sala', 'salas', 'agenda', 'aula', 'aulas', 'cronograma', 'calendario'],
      destination: 'schedule'
    },
    {
      id: 'student-info',
      title: 'Notas e Dados',
      description: 'Visualize suas notas e informações pessoais',
      icon: FileText,
      keywords: ['nota', 'notas', 'dados', 'informações', 'perfil', 'boletim', 'historico', 'desempenho'],
      destination: 'student-info'
    },
    {
      id: 'announcements',
      title: 'Comunicados',
      description: 'Veja os avisos e notícias da universidade',
      icon: Megaphone,
      keywords: ['comunicado', 'comunicados', 'aviso', 'avisos', 'noticia', 'noticias', 'anuncio', 'anuncios'],
      destination: 'announcements',
      badge: '3'
    }
  ];

  const quickActions = [
    'Próxima aula',
    'Minhas notas',
    'Trabalhos pendentes',
    'Mensagens',
    'Calendário acadêmico'
  ];

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = searchOptions.filter(option => {
      const searchTerm = query.toLowerCase();
      return option.keywords.some(keyword => 
        keyword.includes(searchTerm) ||
        option.title.toLowerCase().includes(searchTerm) ||
        option.description.toLowerCase().includes(searchTerm)
      );
    });

    setSuggestions(filtered);
  }, [query]);

  // Click fora para fechar as sugestões
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (destination?: string) => {
    if (destination) {
      onNavigate(destination);
      setQuery('');
      setIsActive(false);
      inputRef.current?.blur();
    } else if (suggestions.length > 0) {
      onNavigate(suggestions[0].destination);
      setQuery('');
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setQuery('');
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  const handleQuickAction = (action: string) => {
    setQuery(action);
    setIsActive(true);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Digite o que você procura: chat, horários, notas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onKeyDown={handleKeyPress}
            className="pl-10 pr-4 py-3 text-base bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl shadow-sm w-full"
          />
        </div>

        {/* Sugestões de busca */}
        {isActive && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-30 shadow-xl border-2 border-gray-100 bg-white max-h-80 overflow-y-auto">
            <CardContent className="p-2">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.destination)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-gray-800 text-sm font-medium truncate">{suggestion.title}</h4>
                        {suggestion.badge && (
                          <Badge variant="destructive" className="text-xs flex-shrink-0">
                            {suggestion.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{suggestion.description}</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Ações rápidas */}
        {!isActive && query === '' && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3">Ações rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando não encontra resultados */}
        {isActive && query.trim() !== '' && suggestions.length === 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-30 shadow-xl border-2 border-gray-100 bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-gray-500 text-sm">
                Nenhum resultado encontrado para "{query}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tente buscar por: chat, horários, notas ou comunicados
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dicas de uso */}
      {!isActive && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            💡 Dica: Digite palavras como "chat", "aula", "nota" ou "aviso" para encontrar rapidamente
          </p>
        </div>
      )}
    </div>
  );
}