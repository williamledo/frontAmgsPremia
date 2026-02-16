import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

const stages = [
  { id: 1, label: 'Aguardando pagamento', duration: 2000 },
  { id: 2, label: 'Confirmando pagamento', duration: 3000 },
  { id: 3, label: 'Gerando números', duration: 2000 }
];

export const ProcessingPayment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stageIndex = 0;
    let progressValue = 0;

    const progressInterval = setInterval(() => {
      progressValue += 2;
      setProgress(Math.min(progressValue, 100));
    }, 100);

    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length - 1) {
        stageIndex++;
        setCurrentStage(stageIndex);
      } else {
        clearInterval(stageInterval);
        clearInterval(progressInterval);
        setTimeout(() => {
          navigate('/resultado');
        }, 1000);
      }
    }, stages[stageIndex]?.duration || 2000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-zinc-800 p-12 max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Loader2 className="w-full h-full text-green-500 animate-spin" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Processando seu pedido</h1>
          <p className="text-zinc-400 mb-8">
            Estamos gerando seus números. Isso leva apenas alguns segundos.
          </p>

          <Progress value={progress} className="mb-8" />

          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  index < currentStage
                    ? 'bg-green-900/20 border border-green-500/30'
                    : index === currentStage
                    ? 'bg-zinc-800 border border-green-500'
                    : 'bg-zinc-800/50 border border-zinc-700'
                }`}
              >
                <div className={`flex-shrink-0 ${index <= currentStage ? 'text-green-500' : 'text-zinc-500'}`}>
                  {index < currentStage ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : index === currentStage ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </div>
                <span className={`font-medium ${index <= currentStage ? 'text-white' : 'text-zinc-500'}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-zinc-500">
          Não feche esta página. Você será redirecionado automaticamente.
        </p>
      </Card>
    </div>
  );
};
