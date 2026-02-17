import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { apiUrl } from '@/config/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // limpar erro anterior

    try {
      const resp = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        credentials: 'include', // mantém cookie de sessão JSESSIONID
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      console.log('LOGIN STATUS:', resp.status);
      const text = await resp.text();
      console.log('LOGIN RESPONSE:', text);

      if (resp.status === 200) {
        // login OK
        navigate('/campanhas');
        return;
      }

      if (resp.status === 401) {
        setError('Email ou senha inválidos. Por favor, verifique seus dados e tente novamente.');
        setPassword(''); // limpar senha após erro
        return;
      }

      if (resp.status === 403) {
        setError('Acesso bloqueado. Verifique sua conta ou contate o suporte.');
        setPassword('');
        return;
      }

      // qualquer outro status inesperado
      setError(`Erro ao conectar (${resp.status}). Tente novamente em alguns momentos.`);
      setPassword('');

    } catch (err) {
      console.error('Erro de rede/login:', err);
      setError('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      setPassword(''); // limpar senha após erro
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

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

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
                    className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto ${
                      error ? 'border-red-600' : 'border-zinc-700'
                    }`}
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
