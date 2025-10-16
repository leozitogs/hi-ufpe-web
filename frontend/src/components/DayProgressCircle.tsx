import { useEffect, useState } from 'react';

interface DayProgressCircleProps {
  className?: string;
}

export function DayProgressCircle({ className = "" }: DayProgressCircleProps) {
  const [progress, setProgress] = useState(0);
  const [currentClass, setCurrentClass] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simula o progresso das aulas do dia
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      
      // Define horários das aulas (8h às 18h = 10 horas de aula)
      const startHour = 8;
      const endHour = 18;
      const totalHours = endHour - startHour;
      
      let dayProgress = 0;
      
      if (hour >= startHour && hour < endHour) {
        // Durante o período de aulas
        const hoursElapsed = hour - startHour + (minutes / 60);
        dayProgress = (hoursElapsed / totalHours) * 100;
        setCurrentClass(Math.floor(hoursElapsed / 2) + 1); // 2 horas por aula
      } else if (hour >= endHour) {
        // Após o fim das aulas
        dayProgress = 100;
        setCurrentClass(5);
      } else {
        // Antes do início das aulas
        dayProgress = 0;
        setCurrentClass(0);
      }
      
      setProgress(Math.min(dayProgress, 100));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  // Animação suave quando o progresso muda
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [progress]);

  // Calcula a cor baseada no progresso (vermelho para verde)
  const getColor = (progress: number) => {
    if (progress === 0) return '#ef4444'; // red-500
    if (progress <= 25) return '#f97316'; // orange-500
    if (progress <= 50) return '#eab308'; // yellow-500
    if (progress <= 75) return '#84cc16'; // lime-500
    return '#22c55e'; // green-500
  };

  const color = getColor(progress);
  const circumference = 2 * Math.PI * 45; // raio de 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStatusText = () => {
    if (progress === 0) return 'Dia não iniciado';
    if (progress === 100) return 'Dia concluído!';
    if (currentClass === 0) return 'Preparando...';
    return `Aula ${currentClass} em andamento`;
  };

  const getTimeText = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 8) return 'Início: 08:00';
    if (hour >= 18) return 'Finalizado às 18:00';
    
    const nextClassHour = Math.ceil((hour - 8) / 2) * 2 + 8;
    if (nextClassHour <= 18) {
      return `Próxima: ${nextClassHour.toString().padStart(2, '0')}:00`;
    }
    return 'Última aula em andamento';
  };

  return (
    <div className={`flex items-center gap-8 ${className}`}>
      {/* Círculo de progresso maior */}
      <div className="relative flex-shrink-0">
        <svg
          className="transform -rotate-90 w-40 h-40"
          width="160"
          height="160"
        >
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="transparent"
          />
          
          {/* Círculo de progresso */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 - (progress / 100) * 2 * Math.PI * 60}
            strokeLinecap="round"
            className={`transition-all duration-500 ease-out ${
              isAnimating ? 'drop-shadow-lg' : ''
            }`}
            style={{
              filter: `drop-shadow(0 0 12px ${color}40)`
            }}
          />
        </svg>
        
        {/* Texto central do círculo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold" style={{ color }}>
            {Math.round(progress)}%
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {currentClass > 0 && currentClass <= 5 ? `${currentClass}/5 aulas` : '0/5 aulas'}
          </span>
        </div>
      </div>
      
      {/* Informações à direita */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg text-gray-800 mb-2">
            {getStatusText()}
          </h3>
          <p className="text-gray-600">
            {getTimeText()}
          </p>
        </div>
        
        {/* Horário da próxima aula */}
        <div className="max-w-xs">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Próxima aula</div>
            <div className="text-xl font-semibold text-gray-700">
              {currentClass <= 5 ? `${8 + (currentClass * 2)}:00` : 'Concluído'}
            </div>
          </div>
        </div>
        
        {/* Barra de progresso da aula atual */}
        {progress > 0 && progress < 100 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso da aula atual</span>
              <span>{Math.round(((progress % 20) / 20) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: color,
                  width: `${((progress % 20) / 20) * 100}%`
                }}
              />
            </div>
          </div>
        )}
        
        {/* Status message */}
        <div className="bg-blue-50 rounded-lg p-3 border-l-4" style={{ borderColor: color }}>
          <p className="text-sm text-gray-700">
            {progress === 100 ? "Dia de estudos concluído" : "Acompanhe seu progresso diário"}
          </p>
        </div>
      </div>
    </div>
  );
}