import { useState } from "react";
import { Send, Cloud, Server, Settings, History, Trash2, Copy, FolderOpen, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
  provider?: "aws" | "azure" | "gcp";
  resources?: string[];
  codeBlock?: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  provider: "aws" | "azure" | "gcp";
  timestamp: Date;
  status: "success" | "pending" | "error";
}

const CloudChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<"aws" | "azure" | "gcp">("aws");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  const quickActions = [
    "Criar VPC com subnets públicas e privadas",
    "Deploy de container ECS com load balancer",
    "Configurar banco RDS PostgreSQL",
    "Setup de bucket S3 com CloudFront",
  ];

  const providerColors = {
    aws: "hsl(35 100% 55%)",
    azure: "hsl(210 100% 55%)",
    gcp: "hsl(4 80% 55%)",
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      provider: activeProvider,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    // Adicionar ao histórico
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      prompt: input,
      provider: activeProvider,
      timestamp: new Date(),
      status: "pending",
    };
    setHistory([historyItem, ...history.slice(0, 9)]);

    // Simular resposta de criação de infraestrutura
    setTimeout(() => {
      const terraformCode = `# Terraform - ${activeProvider.toUpperCase()}
resource "${activeProvider === 'aws' ? 'aws_vpc' : activeProvider === 'azure' ? 'azurerm_virtual_network' : 'google_compute_network'}" "main" {
  name       = "main-network"
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name        = "main"
    Environment = "production"
  }
}`;

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: `Infraestrutura gerada para ${activeProvider.toUpperCase()}. Baseado no seu prompt, criei os seguintes recursos:`,
        timestamp: new Date(),
        provider: activeProvider,
        resources: [
          "VPC com CIDR 10.0.0.0/16",
          "2 Subnets públicas (10.0.1.0/24, 10.0.2.0/24)",
          "2 Subnets privadas (10.0.10.0/24, 10.0.20.0/24)",
          "Internet Gateway",
          "NAT Gateway",
          "Route Tables configuradas",
        ],
        codeBlock: terraformCode,
      };

      setMessages((prev) => [...prev, systemMessage]);
      setHistory((prev) => 
        prev.map((item, idx) => 
          idx === 0 ? { ...item, status: "success" as const } : item
        )
      );
      setLoading(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const handleReuseHistory = (item: HistoryItem) => {
    setActiveProvider(item.provider);
    setInput(item.prompt);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado",
      description: "Terraform copiado para a área de transferência",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico foi removido",
    });
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden border-2 border-cyan-500/30" style={{ boxShadow: '0 0 30px rgba(0, 200, 255, 0.2)' }}>
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'hsl(190 100% 65%)' }}>
          <Cloud className="h-5 w-5" style={{ color: 'hsl(190 100% 65%)' }} />
          Cloud Infrastructure
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crie infraestruturas usando linguagem natural ou caminhos de arquivo
        </p>
      </div>

      {/* Provider Tabs */}
      <div className="p-4 border-b border-cyan-500/20">
        <Tabs value={activeProvider} onValueChange={(v) => setActiveProvider(v as typeof activeProvider)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aws" className="flex items-center gap-2 data-[state=active]:bg-orange-500/20">
              <Server className="h-4 w-4" />
              AWS
            </TabsTrigger>
            <TabsTrigger value="azure" className="flex items-center gap-2 data-[state=active]:bg-blue-500/20">
              <Cloud className="h-4 w-4" />
              Azure
            </TabsTrigger>
            <TabsTrigger value="gcp" className="flex items-center gap-2 data-[state=active]:bg-red-500/20">
              <Settings className="h-4 w-4" />
              GCP
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Chat Area */}
        <div className="lg:col-span-2 border-r border-cyan-500/20">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Cloud className="h-12 w-12 text-cyan-400/50" />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    Descreva a infraestrutura que deseja criar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use linguagem natural ou informe o caminho de um arquivo de configuração
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="pt-4 w-full max-w-md">
                  <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickActions.map((action, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="text-xs border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-cyan-500/20 border border-cyan-500/30"
                        : "bg-background/50 border border-border/50"
                    }`}
                  >
                    {message.provider && (
                      <Badge 
                        variant="outline" 
                        className="mb-2 text-xs"
                        style={{ borderColor: providerColors[message.provider], color: providerColors[message.provider] }}
                      >
                        {message.provider.toUpperCase()}
                      </Badge>
                    )}
                    
                    <p className="text-sm text-foreground">{message.content}</p>
                    
                    {message.resources && (
                      <div className="mt-3 space-y-2 p-3 bg-background/30 rounded border border-cyan-500/20">
                        <p className="text-xs font-semibold flex items-center gap-1 text-cyan-400">
                          <FolderOpen className="h-3 w-3" />
                          Recursos criados:
                        </p>
                        <ul className="space-y-1 text-xs">
                          {message.resources.map((resource, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {message.codeBlock && (
                      <div className="mt-3 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileCode className="h-3 w-3" />
                            Terraform
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(message.codeBlock!)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <pre className="bg-background/50 rounded p-3 text-xs font-mono overflow-x-auto border border-cyan-500/20">
                          {message.codeBlock}
                        </pre>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background/50 border border-border/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                    </div>
                    <span className="text-sm text-muted-foreground">Gerando infraestrutura...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-cyan-500/20">
            <div className="flex gap-2">
              <Input
                placeholder="Ex.: 'Criar VPC com 2 subnets públicas e 2 privadas' ou 'C:\infra\main.tf'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="border-cyan-500/30 focus-visible:ring-cyan-500"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || loading}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="bg-background/30">
          <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
              <History className="h-4 w-4" />
              Histórico
            </h3>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="h-[400px] overflow-y-auto p-2 space-y-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <History className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Nenhum histórico ainda
                </p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleReuseHistory(item)}
                  className="w-full text-left p-3 rounded-lg bg-background/50 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] shrink-0"
                      style={{ 
                        borderColor: providerColors[item.provider], 
                        color: providerColors[item.provider] 
                      }}
                    >
                      {item.provider.toUpperCase()}
                    </Badge>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status === 'success' ? '✓' : item.status === 'error' ? '✗' : '...'}
                    </span>
                  </div>
                  <p className="text-xs text-foreground line-clamp-2 mt-2">
                    {item.prompt}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {item.timestamp.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudChat;
