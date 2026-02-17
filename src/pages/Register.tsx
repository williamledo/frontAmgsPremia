import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Mail, Lock, User, ChevronRight, Fingerprint, AlertCircle, CheckCircle } from 'lucide-react';
import { apiUrl } from '@/config/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);
    
    try {
      const resp = await fetch(apiUrl('/api/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          cpf: cpf,
          email: email,
          senha: password,
        }),
      });

      console.log('REGISTER STATUS:', resp.status);
      
      let data: any = {};
      const contentType = resp.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await resp.json();
      }
      console.log('REGISTER RESPONSE:', data);

      if (resp.status === 201 || resp.status === 200) {
        setSuccess('Conta criada com sucesso! Redirecionando para login...');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (resp.status === 400) {
        setError(data.erro || 'Erro ao criar conta');
        return;
      }

      setError(data.erro || `Erro ao criar conta (${resp.status})`);
    } catch (err) {
      console.error('Erro de registro:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Register Form */}
      <section className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Criar Conta</h2>
              <p className="text-zinc-400">Junte-se a nós e comece a participar de sorteios</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-zinc-300">CPF</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10 py-2 h-auto"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="w-4 h-4" required />
                <span className="text-zinc-400">
                  Concordo com os{' '}
                  <a href="#" className="text-green-500 hover:text-green-400 transition">
                    termos de serviço
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6 text-base"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
                {!isLoading && <ChevronRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-zinc-700 pt-6">
              <p className="text-zinc-400">
                Já tem uma conta?{' '}
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                  className="text-green-500 hover:text-green-400 transition font-semibold"
                >
                  Fazer login
                </a>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
