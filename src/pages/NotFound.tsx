import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-police-portal">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 text-gold">404</h1>
        <p className="text-xl text-gray-200 mb-4">Oops! Página não encontrada</p>
        <a href="/" className="text-gold hover:text-gold-light underline transition-colors">
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
