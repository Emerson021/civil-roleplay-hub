import { useState } from "react";
import { Calendar, User, ArrowRight, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";

export const NewsSection = () => {
  const { posts, categories, loading } = useNews();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "featured">("newest");

  const allCategories = ["Todos", ...categories.map(cat => cat.name)];

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === "Todos" || post.categories?.name === selectedCategory;
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <section id="noticias" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-foreground">Carregando notícias...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="noticias" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Últimas Notícias
            </h2>
            <p className="text-gray-200">
              Fique por dentro das últimas atualizações da corporação
            </p>
          </div>
          
          {isAdmin && (
            <Button className="mt-4 md:mt-0 bg-gold text-black hover:bg-gold-light">
              <Plus className="mr-2 h-4 w-4" />
              Nova Postagem
            </Button>
          )}
        </div>

        {/* Controles de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

          <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "featured") => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="oldest">Mais Antigas</SelectItem>
              <SelectItem value="featured">Destaques</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 bg-black/40 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                    {post.categories?.name || 'Sem categoria'}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-gold transition-colors cursor-pointer text-white">
                  {post.title}
                  {post.featured && (
                    <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Destaque
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-300">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-300">
                    <User className="h-4 w-4 mr-1" />
                    {post.profiles?.full_name || 'Autor não identificado'}
                  </div>
                  <Button variant="ghost" size="sm" className="text-gold hover:text-gold-light hover:bg-gold/10">
                    Ler mais
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "Todos" 
                ? "Nenhuma notícia encontrada com os filtros aplicados." 
                : "Nenhuma notícia encontrada."
              }
            </p>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gold">{posts.length}</div>
              <div className="text-sm text-gray-300">Total de Notícias</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {posts.filter(p => p.status === "published").length}
              </div>
              <div className="text-sm text-gray-300">Publicadas</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {posts.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-gray-300">Destaques</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
              <div className="text-sm text-gray-300">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão para ver mais */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            Ver Todas as Notícias
          </Button>
        </div>
      </div>
    </section>
  );
};