import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { useCobrancas } from '@/hooks/useCobrancas';
import { useRevendas } from '@/hooks/useRevendas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Users, CreditCard, Store, LogOut, User } from 'lucide-react';

export const SupabaseExample: React.FC = () => {
  const { user, signOut } = useAuth();
  const { users, loading: usersLoading, error: usersError, addUser } = useUsers();
  const { cobrancas, loading: cobrancasLoading, error: cobrancasError } = useCobrancas();
  const { revendas, loading: revendasLoading, error: revendasError } = useRevendas();

  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = async () => {
    setIsAddingUser(true);
    try {
      await addUser({
        name: `Usuário Teste ${Date.now()}`,
        email: `teste${Date.now()}@example.com`,
        observations: 'Usuário criado via exemplo'
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com informações do usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Último login:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}</p>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : users.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de usuários cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobranças</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cobrancasLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : cobrancas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de cobranças
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revendedores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revendasLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : revendas.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de revendedores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Exemplo</CardTitle>
          <CardDescription>
            Demonstração das funcionalidades da integração com Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleAddUser} disabled={isAddingUser}>
            {isAddingUser && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Adicionar Usuário de Teste
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Recentes</CardTitle>
          <CardDescription>
            Últimos usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersError && (
            <div className="text-red-500 mb-4">
              Erro ao carregar usuários: {usersError}
            </div>
          )}
          
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum usuário encontrado
            </p>
          ) : (
            <div className="space-y-2">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="secondary">
                    {user.status || 'Ativo'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Cobranças */}
      <Card>
        <CardHeader>
          <CardTitle>Cobranças Recentes</CardTitle>
          <CardDescription>
            Últimas cobranças registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cobrancasError && (
            <div className="text-red-500 mb-4">
              Erro ao carregar cobranças: {cobrancasError}
            </div>
          )}
          
          {cobrancasLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : cobrancas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma cobrança encontrada
            </p>
          ) : (
            <div className="space-y-2">
              {cobrancas.slice(0, 5).map((cobranca) => (
                <div key={cobranca.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{cobranca.cliente}</p>
                    <p className="text-sm text-muted-foreground">{cobranca.descricao}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {cobranca.valor?.toFixed(2)}</p>
                    <Badge variant={cobranca.status === 'Pago' ? 'default' : 'secondary'}>
                      {cobranca.status || 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Revendedores */}
      <Card>
        <CardHeader>
          <CardTitle>Revendedores</CardTitle>
          <CardDescription>
            Lista de revendedores cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {revendasError && (
            <div className="text-red-500 mb-4">
              Erro ao carregar revendedores: {revendasError}
            </div>
          )}
          
          {revendasLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : revendas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum revendedor encontrado
            </p>
          ) : (
            <div className="space-y-2">
              {revendas.slice(0, 5).map((revenda) => (
                <div key={revenda.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{revenda.personal_name || revenda.username}</p>
                    <p className="text-sm text-muted-foreground">{revenda.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Créditos: {revenda.credits || 0}</p>
                    <Badge variant={revenda.status === 'Ativo' ? 'default' : 'secondary'}>
                      {revenda.status || 'Inativo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 