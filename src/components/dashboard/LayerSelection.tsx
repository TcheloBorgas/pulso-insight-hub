import { Zap, Activity, Database } from "lucide-react";

interface LayerSelectionProps {
  activeLayers: {
    pulso: boolean;
    finops: boolean;
    data: boolean;
  };
  setActiveLayers: (layers: { pulso: boolean; finops: boolean; data: boolean }) => void;
}

const LayerSelection = ({ activeLayers, setActiveLayers }: LayerSelectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Camadas Disponíveis
        </h2>
        <p className="text-sm text-muted-foreground">
          Toque nos ícones para ativar/desativar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Pulso CSA */}
        <div className="flex flex-col items-center text-center space-y-4">
          <button
            onClick={() => setActiveLayers({ ...activeLayers, pulso: !activeLayers.pulso })}
            className={`
              group relative
              w-40 h-40 rounded-3xl
              transition-all duration-500 ease-out
              ${activeLayers.pulso 
                ? 'bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/50 scale-100' 
                : 'bg-secondary/50 hover:bg-secondary shadow-lg hover:shadow-xl hover:scale-105'
              }
            `}
            aria-label="Toggle Pulso CSA"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap 
                className={`
                  transition-all duration-500
                  ${activeLayers.pulso 
                    ? 'w-20 h-20 text-white' 
                    : 'w-16 h-16 text-muted-foreground group-hover:text-foreground group-hover:w-20 group-hover:h-20'
                  }
                `}
                strokeWidth={1.5}
              />
            </div>
            
            {/* Pulse animation quando ativo */}
            {activeLayers.pulso && (
              <div className="absolute inset-0 rounded-3xl bg-primary animate-ping opacity-20" />
            )}
          </button>
          
          <div className="space-y-2">
            <div className={`
              inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              transition-all duration-300
              ${activeLayers.pulso 
                ? 'bg-primary/20 text-primary border-2 border-primary' 
                : 'bg-secondary/50 text-muted-foreground border-2 border-transparent'
              }
            `}>
              Pulso CSA
            </div>
            
            <h3 className={`
              text-xl font-bold transition-colors duration-300
              ${activeLayers.pulso ? 'text-primary' : 'text-foreground'}
            `}>
              Blueprint & Estrutura
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Gerar estrutura de pastas e endpoints
            </p>
          </div>
        </div>

        {/* Camada 5 - FinOps */}
        <div className="flex flex-col items-center text-center space-y-4">
          <button
            onClick={() => setActiveLayers({ ...activeLayers, finops: !activeLayers.finops })}
            className={`
              group relative
              w-40 h-40 rounded-3xl
              transition-all duration-500 ease-out
              ${activeLayers.finops 
                ? 'bg-gradient-to-br from-finops to-finops/80 shadow-2xl shadow-finops/50 scale-100' 
                : 'bg-secondary/50 hover:bg-secondary shadow-lg hover:shadow-xl hover:scale-105'
              }
            `}
            aria-label="Toggle Camada 5 - FinOps"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity 
                className={`
                  transition-all duration-500
                  ${activeLayers.finops 
                    ? 'w-20 h-20 text-white' 
                    : 'w-16 h-16 text-muted-foreground group-hover:text-foreground group-hover:w-20 group-hover:h-20'
                  }
                `}
                strokeWidth={1.5}
              />
            </div>
            
            {/* Pulse animation quando ativo */}
            {activeLayers.finops && (
              <div className="absolute inset-0 rounded-3xl bg-finops animate-ping opacity-20" />
            )}
          </button>
          
          <div className="space-y-2">
            <div className={`
              inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              transition-all duration-300
              ${activeLayers.finops 
                ? 'bg-finops/20 text-finops border-2 border-finops' 
                : 'bg-secondary/50 text-muted-foreground border-2 border-transparent'
              }
            `}>
              Camada 5
            </div>
            
            <h3 className={`
              text-xl font-bold transition-colors duration-300
              ${activeLayers.finops ? 'text-finops' : 'text-foreground'}
            `}>
              Produção/FinOps
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Insights de custo e otimizações em linguagem natural
            </p>
          </div>
        </div>

        {/* Camada 6 - Dados & IA */}
        <div className="flex flex-col items-center text-center space-y-4">
          <button
            onClick={() => setActiveLayers({ ...activeLayers, data: !activeLayers.data })}
            className={`
              group relative
              w-40 h-40 rounded-3xl
              transition-all duration-500 ease-out
              ${activeLayers.data 
                ? 'bg-gradient-to-br from-dataAi to-dataAi/80 shadow-2xl shadow-dataAi/50 scale-100' 
                : 'bg-secondary/50 hover:bg-secondary shadow-lg hover:shadow-xl hover:scale-105'
              }
            `}
            aria-label="Toggle Camada 6 - Dados & IA"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Database 
                className={`
                  transition-all duration-500
                  ${activeLayers.data 
                    ? 'w-20 h-20 text-white' 
                    : 'w-16 h-16 text-muted-foreground group-hover:text-foreground group-hover:w-20 group-hover:h-20'
                  }
                `}
                strokeWidth={1.5}
              />
            </div>
            
            {/* Pulse animation quando ativo */}
            {activeLayers.data && (
              <div className="absolute inset-0 rounded-3xl bg-dataAi animate-ping opacity-20" />
            )}
          </button>
          
          <div className="space-y-2">
            <div className={`
              inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              transition-all duration-300
              ${activeLayers.data 
                ? 'bg-dataAi/20 text-dataAi border-2 border-dataAi' 
                : 'bg-secondary/50 text-muted-foreground border-2 border-transparent'
              }
            `}>
              Camada 6
            </div>
            
            <h3 className={`
              text-xl font-bold transition-colors duration-300
              ${activeLayers.data ? 'text-dataAi' : 'text-foreground'}
            `}>
              Dados & IA
            </h3>
            
            <p className="text-sm text-muted-foreground max-w-xs">
              Explore estrutura, estatísticas e modelos de IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSelection;
