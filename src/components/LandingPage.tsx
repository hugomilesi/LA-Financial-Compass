import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Check, ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
  const features = [
    {
      title: "Dashboard Intuitivo",
      description: "Visualize seus KPIs e métricas financeiras em tempo real com gráficos interativos e relatórios personalizados."
    },
    {
      title: "Análise de Performance",
      description: "Compare o desempenho entre unidades e períodos com insights automáticos baseados em IA."
    },
    {
      title: "Relatórios DRE",
      description: "Gere demonstrativos de resultado automatizados com estruturas personalizáveis por unidade."
    },
    {
      title: "Planejamento Financeiro",
      description: "Defina metas e projete cenários futuros com ferramentas avançadas de planejamento."
    }
  ];

  const benefits = [
    "Tomada de decisão mais rápida e assertiva",
    "Visibilidade completa da performance financeira",
    "Redução de tempo em relatórios manuais",
    "Identificação automática de oportunidades"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SFI</span>
            </div>
            <span className="text-xl font-bold text-foreground">Sistema Financeiro Inteligente</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={onLoginClick}>
              Entrar
            </Button>
            <Button onClick={onSignupClick}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary-100 text-primary-800 hover:bg-primary-200">
            Gestão Financeira Inteligente
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transforme sua
            <span className="text-primary block">Gestão Financeira</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Uma plataforma completa para monitoramento de KPIs, análise de performance 
            e tomada de decisões estratégicas em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onSignupClick} className="text-lg px-8">
              Começar Gratuitamente
            </Button>
            <Button size="lg" variant="outline" onClick={onLoginClick} className="text-lg px-8">
              Fazer Login
            </Button>
          </div>
          <div className="mt-16 animate-bounce">
            <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para uma gestão financeira eficiente e estratégica
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-primary rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Por que escolher o Sistema Financeiro Inteligente?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Nossa plataforma oferece insights precisos e automação inteligente 
                para maximizar seus resultados financeiros.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
              <div className="bg-background rounded-xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">+150%</div>
                  <div className="text-muted-foreground">Aumento na eficiência</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Pronto para transformar sua gestão?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo e veja como nossa plataforma pode revolucionar 
            seus processos financeiros.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={onSignupClick}
            className="text-lg px-8"
          >
            Começar Agora - É Gratuito
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SFI</span>
            </div>
            <span className="text-xl font-bold text-foreground">Sistema Financeiro Inteligente</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Sistema Financeiro Inteligente. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};