import { TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Users, Target, List, BarChart3, FileText, AlertCircle, Clock, ShieldCheck } from "lucide-react";

interface PgaTabSelectorProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const PgaTabSelector = ({ activeTab, onTabChange }: PgaTabSelectorProps) => {
  const tabs = [
    { id: "pessoas", label: "Pessoas", icon: Users },
    { id: "eixos", label: "Eixos Temáticos", icon: Target },
    { id: "temas", label: "Temas", icon: List },
    { id: "prioridades", label: "Prioridades", icon: BarChart3 },
    { id: "entregaveis", label: "Entregáveis", icon: FileText },
    { id: "situacoes", label: "Situações", icon: AlertCircle },
    { id: "cargahoraria", label: "Carga Horária", icon: Clock },
    { id: "auditoria", label: "Auditoria", icon: ShieldCheck }, // Ícone diferente para auditoria
  ];

  return (
    <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent">
      {tabs.map(tab => (
        <TabsTrigger 
          key={tab.id}
          value={tab.id} 
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center justify-center gap-2 py-3 border rounded-md 
            transition-all duration-200 text-sm font-medium min-h-[60px]
            ${activeTab === tab.id 
              ? "bg-[#ae0f0a]/10 border-[#ae0f0a] text-[#ae0f0a]" 
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex flex-col items-center gap-1">
            <tab.icon className="h-4 w-4" />
            <span className="text-xs leading-tight text-center">{tab.label}</span>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};