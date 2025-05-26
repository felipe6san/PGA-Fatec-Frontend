import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BASE_ROUTE } from "@/lib/config";

export const AddAnexo = () => {
  const [anexoType, setAnexoType] = useState<number | null>(null);
  const [vinculatedProjects, setVinculatedProjects] = useState<number[]>([]);
  const [availableProjects, setAvailableProjects] = useState<{ id: number; name: string; }[]>([]);

  const anexoTypes = [
    { id: 1, title: "Anexo 1", description: "Descrição do Anexo 1" },
    { id: 2, title: "Anexo 2", description: "Descrição do Anexo 2" },
    { id: 3, title: "Anexo 3", description: "Descrição do Anexo 3" },
    { id: 4, title: "Anexo 4", description: "Descrição do Anexo 4" },
    { id: 5, title: "Anexo 5", description: "Descrição do Anexo 5" },
    { id: 6, title: "Anexo 6", description: "Descrição do Anexo 6" },
  ];

  // Simular busca de projetos disponíveis
  useEffect(() => {
    setAvailableProjects([
      { id: 1, name: "Modernização dos Laboratórios de Informática" },
      { id: 2, name: "Implementação de Programa de Mentoria Estudantil" },
      // ... outros projetos mockados
    ]);
  }, []);

  const handleProjectToggle = (projectId: number) => {
    setVinculatedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Criar Novo Anexo
      </h1>

      {/* Seleção do Tipo de Anexo */}
      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl mb-6">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            1. Selecione o Tipo de Anexo
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {anexoTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setAnexoType(type.id)}
                className={`p-6 text-center border-2 rounded-lg transition-all ${
                  anexoType === type.id
                    ? "border-[#ae0f0a] bg-[#ae0f0a]/5"
                    : "border-gray-200 hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5"
                }`}
              >
                <h3 className="text-lg font-semibold">{type.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{type.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulário do Anexo */}
      {anexoType && (
        <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
          <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
            <h2 className="font-normal text-black text-[28px]">
              2. Formulário do{" "}
              {anexoTypes.find((t) => t.id === anexoType)?.title}
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Anexo
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ae0f0a] focus:border-transparent"
                  placeholder="Digite o título do anexo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ae0f0a] focus:border-transparent"
                  rows={4}
                  placeholder="Descreva o anexo..."
                />
              </div>

              {/* Vinculação com Projetos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vincular Projetos
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {availableProjects.map((project) => (
                    <label
                      key={project.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={vinculatedProjects.includes(project.id)}
                        onChange={() => handleProjectToggle(project.id)}
                        className="h-4 w-4 text-[#ae0f0a] focus:ring-[#ae0f0a] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {project.name}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {vinculatedProjects.length} projeto(s) selecionado(s)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#ae0f0a] text-white rounded-lg hover:bg-[#8e0c08] transition-colors"
                >
                  Salvar Anexo
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};