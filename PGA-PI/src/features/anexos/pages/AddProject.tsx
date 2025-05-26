import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProjectForm from "@/features/projects/components/projectForm";
import { BASE_ROUTE } from "@/lib/config";

export const AddProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeId = searchParams.get("type");

  // Mock das categorias/temas do projeto (mantemos para passar ao ProjectForm)
  const temasProjeto = [
    {
      id: "1.01",
      code: "cat 1.01",
      description: "Adequação/reestruturação de PPC, implantação de novos cursos",
    },
    {
      id: "1.02",
      code: "cat 1.02",
      description: "Eventos e publicações acadêmicos e científicos",
    },
    { id: "1.03", code: "cat 1.03", description: "COIL/PCI e Escola de inovadores" },
    { id: "1.04", code: "cat 1.04", description: "Biblioteca Ativa e aquisição de bibliografias" },
    { id: "1.05", code: "cat 1.05", description: "Monitoria em disciplina do curso" },
    {
      id: "1.06",
      code: "cat 1.06",
      description: "Ações pedagógicas: visitas técnicas, projetos integradores",
    },
    {
      id: "1.07",
      code: "cat 1.07",
      description: "Divulgação do vestibular e fortalecimento de imagem institucional",
    },
    {
      id: "1.08",
      code: "cat 1.08",
      description: "Eventos e ações para aperfeiçoamento docente",
    },
    { id: "1.09", code: "cat 1.09", description: "Inclusão" },
    {
      id: "1.10",
      code: "cat 1.10",
      description: "Mobiliário das salas de aula e espaços pedagógicos",
    },
    {
      id: "1.11",
      code: "cat 1.11",
      description: "Ações de nivelamento, ENADE, acolhimento e permanência",
    },
    {
      id: "1.12",
      code: "cat 1.12",
      description: "Orientação profissional, mentoria e apoio psicopedagógico",
    },
    { id: "1.13", code: "cat 1.13", description: "Estágio" },
    { id: "1.14", code: "cat 1.14", description: "Curso de Extensão" },
    { id: "1.15", code: "cat 1.15", description: "Recursos humanos (auxiliar de docente)" },
    { id: "1.99", code: "cat 1.99", description: "Outra" },
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

  const selectedType = projectTypes.find(
    (t) => t.id === parseInt(typeId || "0")
  );

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => navigate(`${BASE_ROUTE}projects`)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Voltar para seleção
        </button>
      </div>

      <div className="mb-6">
        <h1 className="font-extrabold text-black text-[32px] text-center mb-2">
          Criar Novo Projeto
        </h1>
        {selectedType && (
          <p className="text-center text-gray-600 text-lg mb-4">
            {selectedType.title}
          </p>
        )}
      </div>

      {/* Renderiza o formulário principal diretamente */}
      <ProjectForm temasProjeto={temasProjeto} />
    </>
  );
};