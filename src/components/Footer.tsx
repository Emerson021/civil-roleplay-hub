import { Shield, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Informações */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/brasao-policia.png.png" 
                alt="Brasão Polícia Civil" 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-bold text-gold">Polícia Civil Roleplay</h3>
                <p className="text-sm text-gray-300">Servir e Proteger</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Dedicados a manter a ordem e segurança em nossa comunidade roleplay. 
              Compromisso com a excelência e profissionalismo em todas as operações.
            </p>
            
            {/* Redes Sociais */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 transition-colors"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 transition-colors"
                asChild
              >
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord
                </a>
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-gray-300 hover:text-gold transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#noticias" className="text-gray-300 hover:text-gold transition-colors">
                  Notícias
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-gray-300 hover:text-gold transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#contato" className="text-gray-300 hover:text-gold transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#admin" className="text-gray-300 hover:text-gold transition-colors">
                  Painel Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">contato@policiacivil.rp</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Discord: PC#1234</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Servidor Roleplay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © 2024 Polícia Civil Roleplay. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-300 hover:text-gold transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-gold transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};