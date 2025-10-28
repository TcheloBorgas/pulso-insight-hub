import { useState, useEffect } from "react";
import { User, Activity, Database, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PromptPanel from "@/components/dashboard/PromptPanel";
import LayerSelection from "@/components/dashboard/LayerSelection";
import FinOpsChat from "@/components/dashboard/FinOpsChat";
import DataChat from "@/components/dashboard/DataChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeLayers, setActiveLayers] = useState({
    pulso: false,
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
        <div className="flex flex-col gap-6">
          {/* Seleção de Camadas */}
          <div className="w-full">
            <LayerSelection 
              activeLayers={activeLayers}
              setActiveLayers={setActiveLayers}
            />
          </div>

          {/* Área de Chats */}
          <div className="flex-1 space-y-6">
            {!activeLayers.pulso && !activeLayers.finops && !activeLayers.data && (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex justify-center gap-4">
                    <Zap className="h-12 w-12 text-muted-foreground" />
                    <Activity className="h-12 w-12 text-muted-foreground" />
                    <Database className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ative uma camada para começar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione Pulso CSA, Camada 5 (FinOps) ou Camada 6 (Dados & IA) para iniciar
                  </p>
                </div>
              </div>
            )}

            {activeLayers.pulso && (
              <>
                {/* Preview Iframe */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Preview do Frontend
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      localhost:3000
                    </span>
                  </div>
                  <div className="bg-background border border-border rounded-md overflow-hidden" style={{ height: '600px' }}>
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>App Demo</title>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              min-height: 100vh;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              padding: 20px;
                            }
                            .container {
                              background: white;
                              border-radius: 16px;
                              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                              max-width: 500px;
                              width: 100%;
                              padding: 40px;
                            }
                            h1 {
                              color: #1a202c;
                              font-size: 28px;
                              margin-bottom: 10px;
                            }
                            p {
                              color: #718096;
                              margin-bottom: 30px;
                              line-height: 1.6;
                            }
                            .feature {
                              background: #f7fafc;
                              padding: 20px;
                              border-radius: 12px;
                              margin-bottom: 15px;
                              border-left: 4px solid #667eea;
                            }
                            .feature h3 {
                              color: #2d3748;
                              font-size: 16px;
                              margin-bottom: 8px;
                            }
                            .feature p {
                              color: #718096;
                              font-size: 14px;
                              margin: 0;
                            }
                            button {
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: white;
                              border: none;
                              padding: 14px 28px;
                              border-radius: 8px;
                              font-size: 16px;
                              font-weight: 600;
                              cursor: pointer;
                              width: 100%;
                              margin-top: 20px;
                              transition: transform 0.2s, box-shadow 0.2s;
                            }
                            button:hover {
                              transform: translateY(-2px);
                              box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                            }
                            button:active {
                              transform: translateY(0);
                            }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <h1>🚀 Meu App</h1>
                            <p>Este é um exemplo de frontend gerado automaticamente</p>
                            
                            <div class="feature">
                              <h3>✨ Design Moderno</h3>
                              <p>Interface limpa e responsiva</p>
                            </div>
                            
                            <div class="feature">
                              <h3>⚡ Performance</h3>
                              <p>Otimizado para velocidade</p>
                            </div>
                            
                            <div class="feature">
                              <h3>🎯 Componentes</h3>
                              <p>Estrutura organizada e escalável</p>
                            </div>
                            
                            <button onclick="alert('Funcionalidade em desenvolvimento!')">
                              Começar Agora
                            </button>
                          </div>
                        </body>
                        </html>
                      `}
                      className="w-full h-full border-0"
                      title="Frontend Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
                <PromptPanel />
              </>
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
