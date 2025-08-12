import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";

export const AdminPanel = () => {
  const { posts, categories, loading, createPost, deletePost, togglePostStatus } = useNews();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  
  // Formulário de novo post
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category_id: "",
    content: ""
  });

  const allCategories = ["Todos", ...categories.map(cat => cat.name)];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Todos" || post.categories?.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.description || !newPost.category_id || !newPost.content) {
      return;
    }

    const success = await createPost({
      title: newPost.title,
      description: newPost.description,
      category_id: newPost.category_id,
      content: newPost.content
    });

    if (success) {
      setNewPost({ title: "", description: "", category_id: "", content: "" });
      setIsNewPostOpen(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await togglePostStatus(id, currentStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-police-portal py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-foreground">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-police-portal py-8">
      <div className="container mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-200">
            Gerencie postagens e conteúdo do portal
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total de Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {posts.filter(p => p.status === "published").length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">
                {posts.filter(p => p.status === "draft").length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar categoria" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Postagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Postagem</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para criar uma nova postagem
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Título da postagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newPost.description}
                    onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                    placeholder="Breve descrição"
                  />
                </div>
                
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
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Conteúdo completo da postagem"
                    rows={6}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreatePost}>
                    Criar Postagem
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.categories?.name || 'Sem categoria'}</Badge>
                      <Badge 
                        variant={post.status === "published" ? "default" : "outline"}
                        className={post.status === "published" ? "bg-green-500" : ""}
                      >
                        {post.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2">
                      Por {post.profiles?.full_name || 'Autor não identificado'} • {formatDate(post.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleStatus(post.id, post.status)}
                    >
                      {post.status === "published" ? "Despublicar" : "Publicar"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma postagem encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};