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

interface NewsPost {
  id: number;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  content: string;
  status: "published" | "draft";
}

const mockPosts: NewsPost[] = [
  {
    id: 1,
    title: "Operação Cidade Segura: Resultados Positivos",
    description: "Grande operação resultou na apreensão de drogas e prisão de suspeitos na região central.",
    date: "2024-01-15",
    author: "Delegado Silva",
    category: "Operações",
    content: "A Polícia Civil realizou uma grande operação na região central da cidade...",
    status: "published"
  },
  {
    id: 2,
    title: "Novo Sistema de Denúncias Online",
    description: "Cidadãos agora podem fazer denúncias através do portal oficial da Polícia Civil.",
    date: "2024-01-12",
    author: "Assessoria de Imprensa",
    category: "Comunicados",
    content: "Foi lançado hoje o novo sistema de denúncias online...",
    status: "published"
  },
  {
    id: 3,
    title: "Reunião de Planejamento Semanal",
    description: "Rascunho da reunião de planejamento desta semana.",
    date: "2024-01-16",
    author: "Delegado Silva",
    category: "Comunicados",
    content: "Agenda da reunião semanal...",
    status: "draft"
  }
];

export const AdminPanel = () => {
  const [posts, setPosts] = useState<NewsPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  
  // Formulário de novo post
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "",
    content: "",
    author: "Admin"
  });

  const categories = ["Todos", "Operações", "Comunicados", "Treinamento"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Todos" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.description || !newPost.category || !newPost.content) {
      return;
    }

    const post: NewsPost = {
      id: Date.now(),
      title: newPost.title,
      description: newPost.description,
      date: new Date().toISOString().split('T')[0],
      author: newPost.author,
      category: newPost.category,
      content: newPost.content,
      status: "draft"
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", description: "", category: "", content: "", author: "Admin" });
    setIsNewPostOpen(false);
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const togglePostStatus = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, status: post.status === "published" ? "draft" : "published" }
        : post
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
              <div className="text-2xl font-bold text-primary">3</div>
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
              {categories.map((category) => (
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
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operações">Operações</SelectItem>
                      <SelectItem value="Comunicados">Comunicados</SelectItem>
                      <SelectItem value="Treinamento">Treinamento</SelectItem>
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
                      <Badge variant="secondary">{post.category}</Badge>
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
                      Por {post.author} • {formatDate(post.date)}
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
                      onClick={() => togglePostStatus(post.id)}
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