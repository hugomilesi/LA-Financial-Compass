import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">SFI</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Sistema Financeiro Inteligente</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar para página inicial
          </Button>
        </div>

        {/* Auth Form */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Entrar na sua conta' : 'Criar nova conta'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Acesse sua plataforma de gestão financeira'
                : 'Comece a transformar sua gestão financeira'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? <LoginForm /> : <SignupForm />}
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button
                variant="link"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="p-0 h-auto font-medium"
              >
                {mode === 'login' ? 'Criar conta' : 'Fazer login'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};