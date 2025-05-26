import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, Target } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface EixoTematico {
  id: number;
  numero: number;
  nome: string;
  descricao: string;
}

export const EixosConfig = () => {
  const [eixos, setEixos] = useState<EixoTematico[]>([
    { id: 1, numero: 1, nome: "Didático-pedagógico", descricao: "Eixo relacionado a atividades de ensino e aprendizagem" },
    { id: 2, numero: 2, nome: "Laboratórios - Ensino e Equipamentos Associados", descricao: "Infraestrutura laboratorial para ensino" },
    { id: 3, numero: 3, nome: "Pesquisa / Extensão e Equipamentos Associados", descricao: "Apoio às atividades de pesquisa e extensão" },
    { id: 4, numero: 4, nome: "Atividades Formativas em Projetos (nível tático)", descricao: "" },
    { id: 5, numero: 5, nome: "Infraestrutura (instalações prediais)", descricao: "" },
    { id: 6, numero: 6, nome: "Desenvolvimento de pessoas (docentes e servidores)", descricao: "" },
    { id: 7, numero: 7, nome: "Convênios e Parcerias Institucionais", descricao: "" },
    { id: 8, numero: 8, nome: "Implantação de UE / Cursos", descricao: "" },
    { id: 9, numero: 9, nome: "Gestão da Rotina Educacional", descricao: "" },
  ]);
  
  const [novoEixo, setNovoEixo] = useState<EixoTematico>({ 
    id: 0, 
    numero: 0, 
    nome: "", 
    descricao: "" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddEixo = () => {
    if (!novoEixo.numero || !novoEixo.nome) {
      alert("Preencha o número e o nome do eixo temático");
      return;
    }

    if (eixos.some(e => e.numero === novoEixo.numero)) {
      alert(`Já existe um eixo com o número ${novoEixo.numero}`);
      return;
    }

    const id = eixos.length > 0 ? Math.max(...eixos.map(e => e.id)) + 1 : 1;
    setEixos([...eixos, { ...novoEixo, id }]);
    setNovoEixo({ id: 0, numero: 0, nome: "", descricao: "" });
  };

  const handleRemoveEixo = (id: number) => {
    setEixos(eixos.filter(e => e.id !== id));
  };

  const handleUpdateDescricao = (id: number, descricao: string) => {
    setEixos(eixos.map(eixo => 
      eixo.id === id ? { ...eixo, descricao } : eixo
    ));
  };
  
  const filteredEixos = eixos.filter(eixo => 
    eixo.numero.toString().includes(searchTerm) ||
    eixo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eixo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Target className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Eixos Temáticos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Os eixos temáticos são as grandes categorias de classificação dos projetos no PGA
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredEixos.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Eixo Temático
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
              Número
            </label>
            <Input
              id="numero"
              type="number"
              placeholder="Ex: 10"
              value={novoEixo.numero || ""}
              onChange={e => setNovoEixo({ ...novoEixo, numero: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Eixo
            </label>
            <Input
              id="nome"
              placeholder="Ex: Qualidade de Vida"
              value={novoEixo.nome}
              onChange={e => setNovoEixo({ ...novoEixo, nome: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            placeholder="Descrição detalhada do eixo temático..."
            value={novoEixo.descricao || ""}
            onChange={e => setNovoEixo({ ...novoEixo, descricao: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddEixo} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Eixo
          </Button>
        </div>
      </Card>
      
      {/* Lista de Eixos */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Eixos Temáticos Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar eixos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredEixos.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-16">Número</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEixos
                  .sort((a, b) => a.numero - b.numero)
                  .map(eixo => (
                    <TableRow key={eixo.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {eixo.numero.toString().padStart(2, '0')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {eixo.nome}
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={eixo.descricao || ""}
                          onChange={(e) => handleUpdateDescricao(eixo.id, e.target.value)}
                          placeholder="Adicione uma descrição opcional..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={2}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveEixo(eixo.id)}
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
                {searchTerm ? "Nenhum eixo temático encontrado com estes critérios." : "Não há eixos temáticos cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};