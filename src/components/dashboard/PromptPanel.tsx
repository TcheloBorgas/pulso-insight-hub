import { useState } from "react";
import { Send, Trash2, Copy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import FileTree from "./FileTree";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface PromptHistory {
  id: string;
  text: string;
  timestamp: Date;
}

const PromptPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [fileStructure, setFileStructure] = useState<FileNode[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    setLoading(true);
    
    // Simular envio e geração de estrutura de arquivos
    setTimeout(() => {
      const id = `REQ-${Date.now().toString(36).toUpperCase()}`;
      setRequestId(id);
      
      const newEntry: PromptHistory = {
        id,
        text: prompt,
        timestamp: new Date(),
      };
      
      setHistory([newEntry, ...history.slice(0, 4)]);
      
      // Estrutura de arquivos de exemplo baseada no prompt
      const mockStructure: FileNode[] = [
        {
          name: "src",
          type: "folder",
          children: [
            {
              name: "components",
              type: "folder",
              children: [
                { name: "Header.tsx", type: "file" },
                { name: "Footer.tsx", type: "file" },
              ],
            },
            {
              name: "pages",
              type: "folder",
              children: [
                { name: "Home.tsx", type: "file" },
                { name: "Dashboard.tsx", type: "file" },
              ],
            },
            {
              name: "services",
              type: "folder",
              children: [
                { name: "api.ts", type: "file" },
              ],
            },
            { name: "App.tsx", type: "file" },
          ],
        },
        { name: "package.json", type: "file" },
        { name: "README.md", type: "file" },
      ];
      
      setFileStructure(mockStructure);
      setLoading(false);
      
      toast({
        title: "Prompt enviado",
        description: `ID da requisição: ${id}`,
      });
    }, 1000);
  };

  const handleClear = () => {
    setPrompt("");
    setRequestId(null);
    setFileStructure(null);
  };

  const handleCopyId = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId);
      toast({
        title: "ID copiado",
        description: "ID da requisição copiado para a área de transferência",
      });
    }
  };

  const handleReusePrompt = (text: string) => {
    setPrompt(text);
    document.getElementById('prompt-input')?.focus();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Pulso CSA
        </h2>
        <p className="text-sm text-muted-foreground">
          Atalho: Alt+P
        </p>
      </div>

      <div className="space-y-3">
        <Textarea
          id="prompt-input"
          placeholder="Ex.: 'Gerar blueprint de pastas e endpoints para um sistema de gestão de pedidos...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit} 
            disabled={!prompt.trim() || loading}
            className="flex-1"
          >
            {loading ? "Enviando..." : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Prompt
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={!prompt && !requestId}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {requestId && (
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
            <span className="text-sm font-mono text-foreground flex-1">
              ID: {requestId}
            </span>
            <Button variant="ghost" size="icon" onClick={handleCopyId}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {fileStructure && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Estrutura de Arquivos Gerada
            </h3>
            <span className="text-xs text-muted-foreground">
              {requestId}
            </span>
          </div>
          <div className="bg-secondary/30 rounded-md p-3 max-h-96 overflow-y-auto">
            <FileTree structure={fileStructure} />
          </div>
        </div>
      )}


      {history.length > 0 && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Histórico recente
          </h3>
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleReusePrompt(item.text)}
                className="w-full text-left p-3 rounded-md bg-secondary hover:bg-secondary/80 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground line-clamp-2 flex-1">
                    {item.text}
                  </p>
                  <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Reusar
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!prompt && !requestId && history.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Descreva sua solicitação para começarmos
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptPanel;
