import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Settings, DollarSign, Package, TrendingUp, Users } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  sales: number;
}

interface Sale {
  id: number;
  customer: string;
  product: string;
  amount: number;
  date: string;
  status: string;
}

export default function AdminEcommerce() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Plano Básico", category: "Planos", price: 29.90, stock: 999, status: "Ativo", sales: 45 },
    { id: 2, name: "Plano Pro", category: "Planos", price: 59.90, stock: 999, status: "Ativo", sales: 32 },
    { id: 3, name: "Plano Enterprise", category: "Planos", price: 99.90, stock: 999, status: "Ativo", sales: 18 },
    { id: 4, name: "Suporte Premium", category: "Serviços", price: 149.90, stock: 50, status: "Ativo", sales: 12 },
    { id: 5, name: "Consultoria", category: "Serviços", price: 299.90, stock: 20, status: "Ativo", sales: 8 },
  ]);

  const [recentSales, setRecentSales] = useState<Sale[]>([
    { id: 1, customer: "João Silva", product: "Plano Pro", amount: 59.90, date: "2024-01-20", status: "Pago" },
    { id: 2, customer: "Maria Santos", product: "Plano Básico", amount: 29.90, date: "2024-01-19", status: "Pago" },
    { id: 3, customer: "Pedro Oliveira", product: "Suporte Premium", amount: 149.90, date: "2024-01-18", status: "Pendente" },
    { id: 4, customer: "Ana Costa", product: "Plano Enterprise", amount: 99.90, date: "2024-01-17", status: "Pago" },
    { id: 5, customer: "Carlos Lima", product: "Consultoria", amount: 299.90, date: "2024-01-16", status: "Pago" },
  ]);

  const [ecommerceConfig, setEcommerceConfig] = useState({
    storeName: "SaaS Pro Store",
    currency: "BRL",
    taxRate: "10",
    enableReviews: true,
    enableWishlist: true,
    enableCoupons: true,
    autoStock: true
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        status: "Ativo",
        sales: 0
      };
      setProducts([...products, product]);
      setNewProduct({ name: "", category: "", price: "", stock: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === "Ativo" ? "Inativo" : "Ativo" }
        : product
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Inativo":
      case "Cancelado":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = recentSales
    .filter(sale => sale.status === "Pago")
    .reduce((sum, sale) => sum + sale.amount, 0);

  const totalProducts = products.length;
  const activeProducts = products.filter(product => product.status === "Ativo").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">E-commerce</h1>
          <p className="text-muted-foreground">Gerencie produtos, vendas e configurações da loja</p>
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
                <DialogTitle>Configurações da Loja</DialogTitle>
                <DialogDescription>
                  Configure as opções da sua loja virtual
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nome da Loja</Label>
                    <Input
                      id="storeName"
                      value={ecommerceConfig.storeName}
                      onChange={(e) => setEcommerceConfig({...ecommerceConfig, storeName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda</Label>
                    <Input
                      id="currency"
                      value={ecommerceConfig.currency}
                      onChange={(e) => setEcommerceConfig({...ecommerceConfig, currency: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={ecommerceConfig.taxRate}
                    onChange={(e) => setEcommerceConfig({...ecommerceConfig, taxRate: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableReviews">Habilitar Avaliações</Label>
                    <Switch 
                      id="enableReviews" 
                      checked={ecommerceConfig.enableReviews} 
                      onCheckedChange={(checked) => setEcommerceConfig({...ecommerceConfig, enableReviews: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableWishlist">Habilitar Lista de Desejos</Label>
                    <Switch 
                      id="enableWishlist" 
                      checked={ecommerceConfig.enableWishlist} 
                      onCheckedChange={(checked) => setEcommerceConfig({...ecommerceConfig, enableWishlist: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableCoupons">Habilitar Cupons</Label>
                    <Switch 
                      id="enableCoupons" 
                      checked={ecommerceConfig.enableCoupons} 
                      onCheckedChange={(checked) => setEcommerceConfig({...ecommerceConfig, enableCoupons: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStock">Controle Automático de Estoque</Label>
                    <Switch 
                      id="autoStock" 
                      checked={ecommerceConfig.autoStock} 
                      onCheckedChange={(checked) => setEcommerceConfig({...ecommerceConfig, autoStock: checked})}
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
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>
                  Adicione um novo produto à loja
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Plano Premium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Categoria</Label>
                  <Input
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="Ex: Planos, Serviços"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Preço</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productStock">Estoque</Label>
                    <Input
                      id="productStock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct}>
                  Adicionar Produto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSales.length}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Gerencie todos os produtos da loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleProductStatus(product.id)}
                        >
                          {product.status === "Ativo" ? "Desativar" : "Ativar"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>
              Últimas transações da loja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.customer}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>R$ {sale.amount.toFixed(2)}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                    </TableCell>
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