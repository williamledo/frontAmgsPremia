import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/utils/numbers';
import { resolveImageUrl, resolveImageFallbackUrls } from '@/utils/image';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, Clock, ChevronLeft, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { usePurchase } from '@/context/PurchaseContext';

interface Campaign {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  dataHoraSorteio: string;
  valorCota: number;
}

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentCampaignId } = usePurchase();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const resp = await fetch(`http://localhost:8080/api/campanhas/${id}`, {
          credentials: 'include',
        });

        if (resp.ok) {
          const data = await resp.json();
          setCampaign(data);
        } else {
          setCampaign(null);
        }
      } catch (err) {
        console.error('Erro ao carregar campanha:', err);
        setCampaign(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Carregando...</div>;
  }

  if (!campaign) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Campanha não encontrada</div>;
  }

  const handleBuyClick = () => {
    setCurrentCampaignId(String(campaign.id));
    navigate('/escolher-cotas');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/campanhas')}
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <ImageWithFallback
                src={resolveImageUrl(campaign.imagem)}
                fallbackSrcs={resolveImageFallbackUrls(campaign.imagem)}
                alt={campaign.titulo}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Title and Description */}
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <Badge className="bg-green-500 text-black hover:bg-green-600">
                  100% Legalizado
                </Badge>
                <Badge className="bg-red-500 text-white hover:bg-red-600">
                  Sorteio ao vivo
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{campaign.titulo}</h1>
              <p className="text-zinc-300 text-lg">{campaign.descricao}</p>
            </div>

            {/* How it Works */}
            <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Como Funciona</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Escolha quantas cotas deseja</h3>
                    <p className="text-zinc-400">Você pode comprar quantas cotas quiser. Quanto mais cotas, maiores as chances!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 text-black rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Efetue o pagamento</h3>
                    <p className="text-zinc-400">Pagamento seguro via PIX. Aprovação instantânea.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 text-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Receba seus números automaticamente</h3>
                    <p className="text-zinc-400">Seus números são gerados automaticamente e enviados por email e WhatsApp.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-400">
                  <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />
                  Os números são gerados automaticamente entre 0000 e 9999
                </p>
              </div>
            </Card>

            {/* FAQ */}
            <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-zinc-800">
                  <AccordionTrigger className="text-left hover:text-green-500">
                    Como funciona a geração dos números?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Os números são gerados automaticamente pelo sistema no momento da confirmação do pagamento. Cada número é único e vai de 0000 a 9999.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-zinc-800">
                  <AccordionTrigger className="text-left hover:text-green-500">
                    Como recebo meus números?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Após a confirmação do pagamento, você receberá seus números por email e WhatsApp. Também pode visualizá-los na área "Minha Conta".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-zinc-800">
                  <AccordionTrigger className="text-left hover:text-green-500">
                    O sorteio é legalizado?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Sim! Todos os nossos sorteios são 100% legalizados e fiscalizados. O sorteio é realizado pela Loteria Federal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-zinc-800">
                  <AccordionTrigger className="text-left hover:text-green-500">
                    Como é feito o sorteio?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    O sorteio é realizado ao vivo, utilizando os resultados da Loteria Federal. Totalmente transparente e auditável.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Rules */}
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="text-2xl font-bold mb-4">Regulamento</h2>
              <div className="text-zinc-400 space-y-2 text-sm">
                <p>• Todos os participantes devem ser maiores de 18 anos</p>
                <p>• O sorteio será realizado na data e horário especificados</p>
                <p>• Os números são gerados automaticamente pelo sistema</p>
                <p>• Cada número é único e não pode ser duplicado</p>
                <p>• O prêmio será entregue em até 30 dias após o sorteio</p>
                <p>• Impostos e taxas são de responsabilidade do ganhador</p>
              </div>
            </Card>
          </div>

          {/* Sidebar - Purchase Box */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-zinc-500 mb-2">Preço por cota</p>
                <p className="text-3xl font-bold text-green-500">{formatCurrency(campaign.valorCota)}</p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>Data do sorteio</span>
                  </div>
                  <span className="font-bold">{formatDate(campaign.dataHoraSorteio)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span>Horário</span>
                  </div>
                  <span className="font-bold">
                    {new Date(campaign.dataHoraSorteio).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Intervalo dos números</span>
                  </div>
                  <span className="font-bold font-mono">0000-9999</span>
                </div>
              </div>

              <Button
                onClick={handleBuyClick}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-lg py-6"
              >
                Comprar Cotas
              </Button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                Pagamento 100% seguro via PIX
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
