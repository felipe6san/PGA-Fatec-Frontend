import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Plus, Search, AlertCircle, BarChart3, Flag } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface Prioridade {
  id: number;
  grau: number;
  descricao: string;
  tipo_gestao: string;
  detalhes?: string;
}

export const PrioridadesConfig = () => {
  const [prioridades, setPrioridades] = useState<Prioridade[]>([
    { id: 1, grau: 1, descricao: "URGÊNCIA DE REGULAÇÃO", tipo_gestao: "Regulação", detalhes: "Prioridade máxima (advinda de MEC, CEE, MP, Vigilância Sanitária ou notificação de qualquer órgão regulador/fiscalizador)" },
    { id: 2, grau: 2, descricao: "URGÊNCIA ESTRATÉGICA", tipo_gestao: "Estratégico", detalhes: "Gestão Estratégica do CPS (AMS, novos cursos e unidades, programas de governo)" },
    { id: 3, grau: 3, descricao: "PRIORIDADE ALTA", tipo_gestao: "Tático", detalhes: "Gestão Tática (ações correlatas à Avaliação Institucional - ENADE, WebSAI, CPA, Observatório Escolar)" },
    { id: 4, grau: 4, descricao: "PRIORIDADE MÉDIA", tipo_gestao: "Operacional", detalhes: "Gestão Operacional para aumento da capacidade instalada" },
    { id: 5, grau: 5, descricao: "PRIORIDADE REGULAR", tipo_gestao: "Operacional", detalhes: "Gestão Operacional para preservação da capacidade instalada" },
    { id: 6, grau: 6, descricao: "Outro", tipo_gestao: "Outro", detalhes: "" },
  ]);
  
  const [novaPrioridade, setNovaPrioridade] = useState<Prioridade>({ 
    id: 0, 
    grau: 0, 
    descricao: "", 
    tipo_gestao: "",
    detalhes: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const tiposGestao = ["Regulação", "Estratégico", "Tático", "Operacional", "Outro"];

  const handleAddPrioridade = () => {
    if (!novaPrioridade.grau || !novaPrioridade.descricao || !novaPrioridade.tipo_gestao) {
      alert("Preencha o grau, a descrição e o tipo de gestão da prioridade");
      return;
    }

    if (prioridades.some(p => p.grau === novaPrioridade.grau)) {
      alert(`Já existe uma prioridade com o grau ${novaPrioridade.grau}`);
      return;
    }

    const id = prioridades.length > 0 ? Math.max(...prioridades.map(p => p.id)) + 1 : 1;
    
    setPrioridades([...prioridades, { ...novaPrioridade, id }]);
    setNovaPrioridade({ id: 0, grau: 0, descricao: "", tipo_gestao: "", detalhes: "" });
  };

  const handleRemovePrioridade = (id: number) => {
    setPrioridades(prioridades.filter(p => p.id !== id));
  };
  
  const handleUpdateDetalhes = (id: number, detalhes: string) => {
    setPrioridades(prioridades.map(prioridade => 
      prioridade.id === id ? { ...prioridade, detalhes } : prioridade
    ));
  };

  const filteredPrioridades = prioridades.filter(prioridade => 
    prioridade.grau.toString().includes(searchTerm) ||
    prioridade.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prioridade.tipo_gestao && prioridade.tipo_gestao.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (prioridade.detalhes && prioridade.detalhes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityBadgeColor = (grau: number) => {
    switch(grau) {
      case 1: return "bg-red-100 text-red-800 border-red-300";
      case 2: return "bg-orange-100 text-orange-800 border-orange-300";
      case 3: return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 4: return "bg-blue-100 text-blue-800 border-blue-300";
      case 5: return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTipoGestaoBadgeColor = (tipo: string) => {
    switch(tipo) {
      case "Regulação": return "bg-red-100 text-red-800 border-red-300";
      case "Estratégico": return "bg-orange-100 text-orange-800 border-orange-300";
      case "Tático": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Operacional": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Prioridades e Origens
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure as prioridades e origens utilizadas na classificação de projetos e ações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredPrioridades.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Flag className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Prioridade/Origem
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="grau" className="block text-sm font-medium text-gray-700 mb-1">
              Grau de Prioridade
            </label>
            <Input
              id="grau"
              type="number"
              min="1"
              placeholder="Ex: 1 (mais alta) a 6 (mais baixa)"
              value={novaPrioridade.grau || ""}
              onChange={e => setNovaPrioridade({ ...novaPrioridade, grau: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div>
            <label htmlFor="tipo_gestao" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Gestão
            </label>
            <Select
              value={novaPrioridade.tipo_gestao}
              onValueChange={(value) => setNovaPrioridade({ ...novaPrioridade, tipo_gestao: value })}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="Selecione um tipo de gestão" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tiposGestao.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <Input
            id="descricao"
            placeholder="Ex: URGÊNCIA DE REGULAÇÃO"
            value={novaPrioridade.descricao}
            onChange={e => setNovaPrioridade({ ...novaPrioridade, descricao: e.target.value })}
            className="w-full bg-white border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="detalhes" className="block text-sm font-medium text-gray-700 mb-1">
            Detalhamento/Fundamentação (opcional)
          </label>
          <textarea
            id="detalhes"
            placeholder="Ex: Prioridade máxima (advinda de MEC, CEE, MP, Vigilância Sanitária...)"
            value={novaPrioridade.detalhes || ""}
            onChange={e => setNovaPrioridade({ ...novaPrioridade, detalhes: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddPrioridade} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
      </Card>
      
      {/* Lista de Prioridades */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Prioridades e Origens Cadastradas</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar prioridades..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredPrioridades.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-16">Grau</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo de Gestão</TableHead>
                  <TableHead>Detalhes/Fundamentação</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrioridades
                  .sort((a, b) => a.grau - b.grau)
                  .map(prioridade => (
                    <TableRow key={prioridade.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className={`${getPriorityBadgeColor(prioridade.grau)} font-semibold`}>
                          {prioridade.grau}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {prioridade.descricao}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getTipoGestaoBadgeColor(prioridade.tipo_gestao)} font-semibold`}>
                          {prioridade.tipo_gestao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={prioridade.detalhes || ""}
                          onChange={(e) => handleUpdateDetalhes(prioridade.id, e.target.value)}
                          placeholder="Adicione detalhes sobre esta prioridade..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={2}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemovePrioridade(prioridade.id)}
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
                {searchTerm ? "Nenhuma prioridade encontrada com estes critérios." : "Não há prioridades cadastradas ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};