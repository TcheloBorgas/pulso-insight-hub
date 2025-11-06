import { useState } from "react";
import { Terminal, Info, AlertTriangle, XCircle, Filter, Trash2, Play, RotateCw, Power, FileText, TestTube, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error";
  message: string;
  source?: string;
}

const LogsPanel = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date(),
      level: "info",
      message: "Servidor iniciado na porta 3000",
      source: "server",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 5000),
      level: "info",
      message: "Conexão com banco de dados estabelecida",
      source: "database",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 10000),
      level: "warning",
      message: "Tempo de resposta da API acima do esperado (1.2s)",
      source: "api",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 15000),
      level: "error",
      message: "Falha ao conectar com serviço externo: timeout",
      source: "external",
    },
  ]);
  const [filter, setFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [environmentStatus, setEnvironmentStatus] = useState<"stopped" | "running">("stopped");
  const [environmentType, setEnvironmentType] = useState<"docker" | "venv" | null>(null);
  const [showEnvironmentDialog, setShowEnvironmentDialog] = useState(false);
  const [showAppLogs, setShowAppLogs] = useState(false);
  const [testEnvironment, setTestEnvironment] = useState<"docker" | "venv">("docker");
  const [showTestDialog, setShowTestDialog] = useState(false);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-primary" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "border-l-primary bg-primary/5";
      case "warning":
        return "border-l-warning bg-warning/5";
      case "error":
        return "border-l-destructive bg-destructive/5";
      default:
        return "border-l-muted bg-muted/5";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesText =
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.source?.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesText && matchesLevel;
  });

  const clearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs limpos",
      description: "Todos os logs foram removidos",
    });
  };

  const addLog = (level: LogEntry["level"], message: string, source?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      source,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleStartEnvironment = (type: "docker" | "venv") => {
    setEnvironmentType(type);
    setEnvironmentStatus("running");
    setShowEnvironmentDialog(false);
    
    addLog("info", `Iniciando ambiente ${type === "docker" ? "Docker" : "Virtual Environment"}...`, "environment");
    
    setTimeout(() => {
      addLog("info", `Ambiente ${type === "docker" ? "Docker" : "Virtual Environment"} iniciado com sucesso`, "environment");
      toast({
        title: "Ambiente iniciado",
        description: `${type === "docker" ? "Docker" : "Virtual Environment"} está rodando`,
      });
    }, 2000);
  };

  const handleRestartEnvironment = () => {
    if (environmentStatus === "stopped") {
      toast({
        title: "Ambiente parado",
        description: "Inicie o ambiente antes de reiniciar",
        variant: "destructive",
      });
      return;
    }

    addLog("warning", `Reiniciando ambiente ${environmentType}...`, "environment");
    
    setTimeout(() => {
      addLog("info", `Ambiente ${environmentType} reiniciado com sucesso`, "environment");
      toast({
        title: "Ambiente reiniciado",
        description: "O ambiente foi reiniciado com sucesso",
      });
    }, 2000);
  };

  const handleStopEnvironment = () => {
    if (environmentStatus === "stopped") {
      toast({
        title: "Ambiente já parado",
        description: "O ambiente não está rodando",
        variant: "destructive",
      });
      return;
    }

    addLog("warning", `Parando ambiente ${environmentType}...`, "environment");
    
    setTimeout(() => {
      setEnvironmentStatus("stopped");
      setEnvironmentType(null);
      addLog("info", "Ambiente desligado com sucesso", "environment");
      toast({
        title: "Ambiente desligado",
        description: "O ambiente foi desligado com sucesso",
      });
    }, 1500);
  };

  const toggleAppLogs = () => {
    setShowAppLogs(!showAppLogs);
    toast({
      title: showAppLogs ? "Logs da aplicação ocultos" : "Logs da aplicação visíveis",
      description: showAppLogs 
        ? "Mostrando apenas logs do sistema" 
        : "Mostrando logs da aplicação",
    });
  };

  const handleCopyCurl = (curl: string) => {
    navigator.clipboard.writeText(curl);
    toast({
      title: "cURL copiado",
      description: "Comando copiado para a área de transferência",
    });
  };

  const testCurls = {
    docker: [
      {
        name: "Health Check",
        curl: `curl -X GET http://localhost:8000/health`,
      },
      {
        name: "API Status",
        curl: `curl -X GET http://localhost:8000/api/status`,
      },
      {
        name: "Test POST",
        curl: `curl -X POST http://localhost:8000/api/test \\
  -H "Content-Type: application/json" \\
  -d '{"test": "data"}'`,
      },
    ],
    venv: [
      {
        name: "Health Check",
        curl: `curl -X GET http://localhost:5000/health`,
      },
      {
        name: "API Status",
        curl: `curl -X GET http://localhost:5000/api/status`,
      },
      {
        name: "Test POST",
        curl: `curl -X POST http://localhost:5000/api/test \\
  -H "Content-Type: application/json" \\
  -d '{"test": "data"}'`,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="glass-strong neon-glow rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Controle de Logs
            </h2>
            {environmentStatus === "running" && environmentType && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                {environmentType === "docker" ? "Docker" : "venv"} • rodando
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="h-8 border-destructive/40 hover:border-destructive hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        </div>

        {/* Área de Teste com Switch */}
        <div className="mb-6 glass p-4 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground">
                Testar com:
              </Label>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${testEnvironment === "docker" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  Docker
                </span>
                <Switch
                  checked={testEnvironment === "venv"}
                  onCheckedChange={(checked) => setTestEnvironment(checked ? "venv" : "docker")}
                />
                <span className={`text-sm ${testEnvironment === "venv" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  venv
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestDialog(true)}
              className="border-primary/40 hover:border-primary hover:bg-primary/10"
            >
              <TestTube className="h-3.5 w-3.5 mr-2" />
              Testar
            </Button>
          </div>
        </div>

        {/* Controles de Ambiente */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAppLogs}
            className={`border-primary/40 hover:border-primary hover:bg-primary/10 ${
              showAppLogs ? "bg-primary/20 border-primary" : ""
            }`}
          >
            <FileText className="h-3.5 w-3.5 mr-2" />
            Logs da App
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEnvironmentDialog(true)}
            disabled={environmentStatus === "running"}
            className="border-primary/40 hover:border-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 mr-2" />
            Subir Ambiente
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRestartEnvironment}
            disabled={environmentStatus === "stopped"}
            className="border-finops/40 hover:border-finops hover:bg-finops/10 disabled:opacity-50"
          >
            <RotateCw className="h-3.5 w-3.5 mr-2" />
            Reiniciar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStopEnvironment}
            disabled={environmentStatus === "stopped"}
            className="border-destructive/40 hover:border-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            <Power className="h-3.5 w-3.5 mr-2" />
            Desligar
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 border-primary/30 bg-background/50 focus-visible:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {["all", "info", "warning", "error"].map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(level)}
                className="flex-1 capitalize"
              >
                {level === "all" ? "Todos" : level}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Logs */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum log encontrado</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`border-l-4 rounded-lg p-4 ${getLevelColor(
                  log.level
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getLevelIcon(log.level)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {log.timestamp.toLocaleTimeString("pt-BR")}
                      </span>
                      {log.source && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                          {log.source}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground font-mono break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer com stats */}
        <div className="mt-4 pt-4 border-t border-primary/20 flex justify-between text-xs text-muted-foreground">
          <span>Total: {filteredLogs.length} logs</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              {logs.filter((l) => l.level === "info").length} info
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              {logs.filter((l) => l.level === "warning").length} warning
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive"></div>
              {logs.filter((l) => l.level === "error").length} error
            </span>
          </div>
        </div>
      </div>

      {/* Dialog para escolher tipo de ambiente */}
      <Dialog open={showEnvironmentDialog} onOpenChange={setShowEnvironmentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Escolha o Tipo de Ambiente
            </DialogTitle>
            <DialogDescription>
              Selecione como deseja executar o ambiente backend
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card
              onClick={() => handleStartEnvironment("docker")}
              className="glass p-6 cursor-pointer border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                  <Terminal className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Docker</h3>
                <p className="text-sm text-muted-foreground">
                  Ambiente isolado com containers
                </p>
                <ul className="text-xs text-muted-foreground text-left space-y-1">
                  <li>✓ Isolamento total</li>
                  <li>✓ Fácil deploy</li>
                  <li>✓ Reproduzível</li>
                </ul>
              </div>
            </Card>

            <Card
              onClick={() => handleStartEnvironment("venv")}
              className="glass p-6 cursor-pointer border-2 border-finops/20 hover:border-finops hover:bg-finops/5 transition-all hover:scale-105"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-finops/20 flex items-center justify-center">
                  <Terminal className="h-8 w-8 text-finops" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Virtual Env</h3>
                <p className="text-sm text-muted-foreground">
                  Ambiente virtual Python
                </p>
                <ul className="text-xs text-muted-foreground text-left space-y-1">
                  <li>✓ Leve e rápido</li>
                  <li>✓ Simples configuração</li>
                  <li>✓ Controle de deps</li>
                </ul>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Testes com cURL */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <TestTube className="h-6 w-6" />
              Testes cURL - {testEnvironment === "docker" ? "Docker" : "Virtual Env"}
            </DialogTitle>
            <DialogDescription>
              Comandos de teste para o ambiente {testEnvironment === "docker" ? "Docker" : "Virtual Environment"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {testCurls[testEnvironment].map((test, index) => (
              <div key={index} className="glass p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{test.name}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCurl(test.curl)}
                    className="h-7 border-primary/40 hover:border-primary hover:bg-primary/10"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <pre className="text-xs bg-background/50 p-3 rounded border border-primary/10 overflow-x-auto">
                  <code className="text-muted-foreground font-mono">{test.curl}</code>
                </pre>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogsPanel;
