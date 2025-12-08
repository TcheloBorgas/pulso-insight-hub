import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Lock, 
  Check,
  Loader2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

const SUPABASE_URL = "https://mcjgpkbxjthkqvmgpzba.supabase.co";

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  hasDiscount: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const CheckoutModal = ({ isOpen, onClose, plan }: CheckoutModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardName || !email) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!plan) {
      toast.error("Plano não selecionado");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: plan.billingCycle,
          hasApiKey: plan.hasDiscount,
          email,
          cardholderName: cardName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de checkout');
      }

      if (data?.url) {
        // Open Stripe Checkout in new tab
        window.open(data.url, '_blank');
        toast.success('Redirecionando para o checkout seguro do Stripe...');
        onClose();
        
        // Reset form
        setCardName("");
        setEmail("");
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-strong border-2 border-primary/40 p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-finops/20 p-6 border-b border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <span className="neon-text">Checkout</span>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Plan Summary */}
          <div className="p-6 border-b border-primary/20 bg-card/30">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.billingCycle === "monthly" ? "Cobrança mensal" : "Cobrança anual"}
                </p>
                {plan.hasDiscount && (
                  <span className="text-xs text-finops font-medium">
                    ✨ 15% de desconto aplicado
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  USD$ {plan.price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  /{plan.billingCycle === "monthly" ? "mês" : "ano"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass border-primary/30 focus:border-primary/60"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-sm font-medium">
                Nome Completo
              </Label>
              <Input
                id="cardName"
                placeholder="Seu nome completo"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="glass border-primary/30 focus:border-primary/60"
                required
              />
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-finops" />
                <span>Os dados do cartão serão coletados de forma segura pelo Stripe</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-finops hover:from-primary/90 hover:to-finops/90 border-0 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 h-12 text-base font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando sessão...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Continuar para Pagamento
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Pagamento seguro processado via Stripe</span>
              </div>
            </div>
          </form>

          {/* Features */}
          <div className="p-4 bg-card/20 border-t border-primary/20">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-finops" />
                <span>Cancele a qualquer momento</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-finops" />
                <span>Suporte 24/7</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-finops" />
                <span>Garantia de 30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
