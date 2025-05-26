import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, Clock } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface CargaHoraria {
  id: number;
  sigla: string;
  descricao: string;
  detalhes: string;
}

export const CargaHorariaConfig = () => {
  const [cargaHorarias, setCargaHorarias] = useState<CargaHoraria[]>([
    { id: 1, sigla: "HAE", descricao: "Hora Atividade Específica", detalhes: "" },
    { id: 2, sigla: "HAA", descricao: "Hora Atividade Acadêmica", detalhes: "" },
    { id: 3, sigla: "HAP", descricao: "Hora Atividade de Pesquisa", detalhes: "" },
    { id: 4, sigla: "H", descricao: "Hora <não tipificada>", detalhes: "" },
  ]);
  
  const [novaCargaHoraria, setNovaCargaHoraria] = useState<CargaHoraria>({ 
    id: 0, 
    sigla: "", 
    descricao: "",
    detalhes: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCargaHoraria = () => {
    if (!novaCargaHoraria.sigla || !novaCargaHoraria.descricao) {
      alert("Preencha a sigla e a descrição da carga horária");
      return;
    }

    if (cargaHorarias.some(c => c.sigla === novaCargaHoraria.sigla)) {
      alert(`Já existe uma carga horária com a sigla ${novaCargaHoraria.sigla}`);
      return;
    }

    const id = cargaHorarias.length > 0 ? Math.max(...cargaHorarias.map(c => c.id)) + 1 : 1;
    setCargaHorarias([...cargaHorarias, { ...novaCargaHoraria, id }]);
    setNovaCargaHoraria({ id: 0, sigla: "", descricao: "", detalhes: "" });
  };

  const handleRemoveCargaHoraria = (id: number) => {
    setCargaHorarias(cargaHorarias.filter(c => c.id !== id));
  };

  const handleUpdateDetalhes = (id: number, detalhes: string) => {
    setCargaHorarias(cargaHorarias.map(carga => 
      carga.id === id ? { ...carga, detalhes } : carga
    ));
  };
  
  const filteredCargaHorarias = cargaHorarias.filter(carga => 
    carga.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carga.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carga.detalhes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Tipos de Carga Horária
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure os tipos de carga horária que podem ser alocados em projetos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredCargaHorarias.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Tipo de Carga Horária
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="sigla" className="block text-sm font-medium text-gray-700 mb-1">
              Sigla
            </label>
            <Input
              id="sigla"
              placeholder="Ex: HAD"
              value={novaCargaHoraria.sigla}
              onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, sigla: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Hora Atividade Docente"
              value={novaCargaHoraria.descricao}
              onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, descricao: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="detalhes" className="block text-sm font-medium text-gray-700 mb-1">
            Detalhes (opcional)
          </label>
          <textarea
            id="detalhes"
            placeholder="Detalhes sobre este tipo de carga horária..."
            value={novaCargaHoraria.detalhes || ""}
            onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, detalhes: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddCargaHoraria} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Carga Horária
          </Button>
        </div>
      </Card>
      
      {/* Lista de Cargas Horárias */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Tipos de Carga Horária Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar carga horária..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredCargaHorarias.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-20">Sigla</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCargaHorarias
                  .sort((a, b) => a.sigla.localeCompare(b.sigla))
                  .map(carga => (
                    <TableRow key={carga.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {carga.sigla}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {carga.descricao}
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={carga.detalhes || ""}
                          onChange={(e) => handleUpdateDetalhes(carga.id, e.target.value)}
                          placeholder="Adicione detalhes sobre este tipo de carga horária..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={1}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveCargaHoraria(carga.id)}
                          className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20"
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-3">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {searchTerm ? "Nenhum tipo de carga horária encontrado com estes critérios." : "Não há tipos de carga horária cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};