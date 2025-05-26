import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle } from "lucide-react";

interface EixoTematico {
  id: number;
  numero: number;
  nome: string;
}

interface Tema {
  id: number;
  tema_num: number;
  eixo_id: number;
  descricao: string;
}

export const TemasConfig = () => {
  // Lista de eixos temáticos
  const [eixosTematicos, setEixosTematicos] = useState<EixoTematico[]>([
    { id: 1, numero: 1, nome: "Didático-pedagógico" },
    { id: 2, numero: 2, nome: "Laboratórios - Ensino e Equipamentos Associados" },
    { id: 3, numero: 3, nome: "Pesquisa / Extensão e Equipamentos Associados" },
    { id: 4, numero: 4, nome: "Atividades Formativas em Projetos (nível tático)" },
    { id: 5, numero: 5, nome: "Infraestrutura (instalações prediais)" },
    { id: 6, numero: 6, nome: "Desenvolvimento de pessoas (docentes e servidores)" },
    { id: 7, numero: 7, nome: "Convênios e Parcerias Institucionais" },
    { id: 8, numero: 8, nome: "Implantação de UE / Cursos" },
    { id: 9, numero: 9, nome: "Gestão da Rotina Educacional" },
  ]);

  const [temas, setTemas] = useState<Tema[]>([
    { id: 1, tema_num: 1, eixo_id: 1, descricao: "Adequação/reestruturação de PPC, implantação de novos cursos" },
    { id: 2, tema_num: 2, eixo_id: 1, descricao: "Eventos e publicações acadêmicos e científicos" },
    { id: 3, tema_num: 3, eixo_id: 1, descricao: "COIL/PCI e Escola de inovadores" },
    { id: 4, tema_num: 4, eixo_id: 1, descricao: "Biblioteca Ativa e aquisição de bibliografias" },
    { id: 5, tema_num: 5, eixo_id: 1, descricao: "Monitoria em disciplina do curso" },
    { id: 6, tema_num: 6, eixo_id: 2, descricao: "Ações pedagógicas: visitas técnicas, projetos integradores" },
    { id: 7, tema_num: 7, eixo_id: 3, descricao: "Divulgação do vestibular e fortalecimento de imagem institucional" },
    { id: 8, tema_num: 15, eixo_id: 4, descricao: "Recursos humanos (auxiliar de docente)" },
    { id: 9, tema_num: 99, eixo_id: 5, descricao: "Outra" },
  ]);
  
  const [novoTema, setNovoTema] = useState<Tema>({ 
    id: 0, 
    tema_num: 0, 
    eixo_id: 0, 
    descricao: "" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTema = () => {
    if (!novoTema.tema_num || !novoTema.eixo_id || !novoTema.descricao) {
      alert("Preencha todos os campos obrigatórios: número do tema, eixo temático e descrição");
      return;
    }

    // Verifica se já existe um tema com o mesmo número e eixo temático
    if (temas.some(t => t.tema_num === novoTema.tema_num && t.eixo_id === novoTema.eixo_id)) {
      alert(`Já existe um tema com o número ${novoTema.tema_num} no mesmo eixo temático`);
      return;
    }

    const id = temas.length > 0 ? Math.max(...temas.map(t => t.id)) + 1 : 1;
    setTemas([...temas, { ...novoTema, id }]);
    setNovoTema({ id: 0, tema_num: 0, eixo_id: 0, descricao: "" });
  };

  const handleRemoveTema = (id: number) => {
    setTemas(temas.filter(t => t.id !== id));
  };

  // Função para obter o número do eixo temático
  const getEixoNumero = (eixo_id: number): number => {
    const eixo = eixosTematicos.find(e => e.id === eixo_id);
    return eixo ? eixo.numero : 0;
  };

  // Função para obter o nome do eixo temático
  const getEixoNome = (eixo_id: number): string => {
    const eixo = eixosTematicos.find(e => e.id === eixo_id);
    return eixo ? eixo.nome : "Eixo não encontrado";
  };

  // Função para formatar o código do tema no formato "cat X.YY"
  const formatarCodigoTema = (eixo_id: number, tema_num: number): string => {
    const eixoNumero = getEixoNumero(eixo_id);
    return `cat ${eixoNumero}.${tema_num.toString().padStart(2, '0')}`;
  };

  // Filtragem de temas com base no termo de busca
  const filteredTemas = temas.filter(tema => 
    formatarCodigoTema(tema.eixo_id, tema.tema_num).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEixoNome(tema.eixo_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    tema.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gerenciar Temas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Os temas são as categorias específicas de projetos vinculados a eixos temáticos.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredTemas.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Tema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="eixo_id" className="block text-sm font-medium text-gray-700 mb-1">
              Eixo Temático
            </label>
            <Select
              value={novoTema.eixo_id ? novoTema.eixo_id.toString() : ""}
              onValueChange={(value) => setNovoTema({ ...novoTema, eixo_id: parseInt(value) })}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="Selecione um eixo temático" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {eixosTematicos.map(eixo => (
                    <SelectItem key={eixo.id} value={eixo.id.toString()}>
                      {eixo.numero.toString().padStart(2, '0')} - {eixo.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="tema_num" className="block text-sm font-medium text-gray-700 mb-1">
              Número do Tema
            </label>
            <Input
              id="tema_num"
              type="number"
              placeholder="Ex: 15"
              value={novoTema.tema_num || ""}
              onChange={e => setNovoTema({ ...novoTema, tema_num: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div className="md:col-span-1">
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-1">
              Código (Visualização)
            </label>
            <div className="h-10 border border-gray-300 rounded-md flex items-center px-3 bg-gray-50 text-gray-500">
              {novoTema.eixo_id ? formatarCodigoTema(novoTema.eixo_id, novoTema.tema_num) : "Selecione um eixo"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Tema
          </label>
          <Input
            id="descricao"
            placeholder="Ex: Recursos humanos (auxiliar de docente)"
            value={novoTema.descricao}
            onChange={e => setNovoTema({ ...novoTema, descricao: e.target.value })}
            className="w-full bg-white border-gray-300"
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddTema} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Tema
          </Button>
        </div>
      </Card>
      
      {/* Lista de Temas */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Temas Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar temas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredTemas.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-28">Código</TableHead>
                  <TableHead>Eixo Temático</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemas
                  .sort((a, b) => {
                    // Primeiro ordena por número do eixo
                    const eixoA = getEixoNumero(a.eixo_id);
                    const eixoB = getEixoNumero(b.eixo_id);
                    
                    if (eixoA !== eixoB) return eixoA - eixoB;
                    
                    // Se for o mesmo eixo, ordena pelo número do tema
                    return a.tema_num - b.tema_num;
                  })
                  .map(tema => (
                    <TableRow key={tema.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {formatarCodigoTema(tema.eixo_id, tema.tema_num)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {getEixoNome(tema.eixo_id)}
                      </TableCell>
                      <TableCell className="text-gray-600">{tema.descricao}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveTema(tema.id)}
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
                {searchTerm ? "Nenhum tema encontrado com estes critérios." : "Não há temas cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};