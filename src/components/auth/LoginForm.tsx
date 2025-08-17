import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export const LoginForm = () => {
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário autenticado, redirecionando...');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando fazer login...');
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login bem-sucedido!');
        // O toast já é mostrado pelo hook useAuth
        setFormData({
          email: "",
          password: ""
        });
        // Redirecionar após login bem-sucedido
        navigate('/');
      } else {
        console.log('Login falhou:', result.error);
        // Manter loading false se falhar
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setLoading(false);
    } finally {
      // SEMPRE resetar loading, independente do resultado
      setLoading(false);
      console.log('Login processado - Loading resetado');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mostrar loading do auth se estiver carregando
  if (authLoading) {
    return <Loading text="Carregando..." />;
  }

  // Mostrar loading do formulário se estiver fazendo login
  if (loading) {
    return <Loading text="Fazendo login..." />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Faça login com suas credenciais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Esqueceu sua senha?{" "}
            <a href="#" className="text-primary hover:underline">
              Recuperar senha
            </a>
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Lembrete:</strong> Se sua conta ainda não foi aprovada, 
            entre em contato com a administração.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};