import React from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns, winners } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/numbers';
import { Trophy, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredCampaign = campaigns.find(c => c.isFeatured);
  const secondaryCampaigns = campaigns.filter(c => !c.isFeatured);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-500">Amigos Premia</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#campanhas" className="hover:text-green-500 transition">Campanhas</a>
              <a href="#como-funciona" className="hover:text-green-500 transition">Como funciona</a>
              <a href="#ganhadores" className="hover:text-green-500 transition">Ganhadores</a>
              <Button 
                onClick={() => navigate('/minha-conta')}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
              >
                Minha Conta
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Featured Campaign */}
      {featuredCampaign && (
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-64 md:h-full">
                <img
                  src={featuredCampaign.imageUrl}
                  alt={featuredCampaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-green-500 text-black hover:bg-green-600">
                    100% Legalizado
                  </Badge>
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    Sorteio ao vivo
                  </Badge>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{featuredCampaign.title}</h2>
                <p className="text-zinc-400 mb-6">{featuredCampaign.description}</p>
                <div className="flex items-center gap-6 mb-6 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>{formatDate(featuredCampaign.drawDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span>{featuredCampaign.drawTime}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-zinc-500 mb-2">Cota por apenas:</p>
                  <p className="text-3xl font-bold text-green-500">{formatCurrency(featuredCampaign.pricePerTicket)}</p>
                </div>
                <Button
                  onClick={() => navigate(`/campanha/${featuredCampaign.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg py-6"
                >
                  Ver campanha
                  <ChevronRight className="ml-2" />
                </Button>
                <p className="text-xs text-zinc-500 mt-4">
                  * Os números são gerados automaticamente entre 0000 e 9999
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Secondary Campaigns */}
      <section id="campanhas" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Outras Campanhas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondaryCampaigns.map(campaign => (
            <Card key={campaign.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-green-500 transition cursor-pointer" onClick={() => navigate(`/campanha/${campaign.id}`)}>
              <div className="relative h-48">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
                <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(campaign.drawDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{campaign.drawTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Por cota</p>
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(campaign.pricePerTicket)}</p>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600 text-black">
                    Ver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Winners Section */}
      <section id="ganhadores" className="container mx-auto px-4 py-12 bg-zinc-900/30">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Últimos Ganhadores
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {winners.map(winner => (
            <Card key={winner.id} className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={winner.photoUrl}
                  alt={winner.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{winner.name}</h3>
                  <p className="text-sm text-zinc-400">{formatDate(winner.date)}</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 mb-3">
                <p className="text-xs text-zinc-500 mb-1">Prêmio</p>
                <p className="font-bold text-green-500">{winner.prize}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-xs text-zinc-500 mb-1">Número sorteado</p>
                <p className="text-2xl font-mono font-bold text-yellow-500">{winner.winningNumber}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Como Funciona</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Escolha quantas cotas deseja</h3>
            <p className="text-zinc-400">Selecione a quantidade de cotas que deseja comprar</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Efetue o pagamento</h3>
            <p className="text-zinc-400">Pague via PIX de forma rápida e segura</p>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Receba seus números automaticamente</h3>
            <p className="text-zinc-400">Números gerados automaticamente entre 0000 e 9999</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-zinc-500">
          <p>&copy; 2026 Amigos Premia. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Sorteios 100% legalizados e fiscalizados</p>
        </div>
      </footer>
    </div>
  );
};
