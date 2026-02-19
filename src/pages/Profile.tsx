import { useState } from "react";
import { ArrowLeft, Camera, Edit, Save, User, Mail, Phone, MapPin, Calendar, Shield, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { AvatarSelectionModal } from "@/components/modals/AvatarSelectionModal";

const Profile = () => {
  const navigate = useNavigate();
  const { userName, userEmail, avatar, setAvatar } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  // Mantém um estado local para edição, que pode ser descartado ou salvo no contexto
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: "",
    bio: "",
    location: "",
    joinDate: "",
    role: "",
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você atualizaria o contexto com profileData.name, etc.
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Perfil</h1>
              <p className="text-gray-400">Gerencie suas informações pessoais</p>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/40">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="text-lg">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <>
                        <label className="absolute bottom-0 -right-2 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90">
                          <Camera className="h-3 w-3 text-primary-foreground" />
                          <span className="sr-only">Alterar imagem do perfil</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            aria-label="Alterar imagem do perfil"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <button onClick={() => setIsAvatarModalOpen(true)} className="absolute top-0 -right-2 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700" title="Selecionar avatar">
                          <ImageIcon className="h-3 w-3 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                    <p className="text-gray-400">{profileData.email}</p>
                    <Badge variant="secondary" className="mt-2 bg-purple-600/30 border border-purple-500 text-purple-200">
                      <Shield className="h-3 w-3 mr-1" />
                      {profileData.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="gap-2"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                Membro desde {profileData.joinDate}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/40">
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie como você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações por Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações importantes por email
                  </p>
                </div>
                <Switch
                  checked={profileData.notifications.email}
                  onCheckedChange={(checked) =>
                    setProfileData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações por SMS</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas críticos por SMS
                  </p>
                </div>
                <Switch
                  checked={profileData.notifications.sms}
                  onCheckedChange={(checked) =>
                    setProfileData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações Push</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={profileData.notifications.push}
                  onCheckedChange={(checked) =>
                    setProfileData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AvatarSelectionModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
    </>
  );
};

export default Profile;