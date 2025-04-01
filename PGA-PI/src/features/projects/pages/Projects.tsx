import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";

const projects = [
  {
    id: 1,
    title: "Projeto de Modernização Laboratorial",
    status: "Em andamento",
    progress: 65,
    deadline: "2025-06-30",
  },
  {
    id: 2,
    title: "Programa de Mentoria Estudantil",
    status: "Planejado",
    progress: 0,
    deadline: "2025-12-31",
  },
  // Add more sample projects as needed
];

export const Projects = (): JSX.Element => {
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
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-gray-600 mt-1">
                      Prazo: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      project.status === "Em andamento"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};