import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

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
    const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
    
    // Lista de proxies CORS para tentar
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors-proxy.htmldriven.com/?url='
    ];
    
    for (let i = 0; i < corsProxies.length; i++) {
      const proxy = corsProxies[i];
      const proxiedUrl = `${proxy}${encodeURIComponent(apiUrl)}`;
      
      try {
        console.log(`Tentando proxy ${i + 1}/${corsProxies.length}: ${proxy}`);
        setCurrentProxy(`Testando proxy ${i + 1}/${corsProxies.length}...`);
        
        const response = await fetch(proxiedUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Acesso negado. Verifique suas credenciais.');
          } else if (response.status === 404) {
            throw new Error('Servidor IPTV não encontrado.');
          } else {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
        }

        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error('Resposta não é um JSON válido.');
        }
        
        if (!data.user_info) {
          throw new Error('Dados do usuário não encontrados na resposta.');
        }

        console.log(`Sucesso com proxy: ${proxy}`);
        return data;
        
      } catch (error) {
        console.log(`Falha com proxy ${proxy}:`, error);
        
        // Se for o último proxy, lance o erro
        if (i === corsProxies.length - 1) {
          if (error instanceof Error && error.message.includes('Acesso negado')) {
            throw error;
          }
          throw new Error('Todos os proxies falharam. Verifique sua conexão e tente novamente.');
        }
        
        // Continue para o próximo proxy
        continue;
      }
    }
  };

  const fetchContentCounts = async (baseUrl: string, username: string, password: string) => {
    const corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://cors-proxy.htmldriven.com/?url='
    ];

    const fetchWithProxy = async (endpoint: string) => {
      for (const proxy of corsProxies) {
        try {
          const proxiedUrl = `${proxy}${encodeURIComponent(endpoint)}`;
          const response = await fetch(proxiedUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });
          
          if (response.ok) {
            const text = await response.text();
            try {
              return JSON.parse(text);
            } catch {
              return [];
            }
          }
        } catch (error) {
          console.log(`Proxy falhou para ${endpoint}:`, error);
          continue;
        }
      }
      return [];
    };

    try {
      // Fetch channels, VOD e series counts usando proxies
      const [channelsData, vodData, seriesData] = await Promise.all([
        fetchWithProxy(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`),
        fetchWithProxy(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`),
        fetchWithProxy(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_series_categories`)
      ]);

      return {
        channelsCount: Array.isArray(channelsData) ? channelsData.length : 0,
        vodCount: Array.isArray(vodData) ? vodData.length : 0,
        seriesCount: Array.isArray(seriesData) ? seriesData.length : 0,
      };
    } catch (error) {
      console.log('Erro ao buscar estatísticas:', error);
      return {
        channelsCount: 0,
        vodCount: 0,
        seriesCount: 0,
      };
    }
  };

  const analyzeIPTV = async () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL M3U válida.",
        variant: "destructive",
      });
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

      toast({
        title: "Sucesso!",
        description: "Análise IPTV concluída com sucesso.",
      });

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

      toast({
        title: "Erro na análise",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCurrentProxy('');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Usuário</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {result.userData.user_info.username}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.userData.user_info.username, 'Usuário')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Senha</Label>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {result.userData.user_info.password}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.userData.user_info.password, 'Senha')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div>
                    {getStatusBadge(result.userData.user_info.status, result.userData.user_info.auth)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo de Conta</Label>
                  <Badge variant={result.userData.user_info.is_trial === '1' ? 'warning' : 'default'}>
                    {result.userData.user_info.is_trial === '1' ? 'Trial' : 'Normal'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data de Expiração</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {formatDate(result.userData.user_info.exp_date)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Conexões Máximas</Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {result.userData.user_info.max_connections}
                    </span>
                  </div>
                </div>
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
            <CardContent className="space-y-4">
              {(() => {
                const links = generateLinks();
                if (!links) return null;

                return (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Link M3U (TS)</Label>
                      <div className="flex items-center gap-2">
                        <Input value={links.m3u} readOnly className="text-xs" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(links.m3u, 'Link M3U')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Link HLS (M3U8)</Label>
                      <div className="flex items-center gap-2">
                        <Input value={links.hls} readOnly className="text-xs" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(links.hls, 'Link HLS')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Link EPG</Label>
                      <div className="flex items-center gap-2">
                        <Input value={links.epg} readOnly className="text-xs" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(links.epg, 'Link EPG')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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