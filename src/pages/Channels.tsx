import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Tv, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Activity,
  TrendingUp,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Channel {
  id: string;
  name: string;
  category: string;
  url: string;
  status: 'Ativo' | 'Inativo' | 'Manutenção';
  viewers: number;
  quality: 'HD' | 'FHD' | '4K';
  language: string;
  region: string;
}

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Globo',
      category: 'Entretenimento',
      url: 'https://globo.com/live',
      status: 'Ativo',
      viewers: 15420,
      quality: 'FHD',
      language: 'Português',
      region: 'Brasil'
    },
    {
      id: '2',
      name: 'SBT',
      category: 'Entretenimento',
      url: 'https://sbt.com/live',
      status: 'Ativo',
      viewers: 12350,
      quality: 'HD',
      language: 'Português',
      region: 'Brasil'
    },
    {
      id: '3',
      name: 'Record',
      category: 'Entretenimento',
      url: 'https://record.com/live',
      status: 'Ativo',
      viewers: 9870,
      quality: 'HD',
      language: 'Português',
      region: 'Brasil'
    },
    {
      id: '4',
      name: 'Band',
      category: 'Notícias',
      url: 'https://band.com/live',
      status: 'Manutenção',
      viewers: 0,
      quality: 'HD',
      language: 'Português',
      region: 'Brasil'
    },
    {
      id: '5',
      name: 'CNN Brasil',
      category: 'Notícias',
      url: 'https://cnnbrasil.com/live',
      status: 'Ativo',
      viewers: 5430,
      quality: 'FHD',
      language: 'Português',
      region: 'Brasil'
    },
    {
      id: '6',
      name: 'ESPN Brasil',
      category: 'Esportes',
      url: 'https://espn.com/brasil/live',
      status: 'Ativo',
      viewers: 8760,
      quality: 'FHD',
      language: 'Português',
      region: 'Brasil'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>(channels);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    category: '',
    url: '',
    quality: 'HD' as 'HD' | 'FHD' | '4K',
    language: '',
    region: ''
  });

  // Calcular métricas
  const totalChannels = channels.length;
  const activeChannels = channels.filter(c => c.status === 'Ativo').length;
  const totalViewers = channels.reduce((sum, c) => sum + c.viewers, 0);
  const averageViewers = Math.round(totalViewers / activeChannels);

  // Filtrar canais
  React.useEffect(() => {
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.language.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChannels(filtered);
  }, [searchTerm, channels]);

  const handleAddChannel = () => {
    if (!newChannel.name || !newChannel.category || !newChannel.url) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const channel: Channel = {
      id: Date.now().toString(),
      name: newChannel.name,
      category: newChannel.category,
      url: newChannel.url,
      status: 'Ativo',
      viewers: 0,
      quality: newChannel.quality,
      language: newChannel.language,
      region: newChannel.region
    };

    setChannels(prev => [...prev, channel]);
    setNewChannel({
      name: '',
      category: '',
      url: '',
      quality: 'HD',
      language: '',
      region: ''
    });
    setAddModalOpen(false);
    toast.success(`${channel.name} adicionado com sucesso!`);
  };

  const handleDeleteChannel = (channel: Channel) => {
    if (confirm(`Tem certeza que deseja excluir ${channel.name}?`)) {
      setChannels(prev => prev.filter(c => c.id !== channel.id));
      toast.success(`${channel.name} excluído com sucesso!`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'Inativo': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'Manutenção': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'FHD': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'HD': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Canais</h1>
          <p className="text-gray-400 mt-1">Gerencie todos os canais de TV e streaming</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          + Novo Canal
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Canais
            </CardTitle>
            <Tv className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalChannels}</div>
            <p className="text-xs text-gray-400">{activeChannels} ativos</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Espectadores Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalViewers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Total de visualizações</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Média por Canal
            </CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageViewers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Espectadores por canal</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Qualidade Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">FHD</div>
            <p className="text-xs text-gray-400">Qualidade predominante</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Canais */}
      <Card className="border-gray-700" style={{ backgroundColor: '#1F2937' }}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Lista de Canais</CardTitle>
              <p className="text-sm text-gray-400">
                {filteredChannels.length} canais encontrados
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar canais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Canal</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Qualidade</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Espectadores</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Idioma</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Região</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredChannels.map((channel) => (
                  <tr key={channel.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{channel.name}</div>
                      <div className="text-sm text-gray-400">{channel.url}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                        {channel.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getQualityColor(channel.quality)}>
                        {channel.quality}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{channel.viewers.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{channel.language}</td>
                    <td className="py-3 px-4 text-white">{channel.region}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(channel.status)}>
                        {channel.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Visualizando ${channel.name}`)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Editando ${channel.name}`)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteChannel(channel)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Adicionar Canal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Novo Canal</DialogTitle>
            <DialogDescription className="text-gray-400">
              Adicione um novo canal ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name" className="text-gray-300">Nome do Canal *</Label>
                <Input
                  id="channel-name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Nome do canal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-category" className="text-gray-300">Categoria *</Label>
                <Select value={newChannel.category} onValueChange={(value) => setNewChannel({...newChannel, category: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                    <SelectItem value="Notícias">Notícias</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                    <SelectItem value="Filmes">Filmes</SelectItem>
                    <SelectItem value="Séries">Séries</SelectItem>
                    <SelectItem value="Infantil">Infantil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel-url" className="text-gray-300">URL do Stream *</Label>
              <Input
                id="channel-url"
                value={newChannel.url}
                onChange={(e) => setNewChannel({...newChannel, url: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://exemplo.com/stream"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel-quality" className="text-gray-300">Qualidade</Label>
                <Select value={newChannel.quality} onValueChange={(value: any) => setNewChannel({...newChannel, quality: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="FHD">FHD</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-language" className="text-gray-300">Idioma</Label>
                <Input
                  id="channel-language"
                  value={newChannel.language}
                  onChange={(e) => setNewChannel({...newChannel, language: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Português"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-region" className="text-gray-300">Região</Label>
                <Input
                  id="channel-region"
                  value={newChannel.region}
                  onChange={(e) => setNewChannel({...newChannel, region: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Brasil"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddChannel} className="bg-purple-600 hover:bg-purple-700">
              Adicionar Canal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Channels;