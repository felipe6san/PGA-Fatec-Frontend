import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/cardDashboard";
import { StatsCard } from "../components/StatsCard";
import { ProjectProgressCard } from "../components/ProjectProgressCard";
import { EmployeeChart } from "../components/EmployeeChart";
import { UpcomingDeadlines } from "../components/UpcomingDeadlines";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Building2, 
  User, 
  Calendar,
  BarChart3,
  Target,
  AlertCircle
} from "lucide-react";

// Dados mockados para demonstração
const mockEmployees = [
  {
    id: "1",
    name: "Ana Silva",
    hoursAllocated: 40,
    projectsCount: 3,
    department: "Desenvolvimento"
  },
  {
    id: "2",
    name: "Carlos Santos",
    hoursAllocated: 35,
    projectsCount: 2,
    department: "Design"
  },
  {
    id: "3",
    name: "Maria Oliveira",
    hoursAllocated: 30,
    projectsCount: 4,
    department: "Gestão"
  },
  {
    id: "4",
    name: "João Costa",
    hoursAllocated: 25,
    projectsCount: 2,
    department: "Infraestrutura"
  }
];

const mockProjects = [
  {
    id: "1",
    name: "Sistema de Gestão Acadêmica",
    progress: 75,
    responsible: "Ana Silva",
    deadline: "15/03/2025",
    status: "on-track" as const
  },
  {
    id: "2",
    name: "Modernização Laboratórios",
    progress: 45,
    responsible: "Carlos Santos",
    deadline: "28/02/2025",
    status: "at-risk" as const
  },
  {
    id: "3",
    name: "Portal de Comunicação",
    progress: 20,
    responsible: "Maria Oliveira",
    deadline: "10/02/2025",
    status: "delayed" as const
  }
];

const mockDeadlines = [
  {
    id: "1",
    title: "Entrega do Relatório Mensal",
    date: "2025-02-05",
    type: "deadline" as const,
    priority: "high" as const,
    project: "Sistema de Gestão Acadêmica"
  },
  {
    id: "2",
    title: "Reunião de Acompanhamento",
    date: "2025-02-08",
    type: "meeting" as const,
    priority: "medium" as const,
    project: "Modernização Laboratórios"
  },
  {
    id: "3",
    title: "Marco de Desenvolvimento",
    date: "2025-02-12",
    type: "milestone" as const,
    priority: "high" as const,
    project: "Portal de Comunicação"
  }
];

export const Home = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <h1 className="font-extrabold text-black text-2xl md:text-[32px] text-center">
        Dashboard PGA 2025
      </h1>

      {/* Card da Instituição - Melhorado */}
      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl mb-6 md:mb-[30px] bg-gradient-to-r from-[#ae0f0a] to-[#8e0c08] text-white">
        <CardHeader className="bg-white/10 backdrop-blur-sm rounded-t-xl py-4 md:py-6 px-6 md:px-8">
          <div className="flex items-center gap-4">
            <Building2 className="w-8 h-8 text-white" />
            <h2 className="font-semibold text-white text-xl md:text-[28px]">
              IDENTIFICAÇÃO DA UNIDADE
            </h2>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">
                Código da Unidade
              </p>
              <p className="font-bold text-white text-2xl md:text-3xl">F301</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">
                Unidade
              </p>
              <p className="font-bold text-white text-2xl md:text-3xl">
                Fatec Votorantim
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-medium text-white/80 text-base md:text-lg mb-2">
                Diretor(a)
              </p>
              <p className="font-bold text-white text-2xl md:text-3xl">
                Prof. Dr. Mauro Tomazela
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Abas */}
      <Tabs className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mb-6">
          <TabsTrigger
            value="overview"
            isActive={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            isActive={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Projetos</span>
          </TabsTrigger>
          <TabsTrigger
            value="team"
            isActive={activeTab === "team"}
            onClick={() => setActiveTab("team")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Equipe</span>
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            isActive={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Cronograma</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba Visão Geral */}
        <TabsContent value="overview" isActive={activeTab === "overview"}>
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total de Projetos"
                value={mockProjects.length}
                description="Projetos ativos no PGA"
                icon={<Briefcase className="w-5 h-5" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Funcionários Alocados"
                value={mockEmployees.length}
                description="Membros da equipe"
                icon={<Users className="w-5 h-5" />}
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard
                title="Horas Totais"
                value={mockEmployees.reduce((acc, emp) => acc + emp.hoursAllocated, 0)}
                description="Horas alocadas"
                icon={<Clock className="w-5 h-5" />}
                trend={{ value: 5, isPositive: true }}
              />
              <StatsCard
                title="Progresso Médio"
                value={`${Math.round(mockProjects.reduce((acc, proj) => acc + proj.progress, 0) / mockProjects.length)}%`}
                description="Dos projetos"
                icon={<TrendingUp className="w-5 h-5" />}
                trend={{ value: 15, isPositive: true }}
              />
            </div>

            {/* Resumo dos Projetos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Projetos em Destaque
                </h3>
                {mockProjects.slice(0, 2).map((project) => (
                  <ProjectProgressCard key={project.id} project={project} />
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Próximas Datas
                </h3>
                <UpcomingDeadlines deadlines={mockDeadlines.slice(0, 3)} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Aba Projetos */}
        <TabsContent value="projects" isActive={activeTab === "projects"}>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Andamento dos Projetos
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockProjects.map((project) => (
                <ProjectProgressCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Aba Equipe */}
        <TabsContent value="team" isActive={activeTab === "team"}>
          <div className="space-y-6">
            <EmployeeChart employees={mockEmployees} />
          </div>
        </TabsContent>

        {/* Aba Cronograma */}
        <TabsContent value="schedule" isActive={activeTab === "schedule"}>
          <div className="space-y-6">
            <UpcomingDeadlines deadlines={mockDeadlines} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};