import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, GitBranch } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface Origem {
  id: number;
  codigo: number;
  descricao: string;
  detalhes: string;
}

export const OrigemConfig = () => {
  const [origens, setOrigens] = useState<Origem[]>([
    { id: 1, codigo: 1, descricao: "Regulação - Notificação de órgão (MEC, CEE, VS...)", detalhes: "" },
    { id: 2, codigo: 2, descricao: "Gestão Estratégica Institucional (AMS, novos cursos e unidades)", detalhes: "" },
    { id: 3, codigo: 3, descricao: "Gestão Tática - CPA (RAIE, RSCE, RAA, PDI, Websai...)", detalhes: "" },
    { id: 4, codigo: 4, descricao: "Gestão Operacional - Aumento de capacidade instalada", detalhes: "" },
    { id: 5, codigo: 5, descricao: "Gestão Operacional - Preservação da capacidade instalada", detalhes: "" },
    { id: 6, codigo: 6, descricao: "Outro", detalhes: "" },
  ]);
  
  const [novaOrigem, setNovaOrigem] = useState<Origem>({ 
    id: 0, 
    codigo: 0, 
    descricao: "",
    detalhes: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddOrigem = () => {
    if (!novaOrigem.codigo || !novaOrigem.descricao) {
      alert("Preencha o código e a descrição da origem");
      return;
    }

    if (origens.some(o => o.codigo === novaOrigem.codigo)) {
      alert(`Já existe uma origem com o código ${novaOrigem.codigo}`);
      return;
    }

    const id = origens.length > 0 ? Math.max(...origens.map(o => o.id)) + 1 : 1;
    setOrigens([...origens, { ...novaOrigem, id }]);
    setNovaOrigem({ id: 0, codigo: 0, descricao: "", detalhes: "" });
  };

  const handleRemoveOrigem = (id: number) => {
    setOrigens(origens.filter(o => o.id !== id));
  };

  const handleUpdateDetalhes = (id: number, detalhes: string) => {
    setOrigens(origens.map(origem => 
      origem.id === id ? { ...origem, detalhes } : origem
    ));
  };
  
  const filteredOrigens = origens.filter(origem => 
    origem.codigo.toString().includes(searchTerm) ||
    origem.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    origem.detalhes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <GitBranch className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Origens
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure as origens ou regulações que motivaram a criação dos projetos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredOrigens.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Origem
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <Input
              id="codigo"
              type="number"
              placeholder="Ex: 7"
              value={novaOrigem.codigo || ""}
              onChange={e => setNovaOrigem({ ...novaOrigem, codigo: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Demanda Interna"
              value={novaOrigem.descricao}
              onChange={e => setNovaOrigem({ ...novaOrigem, descricao: e.target.value })}
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
            placeholder="Detalhes sobre esta origem..."
            value={novaOrigem.detalhes || ""}
            onChange={e => setNovaOrigem({ ...novaOrigem, detalhes: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddOrigem} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Origem
          </Button>
        </div>
      </Card>
      
      {/* Lista de Origens */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Origens Cadastradas</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar origens..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredOrigens.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-16">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrigens
                  .sort((a, b) => a.codigo - b.codigo)
                  .map(origem => (
                    <TableRow key={origem.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {origem.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {origem.descricao}
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={origem.detalhes || ""}
                          onChange={(e) => handleUpdateDetalhes(origem.id, e.target.value)}
                          placeholder="Adicione detalhes sobre esta origem..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={1}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveOrigem(origem.id)}
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
                {searchTerm ? "Nenhuma origem encontrada com estes critérios." : "Não há origens cadastradas ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};