import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BASE_ROUTE } from "@/lib/config";

export const SelectAnexo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"projects" | "anexos">("projects");
  
  const anexos = [
    { id: 1, title: "Anexo 1", description: "Material Permanente" },
    { id: 2, title: "Anexo 2", description: "Material de Consumo" },
    { id: 3, title: "Anexo 3", description: "Reagentes Químicos" },
    { id: 4, title: "Anexo 4", description: "Livros" },
    { id: 5, title: "Anexo 5", description: "Softwares" },
    { id: 6, title: "Anexo 6", description: "Referentes a CPA" }
  ];

  const projectTypes = [
    { id: 1, title: "01 - Didático-pedagógico" },
    { id: 2, title: "02 - Laboratórios - Ensino e Equipamentos Associados" },
    { id: 3, title: "03 - Pesquisa / Extensão e Equipamentos Associados" },
    { id: 4, title: "04 - Atividades Formativas em Projetos (nível tático)" },
    { id: 5, title: "05 - Infraestrutura (instalações prediais)" },
    { id: 6, title: "06 - Desenvolvimento de pessoas (docentes e servidores)" },
    { id: 7, title: "07 - Convênios e Parcerias Institucionais" },
    { id: 8, title: "08 - Implantação de UE / Cursos" },
    { id: 9, title: "09 - Gestão da Rotina Educacional" },
  ];

  // Função para navegar para a página apropriada
  const handleItemClick = (type: string, id: number) => {
    if (type === "project") {
      navigate(`${BASE_ROUTE}projects/new?type=${id}`);
    } else {
      navigate(`${BASE_ROUTE}anexos/new?type=${id}`);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="font-extrabold text-black text-[32px] text-center mb-6">
        Adicionar Novo Item
      </h1>

      {/* Sistema de Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-6 py-3 font-medium text-lg transition-colors ${
            activeTab === "projects"
              ? "border-b-2 border-[#ae0f0a] text-[#ae0f0a] font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projetos
        </button>
        <button
          className={`px-6 py-3 font-medium text-lg transition-colors ${
            activeTab === "anexos"
              ? "border-b-2 border-[#ae0f0a] text-[#ae0f0a] font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("anexos")}
        >
          Anexos
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="mt-4">
        {activeTab === "projects" && (
          <>
            <p className="text-gray-600 text-center mb-6">Selecione o tipo de projeto que deseja criar</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTypes.map((type) => (
                <Card
                  key={type.id}
                  className="p-6 text-center border-2 border-gray-200 hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5 transition-all cursor-pointer shadow-md"
                  onClick={() => handleItemClick("project", type.id)}
                >
                  <h3 className="text-lg font-semibold">{type.title}</h3>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "anexos" && (
          <>
            <p className="text-gray-600 text-center mb-6">Selecione o anexo que deseja criar</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anexos.map((anexo) => (
                <Card
                  key={anexo.id}
                  className="p-6 text-center border-2 border-gray-200 hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5 transition-all cursor-pointer shadow-md"
                  onClick={() => handleItemClick("anexo", anexo.id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{anexo.title}</h3>
                  <p className="text-gray-500 text-sm">{anexo.description}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};