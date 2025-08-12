import { useState } from "react";
import { Calendar, User, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNews } from "@/hooks/useNews";
import { useAuth } from "@/hooks/useAuth";

export const NewsSection = () => {
  const { posts, categories, loading } = useNews();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const allCategories = ["Todos", ...categories.map(cat => cat.name)];

  const filteredPosts = selectedCategory === "Todos" 
    ? posts 
    : posts.filter(post => post.categories?.name === selectedCategory);

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

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gold text-black hover:bg-gold-light" 
                : "border-white/20 text-white hover:bg-white/10"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
          </div>
        )}

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