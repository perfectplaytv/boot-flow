import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  DollarSign,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Esgotado';
  sales: number;
  rating: number;
  image?: string;
}

const Ecommerce: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });

  // Calcular métricas
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Ativo').length;
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const averageRating = Math.round((products.reduce((sum, p) => sum + p.rating, 0) / products.length) * 10) / 10;

  // Filtrar produtos
  React.useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 0 ? 'Ativo' : 'Esgotado',
      sales: 0,
      rating: 0
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      image: ''
    });
    setAddModalOpen(false);
    toast.success(`${product.name} adicionado com sucesso!`);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Tem certeza que deseja excluir ${product.name}?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`${product.name} excluído com sucesso!`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'Inativo': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'Esgotado': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Eletrônicos': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'Computadores': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'Acessórios': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'Fotografia': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'Games': return 'bg-pink-500/20 text-pink-600 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">E-commerce</h1>
          <p className="text-gray-400 mt-1">Gerencie produtos e vendas da sua loja virtual</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          + Novo Produto
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-gray-400">{activeProducts} ativos</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Vendas Totais
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSales}</div>
            <p className="text-xs text-gray-400">Unidades vendidas</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-gray-400">Valor total vendido</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-[#1F2937]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avaliação Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageRating}⭐</div>
            <p className="text-xs text-gray-400">Satisfação dos clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Produtos */}
      <Card className="border-gray-700 bg-[#1F2937]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Lista de Produtos</CardTitle>
              <p className="text-sm text-gray-400">
                {filteredProducts.length} produtos encontrados
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
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
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Produto</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Preço</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Estoque</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Vendas</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Avaliação</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{product.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">
                      R$ {product.price.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-white">{product.stock}</td>
                    <td className="py-3 px-4 text-white">{product.sales}</td>
                    <td className="py-3 px-4 text-white">{product.rating}⭐</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Visualizando ${product.name}`)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Editando ${product.name}`)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
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

      {/* Modal de Adicionar Produto */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Novo Produto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Adicione um novo produto à sua loja
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-gray-300">Nome do Produto *</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Nome do produto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category" className="text-gray-300">Categoria *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Computadores">Computadores</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                    <SelectItem value="Fotografia">Fotografia</SelectItem>
                    <SelectItem value="Games">Games</SelectItem>
                    <SelectItem value="Casa e Jardim">Casa e Jardim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price" className="text-gray-300">Preço *</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock" className="text-gray-300">Estoque *</Label>
                <Input
                  id="product-stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image" className="text-gray-300">URL da Imagem</Label>
              <Input
                id="product-image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} className="bg-purple-600 hover:bg-purple-700">
              Adicionar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ecommerce;