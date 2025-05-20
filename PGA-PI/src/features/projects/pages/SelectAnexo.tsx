import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SelectAnexo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewProject = location.pathname.includes("/new");
  
  const anexos = [
    { id: 1, title: "Anexo 1" },
    { id: 2, title: "Anexo 2" },
    { id: 3, title: "Anexo 3" },
    { id: 4, title: "Anexo 4" },
    { id: 5, title: "Anexo 5" },
    { id: 6, title: "Anexo 6" }
  ];

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        {isNewProject ? "Adicionar Novo Projeto" : "Visualizar Projetos"}
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Selecione o Anexo
          </h2>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {anexos.map((anexo) => (
            <button
              key={anexo.id}
              onClick={() => navigate(`${isNewProject ? "/projects/new" : "/projects"}/anexo/${anexo.id}`)}
              className="p-6 text-center border-2 border-gray-200 rounded-lg hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5 transition-all"
            >
              <h3 className="text-xl font-semibold">{anexo.title}</h3>
            </button>
          ))}
        </CardContent>
      </Card>
    </>
  );
};