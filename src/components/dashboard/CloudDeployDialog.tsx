import { useState } from "react";
import { Cloud, Server, Globe, Key, MapPin, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CloudDeployDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CloudDeployDialog = ({ open, onOpenChange }: CloudDeployDialogProps) => {
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const [activeProvider, setActiveProvider] = useState("aws");
  
  const [awsData, setAwsData] = useState({
    region: "",
    accessKeyId: "",
    secretAccessKey: "",
    accountId: "",
  });

  const [azureData, setAzureData] = useState({
    region: "",
    tenantId: "",
    clientId: "",
    clientSecret: "",
    subscriptionId: "",
  });

  const [gcpData, setGcpData] = useState({
    region: "",
    projectId: "",
    clientEmail: "",
    privateKey: "",
  });

  const awsRegions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "sa-east-1", "eu-west-1", "eu-central-1", "ap-southeast-1"
  ];

  const azureRegions = [
    "eastus", "eastus2", "westus", "westus2",
    "brazilsouth", "westeurope", "northeurope", "southeastasia"
  ];

  const gcpRegions = [
    "us-east1", "us-west1", "us-central1",
    "southamerica-east1", "europe-west1", "asia-southeast1"
  ];

  const handleSave = () => {
    const data = activeProvider === "aws" ? awsData : activeProvider === "azure" ? azureData : gcpData;
    
    // Validação básica
    const hasEmptyField = Object.values(data).some(v => !v);
    if (hasEmptyField) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de salvar",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(`cloudConfig_${activeProvider}`, JSON.stringify(data));
    
    toast({
      title: "Configuração salva",
      description: `Credenciais ${activeProvider.toUpperCase()} salvas com sucesso`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold neon-text flex items-center gap-2" style={{ color: 'hsl(180 100% 65%)' }}>
            <Cloud className="h-6 w-6" />
            Deploy em Cloud
          </DialogTitle>
          <DialogDescription className="text-base">
            Configure suas credenciais para deploy na nuvem
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeProvider} onValueChange={setActiveProvider} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aws" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              AWS
            </TabsTrigger>
            <TabsTrigger value="azure" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Azure
            </TabsTrigger>
            <TabsTrigger value="gcp" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              GCP
            </TabsTrigger>
          </TabsList>

          {/* AWS */}
          <TabsContent value="aws" className="mt-6 space-y-4">
            <div className="glass rounded-lg p-5 space-y-4 border border-primary/20">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Região
                </Label>
                <Select value={awsData.region} onValueChange={(v) => setAwsData({ ...awsData, region: v })}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    {awsRegions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input
                  placeholder="123456789012"
                  value={awsData.accountId}
                  onChange={(e) => setAwsData({ ...awsData, accountId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Access Key ID
                </Label>
                <Input
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={awsData.accessKeyId}
                  onChange={(e) => setAwsData({ ...awsData, accessKeyId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Secret Access Key</Label>
                <div className="relative">
                  <Input
                    type={showSecret ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={awsData.secretAccessKey}
                    onChange={(e) => setAwsData({ ...awsData, secretAccessKey: e.target.value })}
                    className="border-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Azure */}
          <TabsContent value="azure" className="mt-6 space-y-4">
            <div className="glass rounded-lg p-5 space-y-4 border border-primary/20">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Região
                </Label>
                <Select value={azureData.region} onValueChange={(v) => setAzureData({ ...azureData, region: v })}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    {azureRegions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subscription ID</Label>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={azureData.subscriptionId}
                  onChange={(e) => setAzureData({ ...azureData, subscriptionId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Tenant ID</Label>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={azureData.tenantId}
                  onChange={(e) => setAzureData({ ...azureData, tenantId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Client ID
                </Label>
                <Input
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={azureData.clientId}
                  onChange={(e) => setAzureData({ ...azureData, clientId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Client Secret</Label>
                <div className="relative">
                  <Input
                    type={showSecret ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={azureData.clientSecret}
                    onChange={(e) => setAzureData({ ...azureData, clientSecret: e.target.value })}
                    className="border-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* GCP */}
          <TabsContent value="gcp" className="mt-6 space-y-4">
            <div className="glass rounded-lg p-5 space-y-4 border border-primary/20">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Região
                </Label>
                <Select value={gcpData.region} onValueChange={(v) => setGcpData({ ...gcpData, region: v })}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    {gcpRegions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project ID</Label>
                <Input
                  placeholder="my-project-123"
                  value={gcpData.projectId}
                  onChange={(e) => setGcpData({ ...gcpData, projectId: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Client Email
                </Label>
                <Input
                  placeholder="service-account@project.iam.gserviceaccount.com"
                  value={gcpData.clientEmail}
                  onChange={(e) => setGcpData({ ...gcpData, clientEmail: e.target.value })}
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label>Private Key</Label>
                <div className="relative">
                  <Input
                    type={showSecret ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    value={gcpData.privateKey}
                    onChange={(e) => setGcpData({ ...gcpData, privateKey: e.target.value })}
                    className="border-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-primary/30 hover:border-primary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 gap-2 bg-primary hover:bg-primary/90 neon-glow"
            onClick={handleSave}
          >
            <Cloud className="h-4 w-4" />
            Salvar Configuração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CloudDeployDialog;
