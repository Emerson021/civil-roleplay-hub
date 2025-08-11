import { useState } from "react";
import { Menu, X, Shield, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="bg-black/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <img src="/brasao-policia.png.png"  alt="Brasão Polícia Civil" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-gold">Polícia Civil</h1>
              <p className="text-xs text-gray-300">Portal  PCSP</p>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-white hover:text-gold transition-colors">
              Início
            </a>
            <a href="#noticias" className="text-white hover:text-gold transition-colors">
              Notícias
            </a>
            <a href="#sobre" className="text-white hover:text-gold transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-white hover:text-gold transition-colors">
              Contato
            </a>
          </nav>

          {/* Botões de Ação */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-gold text-black hover:bg-gold-light">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>

          {/* Menu Mobile */}
          <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu Mobile Expandido */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-3">
              <a href="#inicio" className="text-white hover:text-gold transition-colors">
                Início
              </a>
              <a href="#noticias" className="text-white hover:text-gold transition-colors">
                Notícias
              </a>
              <a href="#sobre" className="text-white hover:text-gold transition-colors">
                Sobre
              </a>
              <a href="#contato" className="text-white hover:text-gold transition-colors">
                Contato
              </a>
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/20 text-white hover:bg-white/10">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="flex-1 bg-gold text-black hover:bg-gold-light">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};