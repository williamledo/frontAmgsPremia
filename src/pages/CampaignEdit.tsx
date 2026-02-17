import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { resolveImageUrl, resolveImageFallbackUrls } from '@/utils/image';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { apiUrl } from '@/config/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface Campaign {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  dataHoraSorteio: string;
  valorCota: number;
}

export const CampaignEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    dataHoraSorteio: '',
    valorCota: '',
  });

  // Carregar campanha
  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      setError('');
      try {
        const resp = await fetch(apiUrl(`/api/campanhas/${id}`), {
          credentials: 'include',
        });
        if (!resp.ok) {
          setError('Campanha não encontrada');
          return;
        }
        const data = await resp.json();
        setCampaign(data);
        setFormData({
          titulo: data.titulo,
          descricao: data.descricao,
          imagem: data.imagem,
          dataHoraSorteio: data.dataHoraSorteio.slice(0, 16), // formato datetime-local
          valorCota: data.valorCota.toString(),
        });
      } catch (err) {
        console.error('Erro ao carregar campanha:', err);
        setError('Erro ao carregar campanha');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        valorCota: parseFloat(formData.valorCota),
        dataHoraSorteio: new Date(formData.dataHoraSorteio).toISOString(),
      };

      const resp = await fetch(apiUrl(`/api/campanhas/${id}`), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resp.status === 403) {
        setError('Você não tem permissão para editar campanhas (apenas ADMINs)');
        return;
      }

      if (!resp.ok) {
        setError('Erro ao salvar campanha');
        return;
      }

      setSuccess('Campanha atualizada com sucesso!');
      setTimeout(() => navigate('/campanhas'), 2000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro de conexão ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#010103' }}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/campanhas')}
          className="flex items-center gap-2 text-green-500 hover:text-green-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <Card className="w-full max-w-2xl mx-auto bg-zinc-900 border-zinc-800">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Editar Campanha</h1>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="titulo" className="text-zinc-300">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao" className="text-zinc-300">Descrição</Label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-3 mt-2 focus:outline-none focus:border-green-500 min-h-32"
                  required
                />
              </div>

              <div>
                <Label htmlFor="imagem" className="text-zinc-300">URL da Imagem</Label>
                <Input
                  id="imagem"
                  name="imagem"
                  type="url"
                  value={formData.imagem}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  required
                />
                {formData.imagem && (
                  <ImageWithFallback
                    src={resolveImageUrl(formData.imagem)}
                    fallbackSrcs={resolveImageFallbackUrls(formData.imagem)}
                    alt="Preview"
                    className="mt-4 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="dataHoraSorteio" className="text-zinc-300">Data e Hora do Sorteio</Label>
                <Input
                  id="dataHoraSorteio"
                  name="dataHoraSorteio"
                  type="datetime-local"
                  value={formData.dataHoraSorteio}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="valorCota" className="text-zinc-300">Valor da Cota (R$)</Label>
                <Input
                  id="valorCota"
                  name="valorCota"
                  type="number"
                  step="0.01"
                  value={formData.valorCota}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white mt-2"
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/campanhas')}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
