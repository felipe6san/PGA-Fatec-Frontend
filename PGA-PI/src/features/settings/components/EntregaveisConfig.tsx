import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, FileText } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface Entregavel {
  id: number;
  numero: string;  // Campo adicionado para o número do entregável
  descricao: string;
  detalhes?: string;
}

export const EntregaveisConfig = () => {
  const [entregaveis, setEntregaveis] = useState<Entregavel[]>([
    { id: 1, numero: "01", descricao: "Solicitação Material Permanente", detalhes: "" },
    { id: 2, numero: "02", descricao: "Solicitação Material Consumo", detalhes: "" },
    { id: 3, numero: "03", descricao: "Solicitação Reagente Químico", detalhes: "" },
    { id: 4, numero: "04", descricao: "Solicitação Livros", detalhes: "" },
    { id: 5, numero: "05", descricao: "Solicitação de Software", detalhes: "" },
    { id: 6, numero: "06", descricao: "Portaria", detalhes: "" },
    { id: 7, numero: "07", descricao: "Edital", detalhes: "" },
    { id: 8, numero: "08", descricao: "Parecer", detalhes: "" },
    { id: 9, numero: "09", descricao: "Memorando", detalhes: "" },
    { id: 10, numero: "99", descricao: "Outros", detalhes: "" },
  ]);
  
  const [novoEntregavel, setNovoEntregavel] = useState<Entregavel>({ 
    id: 0, 
    numero: "", 
    descricao: "",
    detalhes: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddEntregavel = () => {
    if (!novoEntregavel.numero || !novoEntregavel.descricao) {
      alert("Preencha o número e a descrição do entregável");
      return;
    }

    if (entregaveis.some(e => e.numero === novoEntregavel.numero)) {
      alert(`Já existe um entregável com o número ${novoEntregavel.numero}`);
      return;
    }

    const id = entregaveis.length > 0 ? Math.max(...entregaveis.map(e => e.id)) + 1 : 1;
    setEntregaveis([...entregaveis, { ...novoEntregavel, id }]);
    setNovoEntregavel({ id: 0, numero: "", descricao: "", detalhes: "" });
  };

  const handleRemoveEntregavel = (id: number) => {
    setEntregaveis(entregaveis.filter(e => e.id !== id));
  };

  const handleUpdateDetalhes = (id: number, detalhes: string) => {
    setEntregaveis(entregaveis.map(entregavel => 
      entregavel.id === id ? { ...entregavel, detalhes } : entregavel
    ));
  };
  
  const filteredEntregaveis = entregaveis.filter(entregavel => 
    entregavel.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entregavel.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entregavel.detalhes && entregavel.detalhes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Entregáveis
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure os tipos de entregáveis que podem ser anexados aos projetos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredEntregaveis.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Entregável
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
              Número
            </label>
            <Input
              id="numero"
              placeholder="Ex: 10"
              value={novoEntregavel.numero}
              onChange={e => setNovoEntregavel({ ...novoEntregavel, numero: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Relatório Técnico"
              value={novoEntregavel.descricao}
              onChange={e => setNovoEntregavel({ ...novoEntregavel, descricao: e.target.value })}
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
            placeholder="Detalhes sobre este entregável..."
            value={novoEntregavel.detalhes || ""}
            onChange={e => setNovoEntregavel({ ...novoEntregavel, detalhes: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddEntregavel} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Entregável
          </Button>
        </div>
      </Card>
      
      {/* Lista de Entregáveis */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Entregáveis Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar entregáveis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredEntregaveis.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-24">Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntregaveis
                  .sort((a, b) => a.numero.localeCompare(b.numero))
                  .map(entregavel => (
                    <TableRow key={entregavel.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {entregavel.numero}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {entregavel.descricao}
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={entregavel.detalhes || ""}
                          onChange={(e) => handleUpdateDetalhes(entregavel.id, e.target.value)}
                          placeholder="Adicione detalhes sobre este entregável..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={1}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveEntregavel(entregavel.id)}
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
                {searchTerm ? "Nenhum entregável encontrado com estes critérios." : "Não há entregáveis cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};