import { Badge } from "../components/badge";
import { Card, CardContent, CardHeader } from "../components/cardDashboard";

const problemSituations = [
  { id: "01", text: "Metodologia de ensino, desempenho de alunos, evasão" },
  { id: "02", text: "Manutenção e conservação predial" },
  { id: "04", text: "Infraestrutura laboratorial e ambientes de ensino" },
  { id: "05", text: "Materiais, equipamentos e mobiliários" },
  { id: "07", text: "Comunicação com a comunidade acadêmica" },
  { id: "08", text: "Participação da comunidade e sociedade" },
  { id: "11", text: "Segurança pessoal e patrimonial" },
  { id: "99", text: "Internet deficitária" },
];

export const Home = (): JSX.Element => {
  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Plano de Gestão Anual - PGA 2025
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl mb-[30px]">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            IDENTIFICAÇÃO DA UNIDADE
          </h2>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="font-normal text-[#9d9d9d] text-lg">
              Código da Unidade
            </p>
            <p className="font-normal text-black text-2xl mt-1">F301</p>
          </div>
          <div>
            <p className="font-normal text-[#9d9d9d] text-lg">Unidade</p>
            <p className="font-normal text-black text-2xl mt-1">
              Fatec Votorantim
            </p>
          </div>
          <div>
            <p className="font-normal text-[#9d9d9d] text-lg">
              Diretor(a)
            </p>
            <p className="font-normal text-black text-2xl mt-1">
              Prof. Dr. Mauro Tomazela
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            APONTAMENTO DE SITUAÇÕES-PROBLEMA MAIS RELEVANTES
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {problemSituations.map((problem, index) => (
              <div key={index} className="flex items-center gap-3">
                <Badge className="bg-[#ffe4e3] text-[#ae0f0a] rounded-[28px] h-[17px] min-w-[30px] flex items-center justify-center text-sm font-normal">
                  {problem.id}
                </Badge>
                <span className="font-normal text-black text-base">
                  {problem.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};