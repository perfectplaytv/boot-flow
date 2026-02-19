import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-6xl font-bold text-destructive">403</h1>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">Acesso Negado</h2>
      <p className="mt-2 text-muted-foreground">
        Você não tem permissão para visualizar esta página.
      </p>
      <p className="text-muted-foreground">
        Se você acredita que isso é um erro, entre em contato com o suporte.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link to="/">Voltar para a Home</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
