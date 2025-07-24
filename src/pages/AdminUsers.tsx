import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Search, Edit, Trash2, Eye, User, Mail, Calendar, Shield, Activity, CheckCircle, Copy } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import React from "react";
import { useClientes } from "@/hooks/useClientes";
import { useUsers } from "@/hooks/useUsers";

export default function AdminUsers() {
  const { clientes: users, loading, error, addCliente, updateCliente: updateUser, deleteCliente: deleteUser } = useClientes();
  const { users: cobrancasUsers } = useUsers();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    plan: "",
    status: "Ativo",
    telegram: "",
    observations: "",
    expirationDate: "",
    password: "",
    bouquets: "",
    realName: "",
    whatsapp: "",
    devices: 0,
    credits: 0,
    notes: ""
  });

  // Estados para a extração M3U
  const [m3uUrl, setM3uUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [extractionError, setExtractionError] = useState("");
  const [extractedUsers, setExtractedUsers] = useState<any[]>([]);
  const [selectedExtractedUser, setSelectedExtractedUser] = useState<any>(null);

  // Estados para os modais de ação
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  
  // Estados para copiar clientes da página de Cobranças
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isCopyingUsers, setIsCopyingUsers] = useState(false);
  const [copyProgress, setCopyProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const usersSafe = users || [];
  const filteredUsers = usersSafe.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen bg-[#09090b] p-3 sm:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Usuários</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {loading && (
        <div className="bg-blue-900/40 border border-blue-700 text-blue-300 rounded-lg p-4">
          Carregando usuários...
        </div>
      )}

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-4">
          Erro: {error}
        </div>
      )}

      <Card className="bg-[#1f2937] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#374151] border-gray-600 text-white"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-white">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-700">Ativo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewingUser(user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setUserToDelete(user)}>
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