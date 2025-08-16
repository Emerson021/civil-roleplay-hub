import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, AlertCircle, FileText } from "lucide-react";

const Contato = () => {
  const unidades = [
    {
      nome: "Sede Central",
      endereco: "Rua da Polícia Civil, 100 - Centro",
      cep: "01000-000 - São Paulo/SP",
      telefone: "(11) 3333-1000",
      email: "central@policiacivil.sp.gov.br",
      horario: "24 horas"
    },
    {
      nome: "Delegacia Regional Norte",
      endereco: "Av. Norte, 500 - Zona Norte",
      cep: "02000-000 - São Paulo/SP", 
      telefone: "(11) 3333-2000",
      email: "norte@policiacivil.sp.gov.br",
      horario: "6h às 22h"
    },
    {
      nome: "Delegacia Regional Sul",
      endereco: "Rua Sul, 300 - Zona Sul",
      cep: "04000-000 - São Paulo/SP",
      telefone: "(11) 3333-3000", 
      email: "sul@policiacivil.sp.gov.br",
      horario: "6h às 22h"
    }
  ];

  const tiposContato = [
    {
      icon: AlertCircle,
      titulo: "Emergências",
      descricao: "Para situações urgentes que requerem atendimento imediato",
      telefone: "190",
      cor: "text-red-400 border-red-500/30 bg-red-500/10"
    },
    {
      icon: MessageSquare,
      titulo: "Denúncias",
      descricao: "Relatar crimes ou atividades suspeitas de forma anônima",
      telefone: "181",
      cor: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    },
    {
      icon: FileText,
      titulo: "Informações Gerais",
      descricao: "Dúvidas sobre procedimentos, documentos e serviços",
      telefone: "(11) 3333-4000",
      cor: "text-blue-400 border-blue-500/30 bg-blue-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-police-portal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para atendê-lo. Entre em contato conosco através dos 
            canais disponíveis ou visite uma de nossas unidades.
          </p>
        </section>

        {/* Tipos de Contato */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Canais de Atendimento
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiposContato.map((tipo, index) => (
              <Card key={index} className={`bg-card/80 backdrop-blur-sm border ${tipo.cor} hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className={`p-3 rounded-full ${tipo.cor.replace('text-', 'bg-').replace('400', '500/20')}`}>
                      <tipo.icon className={`h-8 w-8 ${tipo.cor.split(' ')[0]}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{tipo.titulo}</h3>
                  <p className="text-muted-foreground mb-4">{tipo.descricao}</p>
                  <div className={`text-2xl font-bold ${tipo.cor.split(' ')[0]} mb-4`}>
                    {tipo.telefone}
                  </div>
                  <Button variant="outline" size="sm" className={tipo.cor}>
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Formulário de Contato */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Use o formulário abaixo para enviar sua mensagem. Responderemos em até 48 horas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(11) 99999-9999" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input id="assunto" placeholder="Assunto da sua mensagem" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea 
                    id="mensagem" 
                    placeholder="Descreva sua solicitação ou dúvida..."
                    rows={5}
                  />
                </div>
                
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Horários de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segunda a Sexta:</span>
                    <span className="font-medium text-foreground">8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sábados:</span>
                    <span className="font-medium text-foreground">8h às 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domingos e Feriados:</span>
                    <span className="font-medium text-foreground">Plantão 24h</span>
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      * Emergências são atendidas 24 horas por dia, 7 dias por semana
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Outros Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Ouvidoria</h4>
                    <p className="text-sm text-muted-foreground">ouvidoria@policiacivil.sp.gov.br</p>
                    <p className="text-sm text-muted-foreground">(11) 3333-5000</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Imprensa</h4>
                    <p className="text-sm text-muted-foreground">imprensa@policiacivil.sp.gov.br</p>
                    <p className="text-sm text-muted-foreground">(11) 3333-6000</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Recursos Humanos</h4>
                    <p className="text-sm text-muted-foreground">rh@policiacivil.sp.gov.br</p>
                    <p className="text-sm text-muted-foreground">(11) 3333-7000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Unidades */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nossas Unidades
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {unidades.map((unidade, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{unidade.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{unidade.endereco}</p>
                      <p className="text-sm text-muted-foreground">{unidade.cep}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{unidade.telefone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{unidade.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{unidade.horario}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;