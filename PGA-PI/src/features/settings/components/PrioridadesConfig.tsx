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
import { prioridadesService } from "../services/prioridadesService";
import { PrioridadeAcao } from "@/types/api";

export const PrioridadesConfig = () => {
  const [prioridades, setPrioridades] = useState<PrioridadeAcao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Estados do modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prioridadeToDelete, setPrioridadeToDelete] = useState<PrioridadeAcao | null>(null);
  
  const [novaPrioridade, setNovaPrioridade] = useState<{ 
    grau: number; 
    tipo_gestao: string; 
    descricao: string; 
    detalhes: string; 
  }>({ 
    grau: 0, 
    tipo_gestao: "", 
    descricao: "", 
    detalhes: "" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Carrega dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const prioridadesData = await prioridadesService.getAll();
      setPrioridades(prioridadesData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      
      toast({
        variant: "destructive",
        title: "Conectando com dados de exemplo",
        description: "Não foi possível conectar ao servidor. Usando dados locais.",
      });
      
      // Fallback para dados mock em caso de erro
      setPrioridades([
        { prioridade_id: 1, grau: 1, tipo_gestao: "Estratégico", descricao: "Muito Alta", detalhes: "Prioridade máxima para ações estratégicas" },
        { prioridade_id: 2, grau: 2, tipo_gestao: "Tático", descricao: "Alta", detalhes: "Prioridade alta para ações táticas" },
        { prioridade_id: 3, grau: 3, tipo_gestao: "Operacional", descricao: "Média", detalhes: "Prioridade média para ações operacionais" },
        { prioridade_id: 4, grau: 4, tipo_gestao: "Rotina", descricao: "Baixa", detalhes: "Prioridade baixa para ações de rotina" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrioridade = async () => {
    if (!novaPrioridade.grau || !novaPrioridade.tipo_gestao || !novaPrioridade.descricao || !novaPrioridade.detalhes) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos: grau, tipo de gestão, descrição e detalhes",
      });
      return;
    }

    if (prioridades.some(p => p.grau === novaPrioridade.grau)) {
      toast({
        variant: "destructive",
        title: "Grau já existe",
        description: `Já existe uma prioridade com o grau ${novaPrioridade.grau}`,
      });
      return;
    }

    try {
      setLoadingAdd(true);
      
      const novaPrioridadeCreated = await prioridadesService.create({
        grau: novaPrioridade.grau,
        tipo_gestao: novaPrioridade.tipo_gestao,
        descricao: novaPrioridade.descricao,
        detalhes: novaPrioridade.detalhes
      });
      
      setPrioridades([...prioridades, novaPrioridadeCreated]);
      setNovaPrioridade({ grau: 0, tipo_gestao: "", descricao: "", detalhes: "" });
      
      toast({
        variant: "success",
        title: "Prioridade adicionada!",
        description: `"${novaPrioridade.descricao}" foi adicionada com sucesso`,
      });
      
    } catch (err) {
      console.error('Erro ao adicionar prioridade:', err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar a prioridade. Tente novamente.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  // Função para abrir o modal de confirmação
  const handleShowDeleteModal = (prioridade: PrioridadeAcao) => {
    setPrioridadeToDelete(prioridade);
    setShowDeleteModal(true);
  };

  // Função para fechar o modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPrioridadeToDelete(null);
  };

  // Função para confirmar a remoção
  const handleConfirmDelete = async () => {
    if (!prioridadeToDelete) return;
    
    try {
      setLoadingRemove(true);
      
      await prioridadesService.delete(prioridadeToDelete.prioridade_id);
      setPrioridades(prioridades.filter(p => p.prioridade_id !== prioridadeToDelete.prioridade_id));
      
      toast({
        variant: "success",
        title: "Prioridade removida",
        description: `"${prioridadeToDelete.descricao}" foi removida com sucesso`,
      });
      
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Erro ao remover prioridade:', err);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover a prioridade. Tente novamente.",
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  // Filtragem de prioridades com base no termo de busca
  const filteredPrioridades = prioridades.filter(prioridade => 
    prioridade.grau.toString().includes(searchTerm) ||
    prioridade.tipo_gestao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prioridade.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prioridade.detalhes!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-lg text-gray-600">Carregando prioridades...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com indicador de erro */}
      <div className="flex justify-between items-center pt-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gerenciar Prioridades de Ação</h2>
          <p className="text-sm text-gray-500 mt-1">
            As prioridades definem a importância das ações no sistema.
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredPrioridades.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Prioridade
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="grau" className="block text-sm font-medium text-gray-700 mb-1">
              Grau da Prioridade
            </label>
            <Input
              id="grau"
              type="number"
              placeholder="Ex: 5"
              value={novaPrioridade.grau || ""}
              onChange={e => setNovaPrioridade({ ...novaPrioridade, grau: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
          
          <div>
            <label htmlFor="tipo_gestao" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Gestão
            </label>
            <Input
              id="tipo_gestao"
              placeholder="Ex: Estratégico"
              value={novaPrioridade.tipo_gestao}
              onChange={e => setNovaPrioridade({ ...novaPrioridade, tipo_gestao: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Muito Baixa"
              value={novaPrioridade.descricao}
              onChange={e => setNovaPrioridade({ ...novaPrioridade, descricao: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
          
          <div>
            <label htmlFor="detalhes" className="block text-sm font-medium text-gray-700 mb-1">
              Detalhes
            </label>
            <Input
              id="detalhes"
              placeholder="Ex: Para ações de baixíssima prioridade"
              value={novaPrioridade.detalhes}
              onChange={e => setNovaPrioridade({ ...novaPrioridade, detalhes: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddPrioridade} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
            disabled={loadingAdd}
          >
            {loadingAdd ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Prioridade
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Lista de Prioridades */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Prioridades Cadastradas</h3>
          
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
                  <TableHead className="w-20">Grau</TableHead>
                  <TableHead className="w-32">Tipo de Gestão</TableHead>
                  <TableHead className="w-32">Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrioridades
                  .sort((a, b) => a.grau - b.grau)
                  .map(prioridade => (
                    <TableRow key={prioridade.prioridade_id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-purple-50 border-purple-200 text-purple-800 font-semibold">
                          {prioridade.grau}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {prioridade.tipo_gestao}
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {prioridade.descricao}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {prioridade.detalhes}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleShowDeleteModal(prioridade)}
                          className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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

      {/* Modal de Confirmação de Remoção */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Confirmar Remoção"
        className="max-w-md"
      >
        <div className="space-y-4">
          {/* Ícone de alerta */}
          <div className="flex items-center justify-center">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Descrição */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta ação não pode ser desfeita. A prioridade será removida permanentemente do sistema.
            </p>
          </div>
          
          {/* Preview do item a ser removido */}
          {prioridadeToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono bg-purple-50 border-purple-200 text-purple-800 font-semibold">
                  {prioridadeToDelete.grau}
                </Badge>
                <div>
                  <p className="font-medium text-gray-900">{prioridadeToDelete.descricao}</p>
                  <p className="text-sm text-gray-500">{prioridadeToDelete.tipo_gestao} • {prioridadeToDelete.detalhes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Tem certeza que deseja remover esta prioridade?
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={loadingRemove}
              className="min-w-[100px]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loadingRemove}
              className="bg-[#ae0f0a] hover:bg-[#910c08] min-w-[100px]"
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