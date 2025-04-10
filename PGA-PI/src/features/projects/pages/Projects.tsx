import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";
import React from "react";

const projects = [
  {
    id: 1,
    title: "Projeto de Modernização Laboratorial",
    status: "Em andamento",
    progress: 65,
    deadline: "2025-06-30",
    description: "Este projeto visa atualizar os equipamentos e a infraestrutura dos laboratórios da FATEC para suportar as novas demandas curriculares e de pesquisa.",
    teamMembers: ["Alice Silva", "Bruno Costa", "Carla Dias"],
  },
  {
    id: 2,
    title: "Programa de Mentoria Estudantil",
    status: "Planejado",
    progress: 0,
    deadline: "2025-12-31",
    description: "Iniciativa para conectar alunos experientes com calouros, oferecendo orientação acadêmica e profissional.",
    teamMembers: ["Daniel Oliveira", "Eduarda Lima"],
  },
  // Add more sample projects as needed
];

export const Projects = (): JSX.Element => {
  const [expandedProjectId, setExpandedProjectId] = React.useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Projetos
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Lista de Projetos
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {projects.map((project) => {
              const isExpanded = expandedProjectId === project.id;
              return (
                <div
                  key={project.id}
                  className="border rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <div
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Prazo: {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                            project.status === "Em andamento"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "Planejado"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800" // Example for completed
                          }`}
                        >
                          {project.status}
                        </span>
                        {/* Simple Chevron Icon for Expand/Collapse Indication */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Progresso</span>
                        <span className="text-sm text-gray-600">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#ae0f0a] h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                     <div className="border-t p-4 bg-gray-50">
                       <h4 className="font-semibold text-md mb-2">Descrição</h4>
                       <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                       <h4 className="font-semibold text-md mb-2">Equipe</h4>
                       <ul className="list-disc list-inside text-gray-700 text-sm">
                         {project.teamMembers.map((member, index) => (
                           <li key={index}>{member}</li>
                         ))}
                       </ul>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};