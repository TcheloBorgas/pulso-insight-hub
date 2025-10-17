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
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Camadas ativas
        </h2>
        <p className="text-sm text-muted-foreground">
          Ative para abrir a seção de conversa e análises
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-secondary/50 transition-colors">
          <Checkbox
            id="layer-finops"
            checked={activeLayers.finops}
            onCheckedChange={(checked) =>
              setActiveLayers({ ...activeLayers, finops: checked as boolean })
            }
          />
          <div className="flex-1 space-y-1">
            <Label
              htmlFor="layer-finops"
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Activity className="h-4 w-4 text-primary" />
              Camada 5 – Produção/FinOps
            </Label>
            <p className="text-xs text-muted-foreground">
              Insights de custo e otimizações em linguagem natural
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-secondary/50 transition-colors">
          <Checkbox
            id="layer-data"
            checked={activeLayers.data}
            onCheckedChange={(checked) =>
              setActiveLayers({ ...activeLayers, data: checked as boolean })
            }
          />
          <div className="flex-1 space-y-1">
            <Label
              htmlFor="layer-data"
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Database className="h-4 w-4 text-info" />
              Camada 6 – Dados & IA
            </Label>
            <p className="text-xs text-muted-foreground">
              Explore estrutura, estatísticas e modelos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSelection;
