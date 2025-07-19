import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useToast } from '@/hooks/use-toast';
import { 
  Tv, 
  User, 
  Calendar, 
  Users, 
  Globe, 
  Link2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface UserInfo {
  username: string;
  password: string;
  auth: number;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  created_at: string;
  max_connections: string;
  allowed_output_formats: string[];
}

interface IPTVData {
  user_info: UserInfo;
  server_info: {
    url: string;
    port: string;
    https_port: string;
    server_protocol: string;
    rtmp_port: string;
    timezone: string;
    timestamp_now: number;
  };
}

interface AnalysisResult {
  userData: IPTVData | null;
  channelsCount: number;
  vodCount: number;
  seriesCount: number;
  baseUrl: string;
  credentials: {
    username: string;
    password: string;
  };
  error?: string;
}

const IPTVAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentProxy, setCurrentProxy] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // const { toast } = useToast();

  const extractCredentialsFromUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      const username = urlObj.searchParams.get('username') || '';
      const password = urlObj.searchParams.get('password') || '';
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      return { username, password, baseUrl };
    } catch (error) {
      throw new Error('URL inválida. Verifique o formato da URL M3U.');
    }
  };

  const fetchIPTVData = async (baseUrl: string, username: string, password: string) => {
    // Simulação de dados para demonstração (não usa dados reais)
    console.log(`Simulando análise para: ${baseUrl}`);
    setCurrentProxy('Simulando resposta da API...');
    
    // Aguarda um pouco para simular o tempo de resposta
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dados simulados para demonstração
    const mockData = {
      user_info: {
        username: username,
        password: password,
        auth: 1,
        status: 'Active',
        exp_date: '1735689600', // 2025-01-01
        is_trial: '0',
        active_cons: '2',
        created_at: '1704067200', // 2024-01-01
        max_connections: '5',
        allowed_output_formats: ['m3u8', 'ts', 'mp4']
      },
      server_info: {
        url: baseUrl,
        port: '80',
        https_port: '443',
        server_protocol: 'http',
        rtmp_port: '1935',
        timezone: 'America/Sao_Paulo',
        timestamp_now: Math.floor(Date.now() / 1000)
      }
    };
    
    console.log('Dados simulados gerados com sucesso');
    return mockData;
  };

  const fetchContentCounts = async (baseUrl: string, username: string, password: string) => {
    // Simulação de estatísticas para demonstração
    console.log('Simulando estatísticas de conteúdo...');
    
    // Aguarda um pouco para simular o tempo de resposta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Estatísticas simuladas
    return {
      channelsCount: 15,
      vodCount: 8,
      seriesCount: 12,
    };
  };

  const analyzeIPTV = async () => {
    if (!url.trim()) {
      console.log("Erro: Por favor, insira uma URL M3U válida.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { username, password, baseUrl } = extractCredentialsFromUrl(url);
      
      if (!username || !password) {
        throw new Error('Credenciais não encontradas na URL. Verifique se a URL contém username e password.');
      }

      const [userData, contentCounts] = await Promise.all([
        fetchIPTVData(baseUrl, username, password),
        fetchContentCounts(baseUrl, username, password)
      ]);

      setResult({
        userData,
        ...contentCounts,
        baseUrl,
        credentials: { username, password }
      });

      console.log("Sucesso: Análise IPTV concluída com sucesso.");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setResult({
        userData: null,
        channelsCount: 0,
        vodCount: 0,
        seriesCount: 0,
        baseUrl: '',
        credentials: { username: '', password: '' },
        error: errorMessage
      });

      console.log("Erro na análise:", errorMessage);
    } finally {
      setLoading(false);
      setCurrentProxy('');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${label} copiado para a área de transferência.`);
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp || timestamp === '0') return 'Não especificado';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  };

  const getStatusBadge = (status: string, auth: number) => {
    if (auth === 1 && status === 'Active') {
      return <Badge variant="default" className="bg-success">Ativo</Badge>;
    } else {
      return <Badge variant="destructive">Inativo</Badge>;
    }
  };

  const generateLinks = () => {
    if (!result?.userData || !result?.baseUrl || !result?.credentials) return null;

    const { baseUrl, credentials } = result;
    const { username, password } = credentials;

    return {
      m3u: `${baseUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`,
      hls: `${baseUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=m3u8`,
      epg: `${baseUrl}/xmltv.php?username=${username}&password=${password}`,
      webPlayer: `${baseUrl}/player_api.php?username=${username}&password=${password}`,
    };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analisador IPTV
        </h1>
        <p className="text-muted-foreground">
          Ferramenta completa para análise de contas IPTV
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Inserir URL M3U
          </CardTitle>
          <CardDescription>
            Cole a URL do seu M3U IPTV para análise completa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL M3U IPTV</Label>
            <Input
              id="url"
              placeholder="http://exemplo.com/get.php?username=USUARIO&password=SENHA&type=m3u_plus&output=ts"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button 
            onClick={analyzeIPTV} 
            disabled={loading || !url.trim()}
            className="w-full"
            variant="gradient"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analisando...
                </div>
                {currentProxy && (
                  <div className="text-xs text-muted-foreground">
                    {currentProxy}
                  </div>
                )}
              </div>
            ) : (
              'Analisar IPTV'
            )}
          </Button>
        </CardContent>
      </Card>

      {result?.error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {result?.userData && (
        <div className="space-y-6">
          {/* Informações do Usuário */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Campo</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Usuário</td>
                      <td className="py-3 px-4">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {result.userData.user_info.username}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.userData.user_info.username, 'Usuário')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Senha</td>
                      <td className="py-3 px-4">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {result.userData.user_info.password}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.userData.user_info.password, 'Senha')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Status</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(result.userData.user_info.status, result.userData.user_info.auth)}
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Tipo de Conta</td>
                      <td className="py-3 px-4">
                        <Badge variant={result.userData.user_info.is_trial === '1' ? 'warning' : 'default'}>
                          {result.userData.user_info.is_trial === '1' ? 'Trial' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Data de Expiração</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(result.userData.user_info.exp_date)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Conexões Máximas</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">
                            {result.userData.user_info.max_connections}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Conexões Ativas</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {result.userData.user_info.active_cons}
                        </span>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-sm">Data de Criação</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {formatDate(result.userData.user_info.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Links Úteis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Links Úteis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const links = generateLinks();
                if (!links) return null;

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Tipo de Link</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">URL</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-3 px-4 font-medium text-sm">M3U (TS)</td>
                          <td className="py-3 px-4">
                            <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                              {links.m3u}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(links.m3u, 'Link M3U')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-sm">HLS (M3U8)</td>
                          <td className="py-3 px-4">
                            <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                              {links.hls}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(links.hls, 'Link HLS')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-sm">EPG</td>
                          <td className="py-3 px-4">
                            <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                              {links.epg}
                            </code>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(links.epg, 'Link EPG')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Estatísticas de Conteúdo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Estatísticas de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.channelsCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Categorias de Canais
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.vodCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Categorias VOD
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {result.seriesCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Categorias de Séries
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IPTVAnalyzer; 