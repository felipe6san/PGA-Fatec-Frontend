import ProjectForm from '../../dashboard/components/projectForm';
import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";

export const AddProject = (): JSX.Element => {

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Adicionar Novo Projeto
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Informações do Projeto
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <ProjectForm />

        </CardContent>
      </Card>
    </>
  );
};