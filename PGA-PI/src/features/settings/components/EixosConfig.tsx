import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Modal } from "../../../components/ui/modal";
import { Plus, Search, AlertCircle, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { eixosService } from "../services/eixosService";
import { EixoTematico } from "@/types/api";

export const EixosConfig = () => {
  const [eixosTematicos, setEixosTematicos] = useState<EixoTematico[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eixoToDelete, setEixoToDelete] = useState<EixoTematico | null>(null);
  
  const [novoEixo, setNovoEixo] = useState<{ 
    numero: number; 
    nome: string; 
  }>({ 
    numero: 0, 
    nome: "" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eixosData = await eixosService.getAll();
      setEixosTematicos(eixosData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      
      toast({
        variant: "destructive",
        title: "Conectando com dados de exemplo",
        description: "Não foi possível conectar ao servidor. Usando dados locais.",
      });

      setEixosTematicos([
        { eixo_id: 1, numero: 1, nome: "Didático-pedagógico" },
        { eixo_id: 2, numero: 2, nome: "Laboratórios - Ensino e Equipamentos Associados" },
        { eixo_id: 3, numero: 3, nome: "Pesquisa / Extensão e Equipamentos Associados" },
        { eixo_id: 4, numero: 4, nome: "Atividades Formativas em Projetos (nível tático)" },
        { eixo_id: 5, numero: 5, nome: "Infraestrutura (instalações prediais)" },
        { eixo_id: 6, numero: 6, nome: "Desenvolvimento de pessoas (docentes e servidores)" },
        { eixo_id: 7, numero: 7, nome: "Convênios e Parcerias Institucionais" },
        { eixo_id: 8, numero: 8, nome: "Implantação de UE / Cursos" },
        { eixo_id: 9, numero: 9, nome: "Gestão da Rotina Educacional" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEixo = async () => {
    if (!novoEixo.numero || !novoEixo.nome) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o número e o nome do eixo temático",
      });
      return;
    }

    if (eixosTematicos.some(e => e.numero === novoEixo.numero)) {
      toast({
        variant: "destructive",
        title: "Número já existe",
        description: `Já existe um eixo temático com o número ${novoEixo.numero}`,
      });
      return;
    }

    try {
      setLoadingAdd(true);
      
      const novoEixoCreated = await eixosService.create({
        numero: novoEixo.numero,
        nome_eixo: novoEixo.nome
      });
      
      setEixosTematicos([...eixosTematicos, novoEixoCreated]);
      setNovoEixo({ numero: 0, nome: "" });
      
      toast({
        variant: "success",
        title: "Eixo temático adicionado!",
        description: `"${novoEixo.nome}" foi adicionado com sucesso`,
      });
      
    } catch (err) {
      console.error('Erro ao adicionar eixo temático:', err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o eixo temático. Tente novamente.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleShowDeleteModal = (eixo: EixoTematico) => {
    setEixoToDelete(eixo);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEixoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!eixoToDelete) return;
    
    try {
      setLoadingRemove(true);
      
      await eixosService.delete(eixoToDelete.eixo_id);
      setEixosTematicos(eixosTematicos.filter(e => e.eixo_id !== eixoToDelete.eixo_id));
      
      toast({
        variant: "success",
        title: "Eixo removido",
        description: `"${eixoToDelete.nome}" foi removido com sucesso`,
      });
      
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Erro ao remover eixo temático:', err);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o eixo temático. Tente novamente.",
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  const filteredEixos = eixosTematicos.filter(eixo => 
    eixo.numero.toString().includes(searchTerm) ||
    eixo.nome_eixo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-base sm:text-lg text-gray-600">Carregando eixos temáticos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header responsivo com indicador de erro */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
            Gerenciar Eixos Temáticos
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
            Os eixos temáticos são as grandes áreas de atuação do PGA.
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {filteredEixos.length} registros
          </span>
        </div>
      </div>

      {/* Formulário de cadastro responsivo */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-5">
          <h3 className="text-sm sm:text-md font-medium mb-4 text-gray-700 flex items-center">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#ae0f0a] flex-shrink-0" />
            Adicionar Novo Eixo Temático
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="numero" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Número do Eixo
              </label>
              <Input
                id="numero"
                type="number"
                placeholder="Ex: 10"
                value={novoEixo.numero || ""}
                onChange={e => setNovoEixo({ ...novoEixo, numero: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border-gray-300 text-sm"
                disabled={loadingAdd}
              />
            </div>
            
            <div>
              <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Nome do Eixo Temático
              </label>
              <Input
                id="nome"
                placeholder="Ex: Sustentabilidade e Meio Ambiente"
                value={novoEixo.nome}
                onChange={e => setNovoEixo({ ...novoEixo, nome: e.target.value })}
                className="w-full bg-white border-gray-300 text-sm"
                disabled={loadingAdd}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleAddEixo} 
              className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center text-sm px-4 py-2"
              disabled={loadingAdd}
            >
              {loadingAdd ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Eixo
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Lista de Eixos responsiva */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <h3 className="text-sm sm:text-md font-medium text-gray-700">
            Eixos Temáticos Cadastrados
          </h3>
          
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Pesquisar eixos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-9 bg-white text-sm"
            />
            <Search className="absolute left-2 sm:left-3 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredEixos.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-16 sm:w-24 text-xs sm:text-sm px-3 py-3">Número</TableHead>
                    <TableHead className="text-xs sm:text-sm px-3 py-3">Nome do Eixo Temático</TableHead>
                    <TableHead className="w-20 sm:w-24 text-right text-xs sm:text-sm px-3 py-3">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEixos
                    .sort((a, b) => a.numero - b.numero)
                    .map(eixo => (
                      <TableRow key={eixo.eixo_id} className="hover:bg-gray-50">
                        <TableCell className="px-3 py-3">
                          <Badge variant="outline" className="font-mono bg-gray-100 border-gray-300 text-gray-800 font-semibold text-xs">
                            {eixo.numero.toString().padStart(2, '0')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-700 px-3 py-3 text-xs sm:text-sm">
                          {eixo.nome_eixo}
                        </TableCell>
                        <TableCell className="text-right px-3 py-3">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleShowDeleteModal(eixo)}
                            className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20 text-xs px-3 py-1"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Remover</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center px-4">
              <div className="flex justify-center mb-3">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base">
                {searchTerm ? "Nenhum eixo temático encontrado com estes critérios." : "Não há eixos temáticos cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Remoção */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Confirmar Remoção"
        className="max-w-sm sm:max-w-md mx-4 sm:mx-auto"
      >
        <div className="space-y-4 p-4 sm:p-6">
          {/* Ícone de alerta */}
          <div className="flex items-center justify-center">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </div>

          {/* Descrição */}
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
              Esta ação não pode ser desfeita. O eixo temático será removido permanentemente do sistema.
            </p>
          </div>
          
          {/* Preview do item a ser removido */}
          {eixoToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono bg-gray-100 border-gray-300 text-gray-800 font-semibold text-xs">
                  {eixoToDelete.numero.toString().padStart(2, '0')}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{eixoToDelete.nome_eixo}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Eixo Temático</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-900">
              Tem certeza que deseja remover este eixo temático?
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={loadingRemove}
              className="min-w-[100px] text-sm"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loadingRemove}
              className="bg-[#ae0f0a] hover:bg-[#910c08] min-w-[100px] text-sm"
            >
              {loadingRemove ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};