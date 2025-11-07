import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Error = () => {
  const location = useLocation();
  const errorMessage = location.state?.message || "Algo deu errado";
  const errorCode = location.state?.code || "500";
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("Error page accessed:", { code: errorCode, message: errorMessage });
  }, [errorCode, errorMessage]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.history.back();
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <AlertTriangle 
              className="w-24 h-24 text-destructive animate-pulse" 
              strokeWidth={1.5} 
            />
            <div className="absolute inset-0 blur-xl bg-destructive/30 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold neon-text bg-gradient-to-r from-destructive via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-scale-in">
            {errorCode}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground animate-fade-in">
            Oops! Algo deu errado
          </p>
          <Alert variant="destructive" className="text-left max-w-md mx-auto">
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Não se preocupe, estamos trabalhando para resolver isso. Tente novamente em alguns instantes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            variant="default"
            size="lg"
            onClick={handleRetry}
            disabled={isRetrying}
            className="neon-glow group hover-scale"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            {isRetrying ? 'Tentando...' : 'Tentar Novamente'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            asChild
            className="glass hover:glass-strong hover-scale"
          >
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
        </div>

        <div className="pt-6 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Problema persiste?
          </p>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Entre em contato com o suporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;