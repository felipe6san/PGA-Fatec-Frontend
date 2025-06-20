import { useState } from "react";
import { Tabs, TabsContent } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Toaster } from "../../../components/ui/toaster";
import { Button } from "../../../components/ui/button";
import { PessoasConfig } from "../components/PessoasConfig";
import { EixosConfig } from "../components/EixosConfig";
import { TemasConfig } from "../components/TemasConfig";
import { PrioridadesConfig } from "../components/PrioridadesConfig";
import { EntregaveisConfig } from "../components/EntregaveisConfig";
import { SituacoesConfig } from "../components/SituacoesConfig";
import { CargaHorariaConfig } from "../components/CargaHorariaConfig";
import { PgaTabSelector } from "../components/PgaTabSelector";
import { Cog, Settings as SettingsIcon, Calendar, History } from "lucide-react";
import { AuditHistoryConfig } from '../components/AuditHistoryConfig';
import { PGAHistoryViewer } from '../../dashboard/components/PGAHistoryViewer';

export const Settings = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("pessoas");
  const [viewingHistory, setViewingHistory] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Anos disponíveis
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - i
  );

  // 🔥 ADICIONAR LOG PARA DEBUG
  console.log('🔍 Settings - selectedYear:', selectedYear, 'viewingHistory:', viewingHistory);

  return (
    <div className="container mx-auto py-6">
      {/* Header simples */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <SettingsIcon className="h-8 w-8 mr-3 text-[#ae0f0a]" />
          <h1 className="font-extrabold text-black text-[32px] text-center">
            Configurações do PGA
          </h1>
        </div>

        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          {viewingHistory 
            ? `Visualizando configurações históricas de ${selectedYear} - Estado das configurações conforme registrado neste ano`
            : "Gerencie os dados básicos utilizados no sistema do Plano de Gestão Anual. Estas configurações serão utilizadas em todo o sistema."
          }
        </p>
      </div>

      {/* Card principal com controles no header */}
      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl border-t-4 border-t-[#ae0f0a]">
        <CardHeader className="bg-white-100 rounded-t-xl py-[15px] px-6">
          <div className="flex items-center justify-between">
            {/* Lado esquerdo - Título e descrição */}
            <div className="flex items-center">
              <Cog className="h-6 w-6 mr-2 text-[#ae0f0a]" />
              <div>
                <CardTitle className="font-normal text-black text-[28px]">
                  {viewingHistory ? `Configurações Históricas ${selectedYear}` : 'Gerenciar Configurações do Sistema'}
                </CardTitle>
                <CardDescription>
                  {viewingHistory 
                    ? 'Navegue pelas seções para ver como as configurações estavam organizadas neste período'
                    : 'Utilize as abas abaixo para configurar os diferentes aspectos do sistema'
                  }
                </CardDescription>
              </div>
            </div>

            {/* Lado direito - Controles de histórico */}
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select
                value={selectedYear}
                onChange={(e) => {
                  const newYear = parseInt(e.target.value);
                  console.log('📅 Mudando ano para:', newYear); // 🔥 DEBUG
                  setSelectedYear(newYear);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm min-w-[100px]"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <Button
                variant={viewingHistory ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log('🔄 Toggling viewingHistory:', !viewingHistory); // 🔥 DEBUG
                  setViewingHistory(!viewingHistory);
                }}
                className={viewingHistory ? "bg-[#ae0f0a] hover:bg-[#8d0c08]" : ""}
              >
                <History className="h-4 w-4 mr-1" />
                {viewingHistory ? 'Ver Atual' : 'Ver Histórico'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Conteúdo condicional */}
          {viewingHistory ? (
            <PGAHistoryViewer 
              pgaId={0} 
              ano={selectedYear} 
              key={`history-${selectedYear}`} // 🔥 FORÇA RE-RENDER
            />
          ) : (
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

              <TabsContent value="auditoria" isActive={activeTab === "auditoria"}>
                <AuditHistoryConfig selectedYear={selectedYear} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      <Toaster />
    </div>
  );
};
