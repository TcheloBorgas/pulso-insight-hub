import { Activity, Database } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LayerSelectionProps {
  activeLayers: {
    finops: boolean;
    data: boolean;
  };
  setActiveLayers: (layers: { finops: boolean; data: boolean }) => void;
}

const LayerSelection = ({ activeLayers, setActiveLayers }: LayerSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Escolha suas Camadas
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecione as camadas para iniciar suas análises e conversas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camada 5 - FinOps */}
        <div
          onClick={() => setActiveLayers({ ...activeLayers, finops: !activeLayers.finops })}
          className={`
            relative overflow-hidden cursor-pointer
            rounded-xl border-2 transition-all duration-300
            ${activeLayers.finops 
              ? 'border-finops bg-finops/5 shadow-lg shadow-finops/20' 
              : 'border-border hover:border-finops/50 bg-card hover:shadow-md'
            }
          `}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-full transition-colors
                ${activeLayers.finops ? 'bg-finops/20' : 'bg-secondary'}
              `}>
                <Activity className={`h-8 w-8 ${activeLayers.finops ? 'text-finops' : 'text-muted-foreground'}`} />
              </div>
              <Checkbox
                id="layer-finops"
                checked={activeLayers.finops}
                onCheckedChange={(checked) =>
                  setActiveLayers({ ...activeLayers, finops: checked as boolean })
                }
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Camada 5
              </h3>
              <p className="text-lg font-semibold text-finops">
                Produção/FinOps
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Insights de custo e otimizações em linguagem natural. Analise gastos, identifique oportunidades de economia e tome decisões financeiras inteligentes.
              </p>
            </div>
          </div>
          
          {activeLayers.finops && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-finops" />
          )}
        </div>

        {/* Camada 6 - Dados & IA */}
        <div
          onClick={() => setActiveLayers({ ...activeLayers, data: !activeLayers.data })}
          className={`
            relative overflow-hidden cursor-pointer
            rounded-xl border-2 transition-all duration-300
            ${activeLayers.data 
              ? 'border-dataAi bg-dataAi/5 shadow-lg shadow-dataAi/20' 
              : 'border-border hover:border-dataAi/50 bg-card hover:shadow-md'
            }
          `}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-full transition-colors
                ${activeLayers.data ? 'bg-dataAi/20' : 'bg-secondary'}
              `}>
                <Database className={`h-8 w-8 ${activeLayers.data ? 'text-dataAi' : 'text-muted-foreground'}`} />
              </div>
              <Checkbox
                id="layer-data"
                checked={activeLayers.data}
                onCheckedChange={(checked) =>
                  setActiveLayers({ ...activeLayers, data: checked as boolean })
                }
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Camada 6
              </h3>
              <p className="text-lg font-semibold text-dataAi">
                Dados & IA
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore estrutura, estatísticas e modelos de inteligência artificial. Descubra padrões, gere insights e potencialize suas decisões com IA.
              </p>
            </div>
          </div>
          
          {activeLayers.data && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-dataAi" />
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerSelection;
