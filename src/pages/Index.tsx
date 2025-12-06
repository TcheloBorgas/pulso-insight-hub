import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Database, Zap, Sparkles, ArrowRight, Cloud } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Pulso CSA",
      description: "Gere código completo com IA. Descreva seu projeto e receba estrutura de pastas, APIs e arquitetura pronta.",
      color: "primary",
      glowColor: "rgba(0,255,255,0.6)"
    },
    {
      icon: Cloud,
      title: "Cloud IaC",
      description: "Infraestrutura como código para AWS, Azure e GCP. Deploy automatizado com Terraform.",
      color: "primary",
      glowColor: "rgba(0,255,255,0.6)"
    },
    {
      icon: Activity,
      title: "FinOps",
      description: "Otimize custos na nuvem. Análises em tempo real e sugestões automáticas de economia.",
      color: "finops",
      glowColor: "rgba(0,255,153,0.6)"
    },
    {
      icon: Database,
      title: "Data AI",
      description: "Explore dados com IA. Visualizações automatizadas e machine learning sem código.",
      color: "dataAi",
      glowColor: "rgba(191,0,255,0.6)"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-finops/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-dataAi/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-finops flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/40 blur-lg" />
          </div>
          <span className="text-xl font-bold text-foreground">Pulso Tech</span>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/auth")}
          className="border-primary/40 hover:border-primary hover:bg-primary/10 text-foreground"
        >
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-16 lg:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Plataforma de Desenvolvimento com IA</span>
          </div>

          {/* Main Title */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in tracking-tight"
            style={{ 
              background: 'linear-gradient(135deg, hsl(180 100% 70%) 0%, hsl(180 100% 50%) 50%, hsl(150 100% 60%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animationDelay: '0.1s'
            }}
          >
            Pulso Tech
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Plataforma completa para desenvolvimento, deploy e gestão de aplicações modernas com inteligência artificial
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary-deep hover:from-primary-light hover:to-primary text-background rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)]"
            >
              <span>Começar Agora</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mx-auto mt-24 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in cursor-default"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                  style={{ background: `radial-gradient(circle at center, ${feature.glowColor}, transparent 70%)` }}
                />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-lg font-bold text-${feature.color} mb-2`}>
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </main>
    </div>
  );
};

export default Index;
