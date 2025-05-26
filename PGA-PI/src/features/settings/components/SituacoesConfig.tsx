import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface SituacaoProblema {
  id: number;
  codigo: string;
  descricao: string;
  fonte: string;
}

export const SituacoesConfig = () => {
  const [situacoes, setSituacoes] = useState<SituacaoProblema[]>([
    {
      id: 1,
      codigo: "cat 0.1.01",
      descricao: "Metodologia de ensino, desempenho de alunos, evasão",
      fonte: "CPA"
    },
    {
      id: 2,
      codigo: "cat 0.1.02",
      descricao: "Manutenção e conservação predial",
      fonte: "Relatório Infraestrutura"
    },
    {
      id: 3,
      codigo: "cat 0.1.03",
      descricao: "Infraestrutura predial (espaços, sistemas)",
      fonte: "CEE"
    },
    {
      id: 4,
      codigo: "cat 0.1.04",
      descricao: "Infraestrutura laboratorial e ambientes de ensino",
      fonte: ""
    },
  ]);
  
  const [novaSituacao, setNovaSituacao] = useState<SituacaoProblema>({ 
    id: 0, 
    codigo: "", 
    descricao: "",
    fonte: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddSituacao = () => {
    if (!novaSituacao.codigo || !novaSituacao.descricao) {
      alert("Preencha o código e a descrição da situação problema");
      return;
    }

    if (situacoes.some(s => s.codigo === novaSituacao.codigo)) {
      alert(`Já existe uma situação problema com o código ${novaSituacao.codigo}`);
      return;
    }

    const id = situacoes.length > 0 ? Math.max(...situacoes.map(s => s.id)) + 1 : 1;
    setSituacoes([...situacoes, { ...novaSituacao, id }]);
    setNovaSituacao({ id: 0, codigo: "", descricao: "", fonte: "" });
  };

  const handleRemoveSituacao = (id: number) => {
    setSituacoes(situacoes.filter(s => s.id !== id));
  };
  
  const filteredSituacoes = situacoes.filter(situacao => 
    situacao.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    situacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    situacao.fonte.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Situações Problema
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure as situações problema identificadas que podem ser associadas aos projetos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredSituacoes.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Situação Problema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <Input
              id="codigo"
              placeholder="Ex: cat 0.1.05"
              value={novaSituacao.codigo}
              onChange={e => setNovaSituacao({ ...novaSituacao, codigo: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div>
            <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-1">
              Fonte (opcional)
            </label>
            <Input
              id="fonte"
              placeholder="Ex: CPA, CEE, Relatório"
              value={novaSituacao.fonte}
              onChange={e => setNovaSituacao({ ...novaSituacao, fonte: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição da Situação Problema
          </label>
          <textarea
            id="descricao"
            placeholder="Descreva a situação problema..."
            value={novaSituacao.descricao}
            onChange={e => setNovaSituacao({ ...novaSituacao, descricao: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddSituacao} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Situação
          </Button>
        </div>
      </Card>
      
      {/* Lista de Situações */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Situações Problema Cadastradas</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar situações..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredSituacoes.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-28">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSituacoes
                  .sort((a, b) => a.codigo.localeCompare(b.codigo))
                  .map(situacao => (
                    <TableRow key={situacao.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {situacao.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {situacao.descricao}
                      </TableCell>
                      <TableCell>
                        {situacao.fonte || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSituacao(situacao.id)}
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
                {searchTerm ? "Nenhuma situação problema encontrada com estes critérios." : "Não há situações problema cadastradas ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};