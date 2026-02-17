import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/numbers';
import { resolveImageUrl, resolveImageFallbackUrls } from '@/utils/image';
import { ChevronLeft, Ticket, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { usePurchase } from '@/context/PurchaseContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const quickOptions = [1, 5, 10, 25, 50, 100];

interface Campaign {
  id: number;
  titulo: string;
  imagem: string;
  valorCota: number;
}

export const ChooseQuantity: React.FC = () => {
  const navigate = useNavigate();
  const { currentCampaignId, setQuantity } = usePurchase();
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!currentCampaignId) {
        navigate('/campanhas');
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/campanhas/${currentCampaignId}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          navigate('/campanhas');
          return;
        }

        const data = await res.json();
        setCampaign(data);
      } catch (err) {
        console.error('Erro ao carregar campanha:', err);
        navigate('/campanhas');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [currentCampaignId, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Carregando...</div>;
  }

  if (!campaign) {
    return null;
  }

  const handleQuickSelect = (qty: number) => {
    setSelectedQuantity(qty);
    setCustomQuantity('');
  };

  const handleCustomChange = (value: string) => {
    const num = parseInt(value) || 0;
    setCustomQuantity(value);
    setSelectedQuantity(num);
  };

  const handleContinue = () => {
    if (selectedQuantity > 0) {
      setQuantity(selectedQuantity);
      navigate('/checkout');
    }
  };

  const total = selectedQuantity * campaign.valorCota;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(`/campanha/${campaign.id}`)}
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
        {/* Campaign Info */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={resolveImageUrl(campaign.imagem)}
              fallbackSrcs={resolveImageFallbackUrls(campaign.imagem)}
              alt={campaign.titulo}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-bold mb-1">{campaign.titulo}</h2>
              <p className="text-zinc-400">Cota por {formatCurrency(campaign.valorCota)}</p>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Escolha quantas cotas você quer</h1>
            <p className="text-zinc-400">Quanto mais cotas, maiores as suas chances de ganhar!</p>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <p className="text-sm text-zinc-500 mb-4">Opções rápidas:</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {quickOptions.map((qty) => (
                <Button
                  key={qty}
                  onClick={() => handleQuickSelect(qty)}
                  variant={selectedQuantity === qty ? 'default' : 'outline'}
                  className={`h-16 text-lg font-bold ${
                    selectedQuantity === qty
                      ? 'bg-green-500 hover:bg-green-600 text-black border-green-500'
                      : 'border-zinc-700 hover:border-green-500 hover:text-green-500'
                  }`}
                >
                  {qty}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Quantity */}
          <div>
            <p className="text-sm text-zinc-500 mb-4">Ou digite outra quantidade:</p>
            <Input
              type="number"
              min="1"
              placeholder="Digite a quantidade..."
              value={customQuantity}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white h-16 text-lg text-center font-bold focus:border-green-500"
            />
          </div>

          {/* Summary */}
          {selectedQuantity > 0 && (
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30 p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Ticket className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-bold text-xl">Você receberá {selectedQuantity} números diferentes</p>
                    <p className="text-sm text-zinc-400">Cada número é único e exclusivo</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                    <Info className="w-4 h-4" />
                    <span>Números aleatórios entre 0000 e 9999</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Os números serão gerados automaticamente após a confirmação do pagamento
                  </p>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-400">{selectedQuantity} cotas x {formatCurrency(campaign.valorCota)}</span>
                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">Total</span>
                    <span className="text-3xl font-bold text-green-500">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={selectedQuantity === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedQuantity > 0 ? `Continuar para pagamento` : 'Escolha uma quantidade'}
          </Button>
        </div>
      </div>

      {/* Mobile Fixed Button */}
      {selectedQuantity > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400">Total</span>
            <span className="text-2xl font-bold text-green-500">{formatCurrency(total)}</span>
          </div>
          <Button
            onClick={handleContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6"
          >
            Continuar para pagamento
          </Button>
        </div>
      )}
    </div>
  );
};
