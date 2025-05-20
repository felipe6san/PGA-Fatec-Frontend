import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SelectSubAnexo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { anexoId } = useParams();
  const isNewProject = location.pathname.includes("/new");

  const subAnexos = [
    { id: 1, title: `Anexo ${anexoId}.1` },
    { id: 2, title: `Anexo ${anexoId}.2` },
    { id: 3, title: `Anexo ${anexoId}.3` }
  ];

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        {isNewProject ? "Adicionar Novo Projeto" : "Visualizar Projetos"} - Anexo {anexoId}
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Selecione o Sub-Anexo {anexoId}
          </h2>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {subAnexos.map((subAnexo) => (
            <button
              key={subAnexo.id}
              onClick={() => navigate(`${isNewProject ? "/projects/new" : "/projects"}/anexo/${anexoId}/${subAnexo.id}`)}
              className="p-6 text-center border-2 border-gray-200 rounded-lg hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5 transition-all"
            >
              <h3 className="text-xl font-semibold">{subAnexo.title}</h3>
            </button>
          ))}
        </CardContent>
      </Card>
    </>
  );
};