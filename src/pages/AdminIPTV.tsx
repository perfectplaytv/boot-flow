import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tv, Plus, Settings, Play, Pause, Edit, Trash2, Upload } from "lucide-react";

interface Channel {
  id: number;
  name: string;
  category: string;
  url: string;
  status: string;
  logo: string;
}

export default function AdminIPTV() {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "Globo", category: "Entretenimento", url: "http://stream.globo.com", status: "Ativo", logo: "globo.png" },
    { id: 2, name: "SBT", category: "Entretenimento", url: "http://stream.sbt.com", status: "Ativo", logo: "sbt.png" },
    { id: 3, name: "Record", category: "Entretenimento", url: "http://stream.record.com", status: "Inativo", logo: "record.png" },
    { id: 4, name: "Band", category: "Entretenimento", url: "http://stream.band.com", status: "Ativo", logo: "band.png" },
    { id: 5, name: "CNN Brasil", category: "Notícias", url: "http://stream.cnn.com", status: "Ativo", logo: "cnn.png" },
  ]);

  const [serverConfig, setServerConfig] = useState({
    serverName: "SaaS Pro IPTV",
    serverUrl: "http://iptv.saaspro.com.br",
    maxConnections: "5",
    enableMovies: true,
    enableSeries: true,
    enableLive: true,
    defaultLogo: "logo.png"
  });

  const [newChannel, setNewChannel] = useState({
    name: "",
    category: "",
    url: "",
    logo: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.url) {
      const channel: Channel = {
        id: channels.length + 1,
        name: newChannel.name,
        category: newChannel.category,
        url: newChannel.url,
        status: "Ativo",
        logo: newChannel.logo || "default.png"
      };
      setChannels([...channels, channel]);
      setNewChannel({ name: "", category: "", url: "", logo: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteChannel = (id: number) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  const toggleChannelStatus = (id: number) => {
    setChannels(channels.map(channel => 
      channel.id === id 
        ? { ...channel, status: channel.status === "Ativo" ? "Inativo" : "Ativo" }
        : channel
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema IPTV</h1>
          <p className="text-muted-foreground">Gerencie canais e configurações do IPTV</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações do Servidor IPTV</DialogTitle>
                <DialogDescription>
                  Configure as opções do servidor IPTV
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Nome do Servidor</Label>
                    <Input
                      id="serverName"
                      value={serverConfig.serverName}
                      onChange={(e) => setServerConfig({...serverConfig, serverName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverUrl">URL do Servidor</Label>
                    <Input
                      id="serverUrl"
                      value={serverConfig.serverUrl}
                      onChange={(e) => setServerConfig({...serverConfig, serverUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Máximo de Conexões</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={serverConfig.maxConnections}
                    onChange={(e) => setServerConfig({...serverConfig, maxConnections: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableMovies">Habilitar Filmes</Label>
                    <Switch 
                      id="enableMovies" 
                      checked={serverConfig.enableMovies} 
                      onCheckedChange={(checked) => setServerConfig({...serverConfig, enableMovies: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableSeries">Habilitar Séries</Label>
                    <Switch 
                      id="enableSeries" 
                      checked={serverConfig.enableSeries} 
                      onCheckedChange={(checked) => setServerConfig({...serverConfig, enableSeries: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLive">Habilitar TV ao Vivo</Label>
                    <Switch 
                      id="enableLive" 
                      checked={serverConfig.enableLive} 
                      onCheckedChange={(checked) => setServerConfig({...serverConfig, enableLive: checked})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsConfigDialogOpen(false)}>
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Canal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Canal</DialogTitle>
                <DialogDescription>
                  Adicione um novo canal ao sistema IPTV
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="channelName">Nome do Canal</Label>
                  <Input
                    id="channelName"
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                    placeholder="Ex: Globo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelCategory">Categoria</Label>
                  <Input
                    id="channelCategory"
                    value={newChannel.category}
                    onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
                    placeholder="Ex: Entretenimento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelUrl">URL do Stream</Label>
                  <Input
                    id="channelUrl"
                    value={newChannel.url}
                    onChange={(e) => setNewChannel({...newChannel, url: e.target.value})}
                    placeholder="http://stream.exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelLogo">Logo (URL)</Label>
                  <Input
                    id="channelLogo"
                    value={newChannel.logo}
                    onChange={(e) => setNewChannel({...newChannel, logo: e.target.value})}
                    placeholder="http://exemplo.com/logo.png"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddChannel}>
                  Adicionar Canal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Canais</CardTitle>
            <Tv className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.length}</div>
            <p className="text-xs text-muted-foreground">
              {channels.filter(c => c.status === "Ativo").length} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Máximo: {serverConfig.maxConnections}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Servidor</CardTitle>
            <Badge className="bg-green-100 text-green-800">Online</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <p className="text-xs text-muted-foreground">
              {serverConfig.serverName}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Canais</CardTitle>
          <CardDescription>
            Gerencie todos os canais do sistema IPTV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>{channel.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{channel.url}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(channel.status)}>
                      {channel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleChannelStatus(channel.id)}
                      >
                        {channel.status === "Ativo" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteChannel(channel.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 