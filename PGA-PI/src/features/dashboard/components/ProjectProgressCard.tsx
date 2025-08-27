import { Card, CardContent, CardHeader } from "./cardDashboard";
import { Progress } from "../../../components/ui/progress";
import { Calendar, User } from "lucide-react";

interface ProjectProgressCardProps {
  project: {
    id: string;
    name: string;
    progress: number;
    responsible: string;
    deadline: string;
    status: "on-track" | "at-risk" | "delayed";
  };
}

export const ProjectProgressCard = ({ project }: ProjectProgressCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 bg-green-50";
      case "at-risk":
        return "text-yellow-600 bg-yellow-50";
      case "delayed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-track":
        return "No prazo";
      case "at-risk":
        return "Em risco";
      case "delayed":
        return "Atrasado";
      default:
        return "Indefinido";
    }
  };

  return (
    <Card className="shadow-[0px_0px_25px_#00000026] rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 mobile-stack">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="mobile-text-sm">{project.responsible}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="mobile-text-sm">{project.deadline}</span>
              </div>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )}`}
          >
            {getStatusText(project.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}; 