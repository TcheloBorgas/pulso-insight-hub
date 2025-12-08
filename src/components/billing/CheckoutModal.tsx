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
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Lock, 
  Check,
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";

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
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvc || !cardName || !email) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    toast.success(`Assinatura do plano ${plan?.name} realizada com sucesso!`);
    onClose();
    
    // Reset form
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCardName("");
    setEmail("");
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
              />
            </div>

            <Separator className="bg-primary/20" />

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-sm font-medium">
                Nome no Cartão
              </Label>
              <Input
                id="cardName"
                placeholder="Nome completo"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="glass border-primary/30 focus:border-primary/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-medium">
                Número do Cartão
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="glass border-primary/30 focus:border-primary/60 pr-12"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm font-medium">
                  Validade
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="glass border-primary/30 focus:border-primary/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-sm font-medium">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="glass border-primary/30 focus:border-primary/60"
                />
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
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Confirmar Pagamento
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
