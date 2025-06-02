import { Card, CardContent, CardHeader } from "./cardDashboard";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  date: string;
  type: "milestone" | "deadline" | "meeting";
  priority: "high" | "medium" | "low";
  project?: string;
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <Calendar className="w-4 h-4" />;
      case "deadline":
        return <Clock className="w-4 h-4" />;
      case "meeting":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "milestone":
        return "Marco";
      case "deadline":
        return "Prazo";
      case "meeting":
        return "Reunião";
      default:
        return "Evento";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays > 0) return `Em ${diffDays} dias`;
    return `${Math.abs(diffDays)} dias atrás`;
  };

  return (
    <Card className="shadow-[0px_0px_25px_#00000026] rounded-xl">
      <CardHeader className="bg-white-100 rounded-t-xl py-3 md:py-[15px] px-4 md:px-6">
        <h2 className="font-normal text-black text-xl md:text-[28px]">
          Próximas Datas Importantes
        </h2>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`p-3 rounded-lg border ${getPriorityColor(deadline.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getTypeIcon(deadline.type)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                    {deadline.project && (
                      <p className="text-sm text-gray-600 mt-1">
                        Projeto: {deadline.project}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-white rounded-full border">
                        {getTypeText(deadline.type)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(deadline.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(deadline.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {deadlines.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma data importante próxima</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 