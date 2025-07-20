import { useState } from "react";
import { ArrowLeft, Trophy, Star, Target, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Gamification = () => {
  const navigate = useNavigate();
  const [userLevel] = useState({ level: 5, xp: 2340, nextLevelXp: 3000 });

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 sm:h-9 sm:w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Gamificação</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Acompanhe seu progresso e conquistas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Nível</p>
                  <p className="text-lg sm:text-2xl font-bold">{userLevel.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 sm:h-6 sm:w-6 text-warning" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">XP Total</p>
                  <p className="text-lg sm:text-2xl font-bold">{userLevel.xp}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Conquistas</p>
                  <p className="text-lg sm:text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-info/10 rounded-full flex items-center justify-center">
                  <Gift className="h-4 w-4 sm:h-6 sm:w-6 text-info" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Recompensas</p>
                  <p className="text-lg sm:text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progresso para o Próximo Nível</CardTitle>
            <CardDescription>
              {userLevel.nextLevelXp - userLevel.xp} XP restantes para o nível {userLevel.level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(userLevel.xp / userLevel.nextLevelXp) * 100} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{userLevel.xp} XP</span>
              <span>{userLevel.nextLevelXp} XP</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conquistas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Primeiro Login", xp: 100, unlocked: true },
                { name: "IA Configurada", xp: 250, unlocked: true },
                { name: "10 Campanhas", xp: 500, unlocked: false },
              ].map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className={`h-5 w-5 ${achievement.unlocked ? 'text-warning' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">+{achievement.xp} XP</p>
                    </div>
                  </div>
                  <Badge variant={achievement.unlocked ? "default" : "outline"}>
                    {achievement.unlocked ? "Desbloqueado" : "Bloqueado"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ranking</CardTitle>
              <CardDescription>Sua posição entre todos os usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-3xl font-bold text-primary mb-2">#15</div>
                <p className="text-muted-foreground">de 1.247 usuários</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Gamification;