import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const Login = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white overflow-hidden w-full max-w-[1728px] relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover blur-[6.85px]"
            alt="Votorantim inaugura"
            src="/votorantim-inaugura-1047641-1.png"
          />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen py-10">
          <img
            className="w-[324px] h-auto mb-6"
            alt="Fatec votorantim"
            src="/fatec-votorantim-1.png"
          />

          <h1 className="font-['Source_Sans_3',Helvetica] font-extrabold text-[#ae0f0a] text-[32px] text-center mb-8">
            Plano de Gestão Anual - PGA 2025
          </h1>

          <Card className="w-full max-w-[644px] bg-white shadow-[0px_0px_25px_#00000033] rounded-[21px]">
            <CardContent className="p-10">
              <h2 className="font-['Source_Sans_3',Helvetica] font-extrabold text-[#2D3748] text-5xl text-center mb-6">
                Login
              </h2>

              <p className="font-['Source_Sans_3',Helvetica] font-normal text-[#4A5568] text-[26px] text-center mb-8">
                Entre com suas credenciais para acessar o sistema.
              </p>

              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block font-['Source_Sans_3',Helvetica] font-normal text-[#2D3748] text-[26px] mb-2"
                >
                  Usuário
                </label>
                <Input
                  id="username"
                  placeholder="Digite seu nome de usuário"
                  className="h-[59px] text-[26px] font-['Source_Sans_3',Helvetica] text-[#4A5568] bg-white rounded-lg border-[#E2E8F0] focus:border-[#ae0f0a] focus:ring-[#ae0f0a]"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="password"
                  className="block font-['Source_Sans_3',Helvetica] font-normal text-[#2D3748] text-[26px] mb-2"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="h-[59px] text-[26px] font-['Source_Sans_3',Helvetica] text-[#4A5568] bg-white rounded-lg border-[#E2E8F0] focus:border-[#ae0f0a] focus:ring-[#ae0f0a]"
                />
              </div>

              <Button className="w-full h-[57px] bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-extrabold text-white text-[26px] transition-colors duration-200">
                Entrar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};