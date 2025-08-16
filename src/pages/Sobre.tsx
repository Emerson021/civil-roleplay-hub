import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Award, Target, Eye, Heart } from "lucide-react";

const Sobre = () => {
  const valores = [
    {
      icon: Shield,
      titulo: "Integridade",
      descricao: "Agimos com honestidade, transparência e ética em todas nossas ações."
    },
    {
      icon: Users,
      titulo: "Compromisso Social",
      descricao: "Dedicados a servir e proteger nossa comunidade com excelência."
    },
    {
      icon: Award,
      titulo: "Excelência",
      descricao: "Buscamos constantemente a melhoria e o aperfeiçoamento profissional."
    },
    {
      icon: Target,
      titulo: "Eficiência",
      descricao: "Utilizamos recursos de forma responsável para máxima efetividade."
    },
    {
      icon: Eye,
      titulo: "Transparência",
      descricao: "Mantemos a população informada sobre nossas ações e resultados."
    },
    {
      icon: Heart,
      titulo: "Humanização",
      descricao: "Tratamos cada cidadão com respeito, dignidade e compreensão."
    }
  ];

  const departamentos = [
    {
      nome: "Departamento de Investigações Criminais",
      sigla: "DIC",
      descricao: "Responsável pela investigação de crimes complexos e operações especiais."
    },
    {
      nome: "Departamento de Polícia Judiciária",
      sigla: "DPJ", 
      descricao: "Coordena as atividades de polícia judiciária em todo o estado."
    },
    {
      nome: "Instituto de Criminalística",
      sigla: "IC",
      descricao: "Realiza perícias técnicas e científicas para elucidação de crimes."
    },
    {
      nome: "Departamento de Inteligência",
      sigla: "DI",
      descricao: "Coleta e analisa informações para prevenção e combate ao crime."
    }
  ];

  return (
    <div className="min-h-screen bg-police-portal">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sobre a Polícia Civil
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A Polícia Civil é uma instituição fundamental para a manutenção da ordem pública, 
            dedicada à investigação criminal, proteção dos direitos dos cidadãos e 
            promoção da justiça em nossa sociedade.
          </p>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary mb-3">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Exercer com excelência as funções de polícia judiciária, investigando crimes 
                  e garantindo a segurança pública através do trabalho técnico, científico e humanizado.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary mb-3">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Ser reconhecida como uma instituição de referência em investigação criminal, 
                  inovação tecnológica e atendimento humanizado ao cidadão.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary mb-3">Compromisso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Atuar com transparência, ética e eficiência, promovendo a justiça 
                  e fortalecendo a confiança da sociedade em nossas instituições.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((valor, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <valor.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{valor.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{valor.descricao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Departamentos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Principais Departamentos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {departamentos.map((dept, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {dept.sigla}
                    </Badge>
                    <CardTitle className="text-lg text-foreground">{dept.nome}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {dept.descricao}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* História */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nossa História
          </h2>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A Polícia Civil tem suas raízes na necessidade crescente de uma força investigativa 
                  especializada para atender às demandas de uma sociedade em constante evolução. 
                  Fundada com o objetivo de complementar o trabalho da Polícia Militar, nossa instituição 
                  se especializou na investigação criminal e no exercício da polícia judiciária.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Ao longo dos anos, a Polícia Civil tem se modernizado constantemente, incorporando 
                  novas tecnologias, métodos científicos de investigação e práticas mais humanizadas 
                  de atendimento ao público. Nossa evolução reflete o compromisso contínuo com a 
                  excelência e a adaptação às necessidades contemporâneas da segurança pública.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoje, somos uma instituição respeitada e reconhecida por nosso trabalho técnico, 
                  científico e dedicado ao bem-estar da sociedade. Continuamos nossa missão de 
                  proteger e servir com honra, integridade e profissionalismo.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;