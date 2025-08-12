import { useState } from "react";
import { Menu, X, Shield, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import policeBadge from "@/assets/police-badge.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3">
            <img 
              src={policeBadge} 
              alt="Brasão Polícia Civil" 
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">Polícia Civil</h1>
              <p className="text-xs text-muted-foreground">Portal Roleplay</p>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-foreground hover:text-primary transition-colors">
              Início
            </a>
            <a href="#noticias" className="text-foreground hover:text-primary transition-colors">
              Notícias
            </a>
            <a href="#sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          {/* Botões de Ação */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Olá,</span>
                  <span className="font-medium text-foreground">
                    {profile?.full_name || 'Usuário'}
                  </span>
                  {profile?.badge_number && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {profile.badge_number}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <Button asChild size="sm">
                    <Link to="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu Mobile Expandido */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <a href="#inicio" className="text-foreground hover:text-primary transition-colors">
                Início
              </a>
              <a href="#noticias" className="text-foreground hover:text-primary transition-colors">
                Notícias
              </a>
              <a href="#sobre" className="text-foreground hover:text-primary transition-colors">
                Sobre
              </a>
              <a href="#contato" className="text-foreground hover:text-primary transition-colors">
                Contato
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-center pb-2">
                      <span className="text-muted-foreground">Conectado como: </span>
                      <span className="font-medium">{profile?.full_name || 'Usuário'}</span>
                    </div>
                    {isAdmin && (
                      <Button asChild size="sm" className="w-full">
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/auth">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};