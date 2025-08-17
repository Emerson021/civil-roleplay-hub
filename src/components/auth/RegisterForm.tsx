import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { Eye, EyeOff, User, Mail, Lock, CreditCard } from "lucide-react";

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    rg: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        rg: formData.rg
      });

      if (result.success) {
        // O toast já é mostrado pelo hook useAuth
        setFormData({
          email: "",
          password: "",
          full_name: "",
          rg: ""
        });
      }
    } catch (error) {
      console.error("Erro no registro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatRG = (value: string) => {
    const rg = value.replace(/\D/g, '');
    if (rg.length <= 8) {
      return rg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else {
      return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
  };

  if (loading) {
    return <Loading text="Criando sua conta..." />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se registrar no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo *
            </Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail *
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
            <Label htmlFor="rg" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              RG *
            </Label>
            <Input
              id="rg"
              type="text"
              placeholder="00.000.000-0"
              value={formData.rg}
              onChange={(e) => handleInputChange('rg', formatRG(e.target.value))}
              maxLength={12}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
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
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ao criar uma conta, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Importante:</strong> Após o registro, sua conta ficará pendente de aprovação 
            por um administrador. Você receberá uma notificação quando for aprovado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};