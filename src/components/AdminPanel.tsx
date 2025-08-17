import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";
import { UserApprovalPanel } from "@/components/admin/UserApprovalPanel";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  Newspaper,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/ui/loading";

export const AdminPanel = () => {
  const { posts, categories, loading, createPost, updatePost, deletePost, togglePostStatus } = useNews();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    content: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    featured: false
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || post.categories?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.description || !newPost.category_id) {
      return;
    }

    const success = await createPost({
      ...newPost,
      category_id: newPost.category_id
    });

    if (success) {
      setNewPost({
        title: "",
        description: "",
        content: "",
        category_id: "",
        status: "draft",
        featured: false
      });
      setIsCreateDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Loading text="Carregando painel administrativo..." />;
  }

  return (
    <div className="min-h-screen bg-police-portal">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-300">
            Bem-vindo, {profile?.full_name}. Gerencie o conteúdo e usuários do sistema.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Notícias
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Notícias</CardTitle>
                  <FileText className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{posts.length}</div>
                  <p className="text-xs text-gray-400">
                    {posts.filter(p => p.status === 'published').length} publicadas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Categorias</CardTitle>
                  <BarChart3 className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                  <p className="text-xs text-gray-400">Categorias ativas</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Usuários</CardTitle>
                  <Users className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">-</div>
                  <p className="text-xs text-gray-400">Total de usuários</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Atividade</CardTitle>
                  <Activity className="h-4 w-4 text-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">-</div>
                  <p className="text-xs text-gray-400">Logs de auditoria</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Notícias Recentes</CardTitle>
                  <CardDescription className="text-gray-400">
                    Últimas notícias criadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{post.title}</p>
                          <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                        </div>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status === 'published' ? 'Publicada' : 'Rascunho'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Atividade do Sistema</CardTitle>
                  <CardDescription className="text-gray-400">
                    Últimas ações realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-white">Sistema iniciado</p>
                        <p className="text-xs text-gray-400">Há 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-white">Nova notícia criada</p>
                        <p className="text-xs text-gray-400">Há 3 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-white">Usuário registrado</p>
                        <p className="text-xs text-gray-400">Há 4 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notícias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todas as Categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold text-black hover:bg-gold-light">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Notícia
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Notícia</DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo para criar uma nova notícia
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        placeholder="Título da notícia"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newPost.description}
                        onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                        placeholder="Descrição breve da notícia"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Conteúdo</Label>
                      <Textarea
                        id="content"
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        placeholder="Conteúdo completo da notícia"
                        rows={6}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={newPost.category_id} onValueChange={(value) => setNewPost({...newPost, category_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={newPost.status} onValueChange={(value: "draft" | "published") => setNewPost({...newPost, status: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="published">Publicada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreatePost}>
                        Criar Notícia
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-black/40 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{post.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {post.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status === 'published' ? 'Publicada' : 'Rascunho'}
                        </Badge>
                        {post.featured && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <span>Categoria: {post.categories?.name}</span>
                        <span>Autor: {post.profiles?.full_name}</span>
                        <span>Criada em: {formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => togglePostStatus(post.id, post.status === 'published' ? 'draft' : 'published')}
                      >
                        {post.status === 'published' ? 'Despublicar' : 'Publicar'}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card className="bg-black/40 backdrop-blur-sm border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma notícia encontrada</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserApprovalPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie as configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Modo de Manutenção</h4>
                      <p className="text-xs text-gray-400">Ativar modo de manutenção</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Backup Automático</h4>
                      <p className="text-xs text-gray-400">Configurar backup do banco de dados</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Logs de Auditoria</h4>
                      <p className="text-xs text-gray-400">Visualizar logs do sistema</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};