import { Activity, Database, Check } from "lucide-react";

interface LayerSelectionProps {
  activeLayers: {
    finops: boolean;
    data: boolean;
  };
  setActiveLayers: (layers: { finops: boolean; data: boolean }) => void;
}

const LayerSelection = ({ activeLayers, setActiveLayers }: LayerSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          Escolha suas Camadas
        </h2>
        <p className="text-muted-foreground">
          Clique nos cards para ativar as camadas de análise
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camada 5 - FinOps */}
        <button
          onClick={() => setActiveLayers({ ...activeLayers, finops: !activeLayers.finops })}
          className={`
            group relative overflow-hidden text-left
            rounded-2xl border-2 transition-all duration-300 transform
            ${activeLayers.finops 
              ? 'border-finops bg-gradient-to-br from-finops/10 to-finops/5 shadow-2xl shadow-finops/30 scale-[1.02]' 
              : 'border-border bg-card hover:border-finops/30 hover:shadow-lg hover:scale-[1.01]'
            }
          `}
        >
          <div className="p-8 space-y-6">
            {/* Header com ícone e badge de status */}
            <div className="flex items-start justify-between">
              <div className={`
                p-4 rounded-2xl transition-all duration-300
                ${activeLayers.finops 
                  ? 'bg-finops/20 shadow-lg shadow-finops/20' 
                  : 'bg-secondary group-hover:bg-finops/10'
                }
              `}>
                <Activity className={`h-10 w-10 transition-colors ${
                  activeLayers.finops ? 'text-finops' : 'text-muted-foreground group-hover:text-finops/70'
                }`} />
              </div>
              
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                ${activeLayers.finops 
                  ? 'bg-finops text-white scale-100' 
                  : 'bg-secondary scale-0 group-hover:scale-100'
                }
              `}>
                <Check className="h-6 w-6" />
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${activeLayers.finops 
                    ? 'bg-finops text-white' 
                    : 'bg-secondary text-muted-foreground'
                  }
                `}>
                  Camada 5
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground">
                Produção/FinOps
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                Insights de custo e otimizações em linguagem natural. Analise gastos, identifique oportunidades de economia e tome decisões financeiras inteligentes.
              </p>
            </div>
          </div>
          
          {/* Barra inferior de destaque */}
          <div className={`
            h-2 w-full transition-all duration-300
            ${activeLayers.finops ? 'bg-finops' : 'bg-transparent group-hover:bg-finops/30'}
          `} />
        </button>

        {/* Camada 6 - Dados & IA */}
        <button
          onClick={() => setActiveLayers({ ...activeLayers, data: !activeLayers.data })}
          className={`
            group relative overflow-hidden text-left
            rounded-2xl border-2 transition-all duration-300 transform
            ${activeLayers.data 
              ? 'border-dataAi bg-gradient-to-br from-dataAi/10 to-dataAi/5 shadow-2xl shadow-dataAi/30 scale-[1.02]' 
              : 'border-border bg-card hover:border-dataAi/30 hover:shadow-lg hover:scale-[1.01]'
            }
          `}
        >
          <div className="p-8 space-y-6">
            {/* Header com ícone e badge de status */}
            <div className="flex items-start justify-between">
              <div className={`
                p-4 rounded-2xl transition-all duration-300
                ${activeLayers.data 
                  ? 'bg-dataAi/20 shadow-lg shadow-dataAi/20' 
                  : 'bg-secondary group-hover:bg-dataAi/10'
                }
              `}>
                <Database className={`h-10 w-10 transition-colors ${
                  activeLayers.data ? 'text-dataAi' : 'text-muted-foreground group-hover:text-dataAi/70'
                }`} />
              </div>
              
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                ${activeLayers.data 
                  ? 'bg-dataAi text-white scale-100' 
                  : 'bg-secondary scale-0 group-hover:scale-100'
                }
              `}>
                <Check className="h-6 w-6" />
              </div>
            </div>
            
            {/* Conteúdo */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${activeLayers.data 
                    ? 'bg-dataAi text-white' 
                    : 'bg-secondary text-muted-foreground'
                  }
                `}>
                  Camada 6
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground">
                Dados & IA
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                Explore estrutura, estatísticas e modelos de inteligência artificial. Descubra padrões, gere insights e potencialize suas decisões com IA.
              </p>
            </div>
          </div>
          
          {/* Barra inferior de destaque */}
          <div className={`
            h-2 w-full transition-all duration-300
            ${activeLayers.data ? 'bg-dataAi' : 'bg-transparent group-hover:bg-dataAi/30'}
          `} />
        </button>
      </div>
    </div>
  );
};

export default LayerSelection;
