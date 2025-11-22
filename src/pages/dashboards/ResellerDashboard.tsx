import AdminDashboard from './AdminDashboard';

// Temporariamente reexporta o AdminDashboard para garantir que o dev server suba
export default AdminDashboard;
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Gerencie listas IPTV dos seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Radio className="w-6 h-6 text-blue-500" />
                    <CardTitle className="text-white">Rádio Web</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Configure rádios para seus clientes
                  </p>
                  <Badge className="bg-green-500">Ativo</Badge>
                </CardContent>
              </Card>

              <Card className="bg-[#1f2937] cursor-pointer hover:shadow-glow transition-all duration-300 opacity-50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-6 h-6 text-green-500" />
                    <CardTitle className="text-white">E-commerce</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Venda produtos aos seus clientes
                  </p>
                  <Badge variant="outline">Upgrade Necessário</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ResellerDashboard;