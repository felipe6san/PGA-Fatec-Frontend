import { useAuth } from "../../hooks/useAuth";

export const Header = (): JSX.Element => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Plano de Gestão Anual
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Olá, {user?.nome}
          </div>
          <div className="h-8 w-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center font-medium">
            {user?.nome.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};