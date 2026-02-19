import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Radio, Plus, Settings, Play, Pause, Edit, Trash2, Volume2 } from "lucide-react";

interface RadioStation {
  id: number;
  name: string;
  genre: string;
  url: string;
  status: string;
  bitrate: string;
  listeners: number;
}

export default function AdminRadio() {
  const [stations, setStations] = useState<RadioStation[]>([
    { id: 1, name: "Jovem Pan", genre: "Notícias", url: "http://stream.jovempan.com.br", status: "Ativo", bitrate: "128kbps", listeners: 45 },
    { id: 2, name: "Band FM", genre: "Pop", url: "http://stream.bandfm.com.br", status: "Ativo", bitrate: "192kbps", listeners: 32 },
    { id: 3, name: "Mix FM", genre: "Pop", url: "http://stream.mixfm.com.br", status: "Inativo", bitrate: "128kbps", listeners: 0 },
    { id: 4, name: "Kiss FM", genre: "Pop", url: "http://stream.kissfm.com.br", status: "Ativo", bitrate: "160kbps", listeners: 28 },
    { id: 5, name: "CBN", genre: "Notícias", url: "http://stream.cbn.com.br", status: "Ativo", bitrate: "128kbps", listeners: 15 },
  ]);

  const [radioConfig, setRadioConfig] = useState({
    serverName: "SaaS Pro Rádio",
    serverUrl: "http://radio.saaspro.com.br",
    maxListeners: "100",
    enableAutoDJ: true,
    enablePlaylists: true,
    enableLiveStream: true,
    defaultBitrate: "128kbps"
  });

  const [newStation, setNewStation] = useState({
    name: "",
    genre: "",
    url: "",
    bitrate: "128kbps"
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleAddStation = () => {
    if (newStation.name && newStation.url) {
      const station: RadioStation = {
        id: stations.length + 1,
        name: newStation.name,
        genre: newStation.genre,
        url: newStation.url,
        status: "Ativo",
        bitrate: newStation.bitrate,
        listeners: 0
      };
      setStations([...stations, station]);
      setNewStation({ name: "", genre: "", url: "", bitrate: "128kbps" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteStation = (id: number) => {
    setStations(stations.filter(station => station.id !== id));
  };

  const toggleStationStatus = (id: number) => {
    setStations(stations.map(station => 
      station.id === id 
        ? { ...station, status: station.status === "Ativo" ? "Inativo" : "Ativo" }
        : station
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const totalListeners = stations.reduce((sum, station) => sum + station.listeners, 0);
  const activeStations = stations.filter(station => station.status === "Ativo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rádio Web</h1>
          <p className="text-muted-foreground">Gerencie estações de rádio e configurações</p>
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
                <DialogTitle>Configurações do Servidor de Rádio</DialogTitle>
                <DialogDescription>
                  Configure as opções do servidor de rádio web
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serverName">Nome do Servidor</Label>
                    <Input
                      id="serverName"
                      value={radioConfig.serverName}
                      onChange={(e) => setRadioConfig({...radioConfig, serverName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverUrl">URL do Servidor</Label>
                    <Input
                      id="serverUrl"
                      value={radioConfig.serverUrl}
                      onChange={(e) => setRadioConfig({...radioConfig, serverUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxListeners">Máximo de Ouvintes</Label>
                    <Input
                      id="maxListeners"
                      type="number"
                      value={radioConfig.maxListeners}
                      onChange={(e) => setRadioConfig({...radioConfig, maxListeners: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultBitrate">Bitrate Padrão</Label>
                    <Input
                      id="defaultBitrate"
                      value={radioConfig.defaultBitrate}
                      onChange={(e) => setRadioConfig({...radioConfig, defaultBitrate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAutoDJ">Habilitar Auto DJ</Label>
                    <Switch 
                      id="enableAutoDJ" 
                      checked={radioConfig.enableAutoDJ} 
                      onCheckedChange={(checked) => setRadioConfig({...radioConfig, enableAutoDJ: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enablePlaylists">Habilitar Playlists</Label>
                    <Switch 
                      id="enablePlaylists" 
                      checked={radioConfig.enablePlaylists} 
                      onCheckedChange={(checked) => setRadioConfig({...radioConfig, enablePlaylists: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLiveStream">Habilitar Transmissão ao Vivo</Label>
                    <Switch 
                      id="enableLiveStream" 
                      checked={radioConfig.enableLiveStream} 
                      onCheckedChange={(checked) => setRadioConfig({...radioConfig, enableLiveStream: checked})}
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
                Nova Estação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Estação</DialogTitle>
                <DialogDescription>
                  Adicione uma nova estação de rádio ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="stationName">Nome da Estação</Label>
                  <Input
                    id="stationName"
                    value={newStation.name}
                    onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                    placeholder="Ex: Jovem Pan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stationGenre">Gênero</Label>
                  <Input
                    id="stationGenre"
                    value={newStation.genre}
                    onChange={(e) => setNewStation({...newStation, genre: e.target.value})}
                    placeholder="Ex: Notícias, Pop, Rock"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stationUrl">URL do Stream</Label>
                  <Input
                    id="stationUrl"
                    value={newStation.url}
                    onChange={(e) => setNewStation({...newStation, url: e.target.value})}
                    placeholder="http://stream.exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stationBitrate">Bitrate</Label>
                  <Input
                    id="stationBitrate"
                    value={newStation.bitrate}
                    onChange={(e) => setNewStation({...newStation, bitrate: e.target.value})}
                    placeholder="128kbps"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddStation}>
                  Adicionar Estação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Estações</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stations.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeStations} ativas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ouvintes Ativos</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListeners}</div>
            <p className="text-xs text-muted-foreground">
              Máximo: {radioConfig.maxListeners}
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
              {radioConfig.serverName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto DJ</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {radioConfig.enableAutoDJ ? "Ativo" : "Inativo"}
            </div>
            <p className="text-xs text-muted-foreground">
              {radioConfig.enableAutoDJ ? "Reproduzindo" : "Parado"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estações</CardTitle>
          <CardDescription>
            Gerencie todas as estações de rádio do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estação</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Bitrate</TableHead>
                <TableHead>Ouvintes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.genre}</TableCell>
                  <TableCell className="max-w-xs truncate">{station.url}</TableCell>
                  <TableCell>{station.bitrate}</TableCell>
                  <TableCell>{station.listeners}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(station.status)}>
                      {station.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleStationStatus(station.id)}
                      >
                        {station.status === "Ativo" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteStation(station.id)}
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