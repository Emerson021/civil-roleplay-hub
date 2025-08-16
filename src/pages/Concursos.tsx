import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Download, ExternalLink, Instagram, Video, MessageCircle } from "lucide-react";

const Concursos = () => {
  // Mock data para concursos - em produção viria do Supabase
  const concursos = [
    {
      id: 1,
      titulo: "Concurso Público para Investigador de Polícia Civil",
      orgao: "Secretaria de Segurança Pública",
      vagas: 50,
      salario: "R$ 8.500,00",
      inscricoes: {
        inicio: "15/01/2024",
        fim: "28/02/2024"
      },
      prova: "15/04/2024",
      situacao: "Inscrições Abertas",
      edital: "#",
      local: "São Paulo - SP"
    },
    {
      id: 2,
      titulo: "Concurso para Escrivão de Polícia Civil",
      orgao: "Secretaria de Segurança Pública", 
      vagas: 30,
      salario: "R$ 6.800,00",
      inscricoes: {
        inicio: "01/02/2024",
        fim: "15/03/2024"
      },
      prova: "20/05/2024",
      situacao: "Inscrições Abertas",
      edital: "#",
      local: "São Paulo - SP"
    },
    {
      id: 3,
      titulo: "Concurso para Perito Criminal",
      orgao: "Instituto de Criminalística",
      vagas: 15,
      salario: "R$ 9.200,00",
      inscricoes: {
        inicio: "10/12/2023",
        fim: "20/01/2024"
      },
      prova: "25/03/2024",
      situacao: "Encerrado",
      edital: "#",
      local: "São Paulo - SP"
    }
  ];

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "Inscrições Abertas":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Encerrado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Em Andamento":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-police-portal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Concursos Públicos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Acompanhe os concursos da Polícia Civil e órgãos relacionados. 
            Mantenha-se atualizado sobre editais, inscrições e resultados.
          </p>
        </section>

        {/* Filtros */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="bg-card">
              Todos os Concursos
            </Button>
            <Button variant="ghost">
              Inscrições Abertas
            </Button>
            <Button variant="ghost">
              Em Andamento
            </Button>
            <Button variant="ghost">
              Encerrados
            </Button>
          </div>
        </section>

        {/* Lista de Concursos */}
        <section className="grid gap-6">
          {concursos.map((concurso) => (
            <Card key={concurso.id} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-foreground mb-2">
                      {concurso.titulo}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {concurso.orgao}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getSituacaoColor(concurso.situacao)} font-medium`}
                  >
                    {concurso.situacao}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Vagas:</span>
                    <span className="font-medium text-foreground">{concurso.vagas}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Salário:</span>
                    <span className="font-medium text-primary">{concurso.salario}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-medium text-foreground">{concurso.local}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Prova:</span>
                    <span className="font-medium text-foreground">{concurso.prova}</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-foreground mb-2">Período de Inscrições</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Início:</span> {concurso.inscricoes.inicio} • 
                    <span className="font-medium ml-2">Fim:</span> {concurso.inscricoes.fim}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Edital
                  </Button>
                  
                  {concurso.situacao === "Inscrições Abertas" && (
                    <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Fazer Inscrição
                    </Button>
                  )}
                  
                  <Button size="sm" variant="ghost">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Redes Sociais */}
        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Siga a Polícia Civil nas Redes Sociais
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mantenha-se atualizado com as últimas notícias, dicas para concursos e 
            conteúdo exclusivo através dos nossos canais oficiais.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Instagram */}
            <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Instagram</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fotos dos bastidores, stories exclusivos e atualizações diárias
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Seguir @policiacivil_sp
                </Button>
              </CardContent>
            </Card>

            {/* TikTok */}
            <Card className="bg-gradient-to-br from-black/10 to-red-600/10 border-gray-500/20 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-black to-red-600 group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">TikTok</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vídeos educativos, dicas rápidas para concursos e conteúdo dinâmico
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10 hover:border-gray-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Seguir @policiacivil_sp
                </Button>
              </CardContent>
            </Card>

            {/* Discord */}
            <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Discord</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comunidade para discussões, tirar dúvidas e networking entre candidatos
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Entrar no Servidor
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Informações Úteis */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Informações Úteis
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Como se Inscrever
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesse o edital do concurso, verifique os requisitos e faça sua inscrição 
                  através do site oficial da organizadora.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Documentos Necessários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  RG, CPF, comprovante de escolaridade, certidões negativas e 
                  outros documentos conforme especificado no edital.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Acompanhe os Resultados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fique atento às datas de divulgação dos resultados e 
                  às próximas etapas do processo seletivo.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Concursos;