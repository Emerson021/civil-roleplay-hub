import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Video, MessageCircle, ExternalLink } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-police-portal">
      <Header />
      <Hero />
      <NewsSection />
      
      {/* Redes Sociais */}
      <section className="py-16 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Siga a Polícia Civil nas Redes Sociais
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Acompanhe nosso trabalho, fique por dentro das novidades e 
            participe da nossa comunidade digital.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Instagram */}
            <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Instagram</h3>
                <p className="text-muted-foreground mb-6">
                  Fotos dos bastidores, stories exclusivos e atualizações diárias sobre nossas operações
                </p>
                <Button 
                  variant="outline" 
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Seguir @policiacivil_sp
                </Button>
              </CardContent>
            </Card>

            {/* TikTok */}
            <Card className="bg-gradient-to-br from-black/10 to-red-600/10 border-gray-500/20 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-black to-red-600 group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">TikTok</h3>
                <p className="text-muted-foreground mb-6">
                  Conteúdo educativo sobre segurança, prevenção e dicas para a comunidade
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10 hover:border-gray-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Seguir @policiacivil_sp
                </Button>
              </CardContent>
            </Card>

            {/* Discord */}
            <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Discord</h3>
                <p className="text-muted-foreground mb-6">
                  Comunidade oficial para interação com a população e esclarecimentos
                </p>
                <Button 
                  variant="outline" 
                  className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Entrar no Servidor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
