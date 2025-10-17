import { useState, useEffect } from "react";
import { User, Activity, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PromptPanel from "@/components/dashboard/PromptPanel";
import LayerSelection from "@/components/dashboard/LayerSelection";
import FinOpsChat from "@/components/dashboard/FinOpsChat";
import DataChat from "@/components/dashboard/DataChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeLayers, setActiveLayers] = useState({
    finops: false,
    data: false,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    // Atalhos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        document.getElementById('prompt-input')?.focus();
      }
      if (e.altKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('finops-input')?.focus();
      }
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('data-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna Esquerda */}
          <div className="w-full lg:w-96 space-y-6">
            <PromptPanel />
            <LayerSelection 
              activeLayers={activeLayers}
              setActiveLayers={setActiveLayers}
            />
          </div>

          {/* Coluna Direita */}
          <div className="flex-1 space-y-6">
            {!activeLayers.finops && !activeLayers.data && (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex justify-center gap-4">
                    <Activity className="h-12 w-12 text-muted-foreground" />
                    <Database className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ative uma camada para começar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione Camada 5 (FinOps) ou Camada 6 (Dados & IA) para iniciar uma conversa
                  </p>
                </div>
              </div>
            )}

            {activeLayers.finops && <FinOpsChat />}
            {activeLayers.data && <DataChat />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
