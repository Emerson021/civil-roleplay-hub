import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Download, ExternalLink, Instagram, Video, MessageCircle, Search, Plus } from "lucide-react";
import { useConcursos } from "@/hooks/useConcursos";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Concursos = () => {
  const { concursos, loading, createConcurso, isAdmin } = useConcursos();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("Todos");
  const [isNewConcursoOpen, setIsNewConcursoOpen] = useState(false);
  
  // Formulário de novo concurso
  const [newConcurso, setNewConcurso] = useState({
    titulo: "",
    orgao: "",
    vagas: 0,
    salario: "",
    inscricoes_inicio: "",
    inscricoes_fim: "",
    data_prova: "",
    situacao: "Inscrições Abertas",
    local: "",
    descricao: "",
    requisitos: "",
    beneficios: "",
    edital_url: ""
  });

  const allSituacoes = ["Todos", "Inscrições Abertas", "Em Andamento", "Encerrado", "Cancelado"];

  const filteredConcursos = concursos.filter(concurso => {
    const matchesSearch = concurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concurso.local.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSituacao = filterSituacao === "Todos" || concurso.situacao === filterSituacao;
    return matchesSearch && matchesSituacao;
  });

  const handleCreateConcurso = async () => {
    if (!newConcurso.titulo || !newConcurso.orgao || !newConcurso.local) {
      return;
    }

    const success = await createConcurso({
      ...newConcurso,
      vagas: Number(newConcurso.vagas)
    });

    if (success) {
      setNewConcurso({
        titulo: "",
        orgao: "",
        vagas: 0,
        salario: "",
        inscricoes_inicio: "",
        inscricoes_fim: "",
        data_prova: "",
        situacao: "Inscrições Abertas",
        local: "",
        descricao: "",
        requisitos: "",
        beneficios: "",
        edital_url: ""
      });
      setIsNewConcursoOpen(false);
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "Inscrições Abertas":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Encerrado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Em Andamento":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Cancelado":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-police-portal">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-foreground">Carregando concursos...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        {/* Controles */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar concursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar situação" />
                </SelectTrigger>
                <SelectContent>
                  {allSituacoes.map((situacao) => (
                    <SelectItem key={situacao} value={situacao}>
                      {situacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <Dialog open={isNewConcursoOpen} onOpenChange={setIsNewConcursoOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gold text-black hover:bg-gold-light">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Concurso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Concurso</DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo para criar um novo concurso
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={newConcurso.titulo}
                        onChange={(e) => setNewConcurso({...newConcurso, titulo: e.target.value})}
                        placeholder="Título do concurso"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="orgao">Órgão</Label>
                      <Input
                        id="orgao"
                        value={newConcurso.orgao}
                        onChange={(e) => setNewConcurso({...newConcurso, orgao: e.target.value})}
                        placeholder="Órgão responsável"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vagas">Vagas</Label>
                        <Input
                          id="vagas"
                          type="number"
                          value={newConcurso.vagas}
                          onChange={(e) => setNewConcurso({...newConcurso, vagas: Number(e.target.value)})}
                          placeholder="Número de vagas"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="salario">Salário</Label>
                        <Input
                          id="salario"
                          value={newConcurso.salario}
                          onChange={(e) => setNewConcurso({...newConcurso, salario: e.target.value})}
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="inscricoes_inicio">Início das Inscrições</Label>
                        <Input
                          id="inscricoes_inicio"
                          type="date"
                          value={newConcurso.inscricoes_inicio}
                          onChange={(e) => setNewConcurso({...newConcurso, inscricoes_inicio: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="inscricoes_fim">Fim das Inscrições</Label>
                        <Input
                          id="inscricoes_fim"
                          type="date"
                          value={newConcurso.inscricoes_fim}
                          onChange={(e) => setNewConcurso({...newConcurso, inscricoes_fim: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="data_prova">Data da Prova</Label>
                        <Input
                          id="data_prova"
                          type="date"
                          value={newConcurso.data_prova}
                          onChange={(e) => setNewConcurso({...newConcurso, data_prova: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="situacao">Situação</Label>
                        <Select value={newConcurso.situacao} onValueChange={(value) => setNewConcurso({...newConcurso, situacao: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a situação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inscrições Abertas">Inscrições Abertas</SelectItem>
                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                            <SelectItem value="Encerrado">Encerrado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="local">Local</Label>
                        <Input
                          id="local"
                          value={newConcurso.local}
                          onChange={(e) => setNewConcurso({...newConcurso, local: e.target.value})}
                          placeholder="Local do concurso"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={newConcurso.descricao}
                        onChange={(e) => setNewConcurso({...newConcurso, descricao: e.target.value})}
                        placeholder="Descrição do concurso"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="requisitos">Requisitos</Label>
                      <Textarea
                        id="requisitos"
                        value={newConcurso.requisitos}
                        onChange={(e) => setNewConcurso({...newConcurso, requisitos: e.target.value})}
                        placeholder="Requisitos para o concurso"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="beneficios">Benefícios</Label>
                      <Textarea
                        id="beneficios"
                        value={newConcurso.beneficios}
                        onChange={(e) => setNewConcurso({...newConcurso, beneficios: e.target.value})}
                        placeholder="Benefícios oferecidos"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edital_url">URL do Edital</Label>
                      <Input
                        id="edital_url"
                        value={newConcurso.edital_url}
                        onChange={(e) => setNewConcurso({...newConcurso, edital_url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewConcursoOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateConcurso}>
                        Criar Concurso
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>

        {/* Lista de Concursos */}
        <section className="grid gap-6">
          {filteredConcursos.map((concurso) => (
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
                    <span className="font-medium text-foreground">{formatDate(concurso.data_prova)}</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-foreground mb-2">Período de Inscrições</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Início:</span> {formatDate(concurso.inscricoes_inicio)} • 
                    <span className="font-medium ml-2">Fim:</span> {formatDate(concurso.inscricoes_fim)}
                  </p>
                </div>

                {concurso.descricao && (
                  <div className="mb-4">
                    <h4 className="font-medium text-foreground mb-2">Descrição</h4>
                    <p className="text-sm text-muted-foreground">{concurso.descricao}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {concurso.edital_url && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-2" />
                      <a href={concurso.edital_url} target="_blank" rel="noopener noreferrer">
                        Baixar Edital
                      </a>
                    </Button>
                  )}
                  
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

        {filteredConcursos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum concurso encontrado.</p>
          </div>
        )}

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