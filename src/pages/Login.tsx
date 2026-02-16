import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const resp = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      credentials: 'include', // mantém cookie de sessão JSESSIONID
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,     // Spring espera "username"
        password: password,  // Spring espera "password"
      }),
    });

    // 🔎 logs de diagnóstico
    console.log('LOGIN STATUS:', resp.status);

    const text = await resp.text();
    console.log('LOGIN RESPONSE:', text);

    if (resp.status === 200) {
      // login OK
      navigate('/campanhas');
      return;
    }

    if (resp.status === 401) {
      alert('Email ou senha inválidos');
      return;
    }

    if (resp.status === 403) {
      alert('Acesso bloqueado (403). Verifique CORS ou sessão.');
      return;
    }

    // qualquer outro status inesperado
    alert(`Erro no login (${resp.status})`);

  } catch (err) {
    console.error('Erro de rede/login:', err);
    alert('Erro de conexão com o servidor');
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#010103' }}>
      {/* Login Form */}
      <section className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="mb-8">
              <img 
                src={new URL('../utils/logo-horizontal.jpeg', import.meta.url).href}
                alt="Amigos Premia Logo" 
                className="h-56 object-contain"
              />
        </div>
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Bem-vindo!</h2>
              <p className="text-zinc-400">Faça login para continuar participando dos sorteios</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-zinc-400">Lembrar-me</span>
                </label>
                <a href="#" className="text-green-500 hover:text-green-400 transition">
                  Esqueci a senha
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6 text-base"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
                {!isLoading && <ChevronRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-zinc-700 pt-6">
              <p className="text-zinc-400">
                Não tem uma conta?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/criar-conta');
                  }}
                  className="text-green-500 hover:text-green-400 transition font-semibold"
                >
                  Criar conta
                </a>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
