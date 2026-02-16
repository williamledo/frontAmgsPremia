import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns } from '@/data/mockData';
import { formatCurrency } from '@/utils/numbers';
import { ChevronLeft, Copy, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { usePurchase } from '@/context/PurchaseContext';
import { toast } from 'sonner';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { currentCampaignId, quantity } = usePurchase();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  const campaign = campaigns.find(c => c.id === currentCampaignId);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!campaign || quantity === 0) {
    navigate('/campanhas');
    return null;
  }

  const total = quantity * campaign.pricePerTicket;
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2)}520400005303986540${total.toFixed(2)}5802BR5913SORTIOMAX6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado!');
  };

  const handleSimulatePayment = () => {
    navigate('/processando-pagamento');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/escolher-cotas')}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-green-500">Amigos Premia</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Pagamento</h1>
          <p className="text-zinc-400">Complete suas informações e efetue o pagamento via PIX</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Data Form */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800 p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Seus Dados</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  />
                </div>
              </div>
            </Card>

            {/* Summary */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-xl font-bold mb-4">Resumo da Compra</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Campanha</span>
                  <span className="font-medium text-right max-w-[200px]">{campaign.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Quantidade de cotas</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Valor por cota</span>
                  <span className="font-medium">{formatCurrency(campaign.pricePerTicket)}</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-green-500">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* PIX Payment */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Pagamento PIX</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-6">
                <div className="aspect-square bg-white p-4 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center text-black font-mono text-xs break-all p-4">
                    <p className="text-center">QR CODE PIX<br/>(Simulação)</p>
                  </div>
                </div>
              </div>

              {/* PIX Code */}
              <div className="mb-6">
                <Label className="text-sm text-zinc-400 mb-2 block">Código PIX Copia e Cola</Label>
                <div className="flex gap-2">
                  <Input
                    value={pixCode}
                    readOnly
                    className="bg-zinc-800 border-zinc-700 text-white font-mono text-xs"
                  />
                  <Button
                    onClick={handleCopyPix}
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-zinc-300 mb-2 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Após a confirmação do pagamento, seus números serão gerados automaticamente.</span>
                  </p>
                </div>
                <div className="text-xs text-zinc-500 space-y-1">
                  <p>• Abra o app do seu banco</p>
                  <p>• Escolha pagar via PIX</p>
                  <p>• Escaneie o QR Code ou cole o código</p>
                  <p>• Confirme o pagamento</p>
                </div>
              </div>

              {/* Simulate Payment Button (for demo) */}
              <Button
                onClick={handleSimulatePayment}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
              >
                Simular Pagamento (Demo)
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
