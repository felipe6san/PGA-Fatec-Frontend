import { Card, CardContent, CardHeader } from "./cardDashboard";
import { User, Clock, Briefcase } from "lucide-react";

interface EmployeeData {
  id: string;
  name: string;
  hoursAllocated: number;
  projectsCount: number;
  department: string;
}

interface EmployeeChartProps {
  employees: EmployeeData[];
}

export const EmployeeChart = ({ employees }: EmployeeChartProps) => {
  const maxHours = Math.max(...employees.map(emp => emp.hoursAllocated));

  return (
    <Card className="shadow-[0px_0px_25px_#00000026] rounded-xl">
      <CardHeader className="bg-neutral-100 rounded-t-xl py-3 md:py-[15px] px-4 md:px-6">
        <h2 className="font-normal text-black text-xl md:text-[28px]">
          Alocação de Funcionários
        </h2>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{employee.name}</span>
                  <span className="text-sm text-gray-500">({employee.department})</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{employee.hoursAllocated}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{employee.projectsCount} projetos</span>
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso visual */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#ae0f0a] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(employee.hoursAllocated / maxHours) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
          
          {employees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum funcionário alocado ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 