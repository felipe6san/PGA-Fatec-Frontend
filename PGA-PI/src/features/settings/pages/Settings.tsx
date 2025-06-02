import { useState } from "react";
import { Tabs, TabsContent } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Toaster } from "../../../components/ui/toaster";
import { PessoasConfig } from "../components/PessoasConfig";
import { EixosConfig } from "../components/EixosConfig";
import { TemasConfig } from "../components/TemasConfig";
import { PrioridadesConfig } from "../components/PrioridadesConfig";
import { EntregaveisConfig } from "../components/EntregaveisConfig";
import { SituacoesConfig } from "../components/SituacoesConfig";
import { CargaHorariaConfig } from "../components/CargaHorariaConfig";
import { PgaTabSelector } from "../components/PgaTabSelector";
import { Cog, Settings as SettingsIcon } from "lucide-react";

export const Settings = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("pessoas");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-center mb-6">
        <SettingsIcon className="h-8 w-8 mr-3 text-[#ae0f0a]" />
        <h1 className="font-extrabold text-black text-[32px] text-center">
          Configurações do PGA
        </h1>
      </div>

      {/* Descrição principal */}
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
        Gerencie os dados básicos utilizados no sistema do Plano de Gestão Anual. 
        Estas configurações serão utilizadas em todo o sistema.
      </p>

      {/* Configurações do PGA */}
      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl border-t-4 border-t-[#ae0f0a]">
        <CardHeader className="bg-white-100 rounded-t-xl py-[15px] px-6">
          <div className="flex items-center">
            <Cog className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            <div>
              <CardTitle className="font-normal text-black text-[28px]">
                Gerenciar Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Utilize as abas abaixo para configurar os diferentes aspectos do sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <PgaTabSelector activeTab={activeTab} onTabChange={setActiveTab} />
            
            <TabsContent value="pessoas" isActive={activeTab === "pessoas"}>
              <PessoasConfig />
            </TabsContent>
            
            <TabsContent value="eixos" isActive={activeTab === "eixos"}>
              <EixosConfig />
            </TabsContent>
            
            <TabsContent value="temas" isActive={activeTab === "temas"}>
              <TemasConfig />
            </TabsContent>
            
            <TabsContent value="prioridades" isActive={activeTab === "prioridades"}>
              <PrioridadesConfig />
            </TabsContent>
            
            <TabsContent value="entregaveis" isActive={activeTab === "entregaveis"}>
              <EntregaveisConfig />
            </TabsContent>
            
            <TabsContent value="situacoes" isActive={activeTab === "situacoes"}>
              <SituacoesConfig />
            </TabsContent>
            
            <TabsContent value="cargahoraria" isActive={activeTab === "cargahoraria"}>
              <CargaHorariaConfig />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Toaster />
    </div>
  );
};
