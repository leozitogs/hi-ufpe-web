import React from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../_core/hooks/useAuth"; // <-- named export

const Notas: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const { data: matriculas, isLoading } = trpc.matriculas.list.useQuery(
    { periodo: "2025.1", alunoId: user?.id ?? "" },
    { enabled: isAuthenticated && !!user?.id }
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Minhas Notas</h1>

      {isLoading && <div className="text-sm text-gray-500">Carregando...</div>}

      {!isLoading && !matriculas?.length && (
        <div className="text-sm text-gray-500">Nenhuma matrícula encontrada para o período.</div>
      )}

      <div className="space-y-4">
        {matriculas?.map((m) => {
          const matricula = (m as any).matricula ?? m;
          const disciplina = (m as any).disciplina ?? null;

          const nome = disciplina?.nome ?? "Disciplina desconhecida";
          const codigo = disciplina?.codigo ?? "";
          const media = matricula?.media ?? matricula?.mediaCalculada ?? "N/A";
          const faltas = matricula?.faltas ?? 0;
          const status = matricula?.status ?? "N/A";

          return (
            <div key={matricula?.id ?? (disciplina?.id ?? Math.random())} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {nome} {codigo && <span className="text-sm text-gray-500">({codigo})</span>}
                  </div>
                  <div className="text-sm text-gray-500">Status: {status}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">Média: {media}</div>
                  <div className="text-sm text-gray-500">Faltas: {faltas}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notas;
