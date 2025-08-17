import { Shield, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export const AdminFloatingButton = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Só mostra se for admin e estiver autenticado
  if (!isAdmin || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <div className="flex flex-col items-end space-y-2">
          {/* Botão para fechar */}
          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-lg"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Botão do painel admin */}
          <Button
            asChild
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            <Link to="/admin">
              <Shield className="h-5 w-5 mr-2" />
              Painel Admin
            </Link>
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full w-14 h-14"
          onClick={() => setIsExpanded(true)}
        >
          <Shield className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
