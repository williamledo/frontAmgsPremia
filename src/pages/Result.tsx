import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns } from '@/data/mockData';
import { generateRandomNumbers, formatCurrency, isValidNumber } from '@/utils/numbers';
import { CheckCircle, Copy, Download, Share2, Search, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { usePurchase } from '@/context/PurchaseContext';
import { toast } from 'sonner';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { currentCampaignId, quantity, addTicket, resetPurchase } = usePurchase();
  const [numbers, setNumbers] = useState<string[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not-found' | null>(null);

  const campaign = campaigns.find(c => c.id === currentCampaignId);

  useEffect(() => {
    if (campaign && quantity > 0) {
      const generatedNumbers = generateRandomNumbers(quantity);
      setNumbers(generatedNumbers);

      // Save ticket
      const ticket = {
        id: Date.now().toString(),
        campaignId: campaign.id,
        numbers: generatedNumbers,
        purchaseDate: new Date().toISOString(),
        quantity,
        totalPrice: quantity * campaign.pricePerTicket,
        status: 'confirmed' as const
      };
      addTicket(ticket);
    }
  }, [campaign, quantity, addTicket]);

  if (!campaign || quantity === 0) {
    navigate('/campanhas');
    return null;
  }

  const handleCopyAll = () => {
    const numbersText = numbers.join(', ');
    navigator.clipboard.writeText(numbersText);
    toast.success('Números copiados!');
  };

  const handleDownload = () => {
    toast.success('Comprovante será enviado por email');
  };

  const handleShareWhatsApp = () => {
    const message = `Meus números da campanha ${campaign.title}: ${numbers.join(', ')}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSearch = () => {
    const formattedSearch = searchNumber.padStart(4, '0');
    if (isValidNumber(formattedSearch)) {
      const found = numbers.includes(formattedSearch);
      setSearchResult(found ? 'found' : 'not-found');
    } else {
      toast.error('Digite um número válido entre 0000 e 9999');
    }
  };

  const handleBackToHome = () => {
    resetPurchase();
    navigate('/campanhas');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-green-500">Amigos Premia</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Pagamento Confirmado!</h1>
          <p className="text-xl text-zinc-400">
            Você comprou {quantity} {quantity === 1 ? 'cota' : 'cotas'} e recebeu {quantity} {quantity === 1 ? 'número diferente' : 'números diferentes'}.
          </p>
        </div>

        {/* Campaign Info */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{campaign.title}</h2>
              <p className="text-zinc-400">{quantity} cotas - {formatCurrency(quantity * campaign.pricePerTicket)}</p>
            </div>
          </div>
        </Card>

        {/* Numbers Display */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Seus Números Gerados</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyAll}
                variant="outline"
                size="sm"
                className="border-zinc-700 hover:border-green-500 hover:text-green-500"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar todos
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-zinc-700 hover:border-green-500 hover:text-green-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                size="sm"
                className="border-zinc-700 hover:border-green-500 hover:text-green-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-6">
            {numbers.map((num, index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-500/50 rounded-lg flex items-center justify-center"
              >
                <span className="text-2xl font-mono font-bold text-green-500">{num}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-zinc-800 rounded-lg text-sm text-zinc-400">
            <p className="mb-1">✅ Todos os números foram registrados no sistema</p>
            <p>✅ Você receberá um comprovante por email e WhatsApp</p>
          </div>
        </Card>

        {/* Number Verification */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Verificar Número</h2>
          <p className="text-zinc-400 mb-6">
            Digite um número para verificar se ele pertence às suas cotas:
          </p>

          <div className="flex gap-3 mb-4">
            <Input
              type="number"
              min="0"
              max="9999"
              placeholder="Digite um número (0000-9999)"
              value={searchNumber}
              onChange={(e) => {
                setSearchNumber(e.target.value);
                setSearchResult(null);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-zinc-800 border-zinc-700 text-white font-mono text-lg text-center"
            />
            <Button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-black flex-shrink-0"
            >
              <Search className="w-5 h-5 mr-2" />
              Verificar
            </Button>
          </div>

          {searchResult && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                searchResult === 'found'
                  ? 'bg-green-900/20 border border-green-500/30 text-green-500'
                  : 'bg-red-900/20 border border-red-500/30 text-red-500'
              }`}
            >
              {searchResult === 'found' ? (
                <>
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="font-bold">
                    ✅ Este número pertence a você! Número {searchNumber.padStart(4, '0')} está vinculado às suas cotas.
                  </span>
                </>
              ) : (
                <>
                  <X className="w-6 h-6 flex-shrink-0" />
                  <span className="font-bold">
                    ❌ Este número não está vinculado às suas cotas.
                  </span>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/minha-conta')}
            variant="outline"
            className="border-zinc-700 hover:border-green-500 hover:text-green-500 py-6"
          >
            Ver Minhas Cotas
          </Button>
          <Button
            onClick={handleBackToHome}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-6"
          >
            Comprar Mais Cotas
          </Button>
        </div>
      </div>
    </div>
  );
};
