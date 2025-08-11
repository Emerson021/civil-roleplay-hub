import { Shield, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Hero = () => {
  return <section id="inicio" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gold/20 rounded-full border border-gold/30">
              <Shield className="h-16 w-16 text-gold" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Portal Oficial da
            <span className="block text-gold mt-2">Polícia Civil Nova Capital</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Mantenha-se informado sobre as últimas operações, comunicados oficiais 
            e atualizações da nossa corporação.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="shadow-lg bg-gold text-black hover:bg-gold-light">
              <FileText className="mr-2 h-5 w-5" />
              Ver Últimas Notícias
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <Users className="mr-2 h-5 w-5" />
              Junte-se à Corporação
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-3xl font-bold text-gold mb-2">150+</div>
              <div className="text-gray-300">Policiais Ativos</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-3xl font-bold text-gold mb-2">500+</div>
              <div className="text-gray-300">Operações Realizadas</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="text-3xl font-bold text-gold mb-2">24/7</div>
              <div className="text-gray-300">Proteção e Serviço</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};