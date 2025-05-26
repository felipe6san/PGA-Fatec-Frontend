import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SelectProjectType = () => {
  const navigate = useNavigate();
  const { anexoId, subId } = useParams();

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

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Adicionar Novo Projeto - Anexo {anexoId}.{subId}
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Selecione o Tipo de Projeto
          </h2>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectTypes.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                navigate(`/projects/new/anexo/${anexoId}/${subId}/${type.id}`)
              }
              className="p-6 text-center border-2 border-gray-200 rounded-lg hover:border-[#ae0f0a] hover:bg-[#ae0f0a]/5 transition-all"
            >
              <h3 className="text-xl font-semibold">{type.title}</h3>
            </button>
          ))}
        </CardContent>
      </Card>
    </>
  );
};