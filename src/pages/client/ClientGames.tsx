import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gamepad2, Plus, Settings, Trophy, Star, Users, Target } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  points: number;
  icon: string;
  unlocked: number;
  total: number;
}

interface Leaderboard {
  id: number;
  name: string;
  points: number;
  level: number;
  achievements: number;
  rank: number;
}

export default function ClientGames() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, name: "Primeiro Login", description: "Faça seu primeiro login no sistema", points: 10, icon: "🎯", unlocked: 156, total: 156 },
    { id: 2, name: "Comprador Frequente", description: "Realize 10 compras", points: 50, icon: "🛒", unlocked: 45, total: 156 },
    { id: 3, name: "Suporte Ativo", description: "Use o suporte 5 vezes", points: 30, icon: "💬", unlocked: 78, total: 156 },
    { id: 4, name: "Streamer", description: "Assista 100 horas de conteúdo", points: 100, icon: "📺", unlocked: 23, total: 156 },
    { id: 5, name: "Mestre da IA", description: "Interaja 50 vezes com a IA", points: 75, icon: "🤖", unlocked: 12, total: 156 },
  ]);

  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([
    { id: 1, name: "João Silva", points: 1250, level: 15, achievements: 8, rank: 1 },
    { id: 2, name: "Maria Santos", points: 980, level: 12, achievements: 6, rank: 2 },
    { id: 3, name: "Pedro Oliveira", points: 850, level: 10, achievements: 5, rank: 3 },
    { id: 4, name: "Ana Costa", points: 720, level: 9, achievements: 4, rank: 4 },
    { id: 5, name: "Carlos Lima", points: 650, level: 8, achievements: 3, rank: 5 },
  ]);

  const [gamificationConfig, setGamificationConfig] = useState({
    enabled: true,
    pointsPerLogin: "10",
    pointsPerPurchase: "50",
    pointsPerSupport: "30",
    enableLeaderboard: true,
    enableAchievements: true,
    enableLevels: true,
    maxLevel: "100"
  });

  const [newAchievement, setNewAchievement] = useState({
    name: "",
    description: "",
    points: "",
    icon: "🏆"
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleAddAchievement = () => {
    if (newAchievement.name && newAchievement.description) {
      const achievement: Achievement = {
        id: achievements.length + 1,
        name: newAchievement.name,
        description: newAchievement.description,
        points: parseInt(newAchievement.points) || 0,
        icon: newAchievement.icon,
        unlocked: 0,
        total: 156
      };
      setAchievements([...achievements, achievement]);
      setNewAchievement({ name: "", description: "", points: "", icon: "🏆" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteAchievement = (id: number) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const totalUnlocked = achievements.reduce((sum, achievement) => sum + achievement.unlocked, 0);
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-[#09090b] p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Gamificação</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie sistema de pontos, conquistas e rankings</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-[#1f2937] text-white border-none h-10 sm:h-auto">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
                <span className="sm:hidden">Config</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1f2937] text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações de Gamificação</DialogTitle>
                <DialogDescription>
                  Configure o sistema de gamificação
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled" className="text-gray-300">Habilitar Gamificação</Label>
                  <Switch 
                    id="enabled" 
                    checked={gamificationConfig.enabled} 
                    onCheckedChange={(checked) => setGamificationConfig({...gamificationConfig, enabled: checked})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsPerLogin" className="text-gray-300">Pontos por Login</Label>
                    <Input
                      id="pointsPerLogin"
                      type="number"
                      value={gamificationConfig.pointsPerLogin}
                      onChange={(e) => setGamificationConfig({...gamificationConfig, pointsPerLogin: e.target.value})}
                      className="bg-[#1f2937] border border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pointsPerPurchase" className="text-gray-300">Pontos por Compra</Label>
                    <Input
                      id="pointsPerPurchase"
                      type="number"
                      value={gamificationConfig.pointsPerPurchase}
                      onChange={(e) => setGamificationConfig({...gamificationConfig, pointsPerPurchase: e.target.value})}
                      className="bg-[#1f2937] border border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pointsPerSupport" className="text-gray-300">Pontos por Suporte</Label>
                  <Input
                    id="pointsPerSupport"
                    type="number"
                    value={gamificationConfig.pointsPerSupport}
                    onChange={(e) => setGamificationConfig({...gamificationConfig, pointsPerSupport: e.target.value})}
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLeaderboard" className="text-gray-300">Habilitar Ranking</Label>
                    <Switch 
                      id="enableLeaderboard" 
                      checked={gamificationConfig.enableLeaderboard} 
                      onCheckedChange={(checked) => setGamificationConfig({...gamificationConfig, enableLeaderboard: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAchievements" className="text-gray-300">Habilitar Conquistas</Label>
                    <Switch 
                      id="enableAchievements" 
                      checked={gamificationConfig.enableAchievements} 
                      onCheckedChange={(checked) => setGamificationConfig({...gamificationConfig, enableAchievements: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLevels" className="text-gray-300">Habilitar Níveis</Label>
                    <Switch 
                      id="enableLevels" 
                      checked={gamificationConfig.enableLevels} 
                      onCheckedChange={(checked) => setGamificationConfig({...gamificationConfig, enableLevels: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLevel" className="text-gray-300">Nível Máximo</Label>
                  <Input
                    id="maxLevel"
                    type="number"
                    value={gamificationConfig.maxLevel}
                    onChange={(e) => setGamificationConfig({...gamificationConfig, maxLevel: e.target.value})}
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="bg-[#1f2937] text-white" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={() => setIsConfigDialogOpen(false)}>
                  Salvar Configurações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#7e22ce] hover:bg-[#6d1bb7] text-white">
                <Plus className="w-4 h-4" />
                Nova Conquista
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1f2937] text-white">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Conquista</DialogTitle>
                <DialogDescription>
                  Adicione uma nova conquista ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="achievementName" className="text-gray-300">Nome da Conquista</Label>
                  <Input
                    id="achievementName"
                    value={newAchievement.name}
                    onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                    placeholder="Ex: Primeira Compra"
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievementDescription" className="text-gray-300">Descrição</Label>
                  <Input
                    id="achievementDescription"
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                    placeholder="Ex: Realize sua primeira compra"
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievementPoints" className="text-gray-300">Pontos</Label>
                  <Input
                    id="achievementPoints"
                    type="number"
                    value={newAchievement.points}
                    onChange={(e) => setNewAchievement({...newAchievement, points: e.target.value})}
                    placeholder="Ex: 10"
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievementIcon" className="text-gray-300">Ícone</Label>
                  <Input
                    id="achievementIcon"
                    value={newAchievement.icon}
                    onChange={(e) => setNewAchievement({...newAchievement, icon: e.target.value})}
                    placeholder="Ex: 🏆"
                    className="bg-[#1f2937] border border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="bg-[#1f2937] text-white" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#7e22ce] hover:bg-[#6d1bb7] text-white" onClick={handleAddAchievement}>
                  Adicionar Conquista
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/40 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total de Pontos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalPoints}</div>
            <p className="text-xs text-gray-400">
              Disponíveis
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/40 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conquistas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAchievements}</div>
            <p className="text-xs text-gray-400">
              {totalUnlocked} desbloqueadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/40 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">156</div>
            <p className="text-xs text-gray-400">
              Participando
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-700/40 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Nível Médio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.5</div>
            <p className="text-xs text-gray-400">
              Dos usuários
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1f2937] text-white">
          <CardHeader>
            <CardTitle className="text-white">Conquistas</CardTitle>
            <CardDescription className="text-gray-400">
              Gerencie todas as conquistas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-gray-400">
                  <TableHead>Conquista</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Desbloqueios</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id} className="hover:bg-[#232a36] transition-colors">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{achievement.icon}</span>
                        {achievement.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{achievement.description}</TableCell>
                    <TableCell className="text-gray-300">{achievement.points}</TableCell>
                    <TableCell className="text-gray-300">{achievement.unlocked}/{achievement.total}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400" onClick={() => handleDeleteAchievement(achievement.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-[#1f2937] text-white">
          <CardHeader>
            <CardTitle className="text-white">Ranking</CardTitle>
            <CardDescription className="text-gray-400">
              Top 5 usuários com mais pontos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-gray-400">
                  <TableHead>Rank</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Conquistas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#232a36] transition-colors">
                    <TableCell>
                      <Badge variant={user.rank === 1 ? "default" : "secondary"}>
                        #{user.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-white">{user.name}</TableCell>
                    <TableCell className="text-gray-300">{user.points}</TableCell>
                    <TableCell className="text-gray-300">{user.level}</TableCell>
                    <TableCell className="text-gray-300">{user.achievements}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
