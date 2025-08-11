import { useState } from "react";
import { Calendar, User, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsPost {
  id: number;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  content: string;
}

const initialPosts: NewsPost[] = [
  {
    id: 1,
    title: "Operação Cidade Segura: Resultados Positivos",
    description: "Grande operação resultou na apreensão de drogas e prisão de suspeitos na região central.",
    date: "2024-01-15",
    author: "Delegado Silva",
    category: "Operações",
    content: "A Polícia Civil realizou uma grande operação na região central da cidade..."
  },
  {
    id: 2,
    title: "Novo Sistema de Denúncias Online",
    description: "Cidadãos agora podem fazer denúncias através do portal oficial da Polícia Civil.",
    date: "2024-01-12",
    author: "Assessoria de Imprensa",
    category: "Comunicados",
    content: "Foi lançado hoje o novo sistema de denúncias online..."
  },
  {
    id: 3,
    title: "Curso de Capacitação para Novos Agentes",
    description: "40 novos agentes participam do curso de formação básica da corporação.",
    date: "2024-01-10",
    author: "Academia de Polícia",
    category: "Treinamento",
    content: "Iniciou-se hoje o curso de capacitação para novos agentes..."
  }
];

export const NewsSection = () => {
  const [posts] = useState<NewsPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", "Operações", "Comunicados", "Treinamento"];

  const filteredPosts = selectedCategory === "Todos" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <section id="noticias" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Últimas Notícias
            </h2>
            <p className="text-muted-foreground">
              Fique por dentro das últimas atualizações da corporação
            </p>
          </div>
          
          <Button className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Nova Postagem
          </Button>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.date)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <Button variant="ghost" size="sm">
                    Ler mais
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão para ver mais */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Ver Todas as Notícias
          </Button>
        </div>
      </div>
    </section>
  );
};