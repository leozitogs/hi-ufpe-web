import { useState } from "react";
import { Link } from "wouter"; // [FIX 1] Trocado react-router-dom por wouter
import { trpc } from "../../lib/trpc"; // [FIX 2] Caminho correto do TRPC

export default function Login() {
  // Não precisamos de hook de navegação aqui pois usaremos window.location.href
  // para forçar o recarregamento da página e pegar o cookie de sessão.
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
  onSuccess: (data) => {
    // [NOVO] Salvar o token recebido no LocalStorage
    // 'data' é o que retornamos no Passo 2
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }

    // Agora sim redireciona (e o token já estará salvo)
    window.location.href = "/dashboard";
  },
  onError: (err) => {
    setError(err.message);
  }
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse o Hub Inteligente da UFPE
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            // [FIX 4] isLoading -> isPending (versão nova do React Query)
            disabled={loginMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {/* [FIX 4] Atualizando texto do botão também */}
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Não tem conta? </span>
            {/* [FIX 1] Link do wouter usa href */}
            <Link href="/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
              Crie uma agora
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}