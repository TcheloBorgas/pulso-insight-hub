import { useState, useEffect } from "react";
import { User, Activity, Database, Zap, Monitor, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PromptPanel from "@/components/dashboard/PromptPanel";
import LogsPanel from "@/components/dashboard/LogsPanel";
import LayerSelection from "@/components/dashboard/LayerSelection";
import FinOpsChat from "@/components/dashboard/FinOpsChat";
import DataChat from "@/components/dashboard/DataChat";
import CloudChat from "@/components/dashboard/CloudChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeLayers, setActiveLayers] = useState({
    preview: false,
    pulso: false,
    finops: false,
    data: false,
    cloud: false,
  });
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const currentProfile = localStorage.getItem("currentProfile");
    
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    if (!currentProfile) {
      navigate("/profile-selection");
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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-finops/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dataAi/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="glass-strong border-b relative z-10">
        <DashboardHeader />
      </div>
      
      <main className="flex-1 container mx-auto p-4 lg:p-6 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Seleção de Camadas */}
          <div className="w-full animate-slide-down">
            <LayerSelection 
              activeLayers={activeLayers}
              setActiveLayers={setActiveLayers}
            />
          </div>

          {/* Área de Chats */}
          <div className="flex-1 space-y-6">
          {!activeLayers.preview && !activeLayers.pulso && !activeLayers.finops && !activeLayers.data && !activeLayers.cloud && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pulso CSA Card */}
                  <button
                    onClick={() => setActiveLayers(prev => ({ ...prev, pulso: true }))}
                    className="group relative glass-strong border border-primary/20 rounded-xl p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Monitor className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Pulso CSA</h3>
                        <p className="text-sm text-muted-foreground">Gere blueprints e desenvolva aplicações</p>
                      </div>
                      <div className="flex items-center text-xs text-primary/70 group-hover:text-primary transition-colors">
                        <span>Iniciar</span>
                        <Zap className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>

                  {/* FinOps Card */}
                  <button
                    onClick={() => setActiveLayers(prev => ({ ...prev, finops: true }))}
                    className="group relative glass-strong border border-finops/20 rounded-xl p-6 text-left transition-all duration-300 hover:border-finops/50 hover:shadow-[0_0_25px_rgba(0,255,153,0.15)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-finops/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-finops/10 flex items-center justify-center group-hover:bg-finops/20 transition-colors">
                        <Activity className="h-6 w-6 text-finops" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">FinOps</h3>
                        <p className="text-sm text-muted-foreground">Otimize custos de infraestrutura</p>
                      </div>
                      <div className="flex items-center text-xs text-finops/70 group-hover:text-finops transition-colors">
                        <span>Iniciar</span>
                        <Zap className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>

                  {/* Analytics Card */}
                  <button
                    onClick={() => setActiveLayers(prev => ({ ...prev, data: true }))}
                    className="group relative glass-strong border border-dataAi/20 rounded-xl p-6 text-left transition-all duration-300 hover:border-dataAi/50 hover:shadow-[0_0_25px_rgba(191,0,255,0.15)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-dataAi/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-dataAi/10 flex items-center justify-center group-hover:bg-dataAi/20 transition-colors">
                        <Database className="h-6 w-6 text-dataAi" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                        <p className="text-sm text-muted-foreground">Análise de dados com inteligência artificial</p>
                      </div>
                      <div className="flex items-center text-xs text-dataAi/70 group-hover:text-dataAi transition-colors">
                        <span>Iniciar</span>
                        <Zap className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>

                  {/* Cloud Deploy Card */}
                  <button
                    onClick={() => setActiveLayers(prev => ({ ...prev, cloud: true }))}
                    className="group relative glass-strong border border-primary/20 rounded-xl p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Cloud Deploy</h3>
                        <p className="text-sm text-muted-foreground">Deploy em AWS, Azure ou GCP</p>
                      </div>
                      <div className="flex items-center text-xs text-primary/70 group-hover:text-primary transition-colors">
                        <span>Iniciar</span>
                        <Zap className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeLayers.pulso && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 glass glass-hover border-2 transition-all duration-200 ${
                      showLogs
                        ? 'border-finops bg-gradient-to-r from-finops/80 to-finops/60 shadow-[0_0_20px_rgba(0,255,153,0.4)] text-white [&>span]:text-white [&>svg]:text-white' 
                        : 'border-finops/40 hover:border-finops/60'
                    }`}
                    onClick={() => setShowLogs(!showLogs)}
                  >
                    <Terminal className="h-4 w-4" />
                    <span>Controle de Logs</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 glass glass-hover border-2 transition-all duration-200 ${
                      activeLayers.preview 
                        ? 'border-primary bg-gradient-to-r from-primary/80 to-primary-deep/60 shadow-[0_0_20px_rgba(0,255,255,0.4)] text-white [&>span]:text-white [&>svg]:text-white' 
                        : 'border-primary/40 hover:border-primary/60'
                    }`}
                    onClick={() => setActiveLayers(prev => ({ ...prev, preview: !prev.preview }))}
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Preview do Frontend</span>
                  </Button>
                </div>
                
                {activeLayers.preview && (
                  <div className="glass-strong rounded-lg p-4 border-2 border-primary/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-primary" />
                        Preview do Frontend
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono px-2 py-1 rounded bg-primary/10">
                        localhost:3000
                      </span>
                    </div>
                    <div className="glass rounded-md overflow-hidden border border-primary/30" style={{ height: '600px' }}>
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
                )}

                {showLogs && (
                  <LogsPanel />
                )}
                
                <PromptPanel />
              </div>
            )}
            {activeLayers.finops && <div className="animate-slide-up"><FinOpsChat /></div>}
            {activeLayers.data && <div className="animate-slide-up"><DataChat /></div>}
            {activeLayers.cloud && <div className="animate-slide-up"><CloudChat /></div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
