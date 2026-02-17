import React from 'react';
import { useNavigate } from 'react-router-dom';
import { campaigns } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/numbers';
import { ChevronLeft, Download, Eye, Ticket, Calendar, User, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { usePurchase } from '@/context/PurchaseContext';
import { toast } from 'sonner';
import { apiUrl } from '@/config/api';

export const MyAccount: React.FC = () => {
  const navigate = useNavigate();
  const { tickets, resetPurchase } = usePurchase();

  const handleViewInfo = () => {
    // Placeholder: em uma app real isso viria do estado/autenticação
    toast.success('Informações do usuário:\nNome: —\nEmail: —\nCPF: —');
  };

  const handleLogout = async () => {
  try {
    await fetch(apiUrl('/api/logout'), {
      method: 'POST',
      credentials: 'include'
    });

    resetPurchase();
    toast.success('Logout realizado');
    navigate('/');

  } catch (e) {
    toast.error('Erro ao sair');
  }
};


  const handleViewNumbers = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      toast.success(`Seus ${ticket.numbers.length} números: ${ticket.numbers.join(', ')}`);
    }
  };

  const handleDownloadReceipt = (ticketId: string) => {
    toast.success('Comprovante será enviado por email');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

            <div className="flex items-center gap-3">
              <Button
                onClick={handleViewInfo}
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <User className="mr-2" />
                Informações
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Minhas Cotas</h1>
          <p className="text-zinc-400">Histórico e detalhes das suas participações</p>
        </div>

        {tickets.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
            <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhuma cota encontrada</h2>
            <p className="text-zinc-400 mb-6">Você ainda não participou de nenhuma campanha</p>
            <Button
              onClick={() => navigate('/campanhas')}
              className="bg-green-500 hover:bg-green-600 text-black font-bold"
            >
              Ver Campanhas Disponíveis
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const campaign = campaigns.find(c => c.id === ticket.campaignId);
              if (!campaign) return null;

              return (
                <Card key={ticket.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Campaign Image */}
                    <div className="relative h-48 md:h-full">
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-4 left-4 ${ticket.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'} text-black`}>
                        {ticket.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                      </Badge>
                    </div>

                    {/* Campaign Details */}
                    <div className="p-6 md:col-span-2">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Sorteio: {formatDate(campaign.drawDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              <span>{ticket.quantity} {ticket.quantity === 1 ? 'cota' : 'cotas'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-sm text-zinc-500 mb-1">Total Pago</p>
                          <p className="text-2xl font-bold text-green-500">{formatCurrency(ticket.totalPrice)}</p>
                        </div>
                      </div>

                      {/* Numbers Preview */}
                      <div className="mb-4">
                        <p className="text-sm text-zinc-500 mb-2">Seus números:</p>
                        <div className="flex flex-wrap gap-2">
                          {ticket.numbers.slice(0, 8).map((num, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-zinc-800 border border-green-500/30 rounded font-mono text-green-500"
                            >
                              {num}
                            </div>
                          ))}
                          {ticket.numbers.length > 8 && (
                            <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">
                              +{ticket.numbers.length - 8} mais
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Purchase Info */}
                      <div className="mb-4">
                        <p className="text-xs text-zinc-500">
                          Comprado em: {formatDate(ticket.purchaseDate.split('T')[0])}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleViewNumbers(ticket.id)}
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Meus Números
                        </Button>
                        <Button
                          onClick={() => handleDownloadReceipt(ticket.id)}
                          variant="outline"
                          className="border-zinc-700 hover:border-green-500 hover:text-green-500"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Comprovante
                        </Button>
                        <Button
                          onClick={() => navigate(`/campanha/${campaign.id}`)}
                          variant="outline"
                          className="border-zinc-700 hover:border-green-500 hover:text-green-500"
                        >
                          Detalhes da Campanha
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Buy More CTA */}
        {tickets.length > 0 && (
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30 p-8 text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Quer aumentar suas chances?</h2>
            <p className="text-zinc-400 mb-6">
              Participe de mais campanhas e concorra a prêmios incríveis!
            </p>
            <Button
              onClick={() => navigate('/campanhas')}
              className="bg-green-500 hover:bg-green-600 text-black font-bold"
            >
              Ver Campanhas Disponíveis
            </Button>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-zinc-500">
          <p>&copy; 2026 Amigos Premia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
