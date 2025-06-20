import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, AlertCircle, UserPlus, UserRound, InboxIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PendingAccessRequestsTab } from "./PendingAccessRequests";
import { TipoUsuario, User } from "@/types/api";
import { accessRequestService, userService, type CreateUserData } from "@/services/commonServices";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export const PessoasConfig: React.FC = () => {
  const { user } = useAuth();
  console.log("Usuario logado:", user); // Debug
  
  const [pessoas, setPessoas] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [novaPessoa, setNovaPessoa] = useState<CreateUserData>({ 
    nome: "", 
    email: "", 
    tipo_usuario: TipoUsuario.DOCENTE,
    unidade_id: undefined
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccessRequests, setShowAccessRequests] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // O ID mockado (1) está bom para testes, mantenha essa abordagem
  const unidadeId = 1; // ID mockado para testes - futuramente virá da URL

  // Carregar pessoas do banco
  const loadPessoas = useCallback(async () => {
    if (!user) return;
    
    console.log("Carregando pessoas..."); // Debug
    setLoading(true);
    try {
      let pessoasData: User[] = [];
      
      // Verificar se o usuário é admin/CPS
      const userTipo = (user as any)?.tipo_usuario || (user as any)?.tipoUsuario;
      
      // Se for administrador, pode ver todas as pessoas
      if (userTipo === TipoUsuario.ADMINISTRADOR || userTipo === TipoUsuario.CPS) {
        console.log("Carregando todas as pessoas (admin/cps)"); // Debug
        pessoasData = await userService.getAll();
      } else {
        // Usar o ID da unidade mockado em vez de tentar pegar do usuário
        console.log("Carregando pessoas da unidade:", unidadeId); // Debug
        pessoasData = await userService.getByUnidade(unidadeId);
      }
      
      console.log("Pessoas carregadas:", pessoasData); // Debug
      setPessoas(pessoasData);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de pessoas"
      });
      
      setPessoas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para carregar solicitações de acesso
  const loadAccessRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const data = await accessRequestService.getAll();
      console.log("Dados de solicitações:", data); // Debug
      
      // Conte apenas as solicitações pendentes
      const pendingCount = data.pendingRequests?.length || 0;
      console.log("Contagem de pendentes:", pendingCount); // Debug
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      // Em caso de erro, não mostrar o toast para não incomodar
      setPendingRequestsCount(0);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // Carregar dados quando user estiver disponível - APENAS UMA VEZ
  useEffect(() => {
    if (user) {
      console.log("useEffect: Usuário disponível, carregando dados"); // Debug
      loadPessoas();
      loadAccessRequests();
    }
  }, [user && (user as any)?.pessoa_id]); // Só re-executa se o ID do usuário mudar

  const handleAddPessoa = async () => {
    if (!novaPessoa.nome || !novaPessoa.email) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e o email"
      });
      return;
    }

    if (!novaPessoa.email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um email válido"
      });
      return;
    }

    setLoading(true);
    try {
      const dadosPessoa = {
        ...novaPessoa,
        unidade_id: novaPessoa.unidade_id || unidadeId // Usar o ID mockado
      };

      const novaPessoaCriada = await userService.create(dadosPessoa);
      
      setPessoas(prev => [...prev, novaPessoaCriada]);
      
      setNovaPessoa({ 
        nome: "", 
        email: "", 
        tipo_usuario: TipoUsuario.DOCENTE,
        unidade_id: undefined
      });

      toast({
        title: "Sucesso",
        description: `Pessoa ${novaPessoaCriada.nome} cadastrada com sucesso`
      });

    } catch (error: any) {
      console.error('Erro ao criar pessoa:', error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error?.response?.data?.message || "Não foi possível cadastrar a pessoa"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePessoa = async (pessoaId: number) => {
    if (!confirm('Tem certeza que deseja remover esta pessoa?')) {
      return;
    }

    setLoading(true);
    try {
      await userService.delete(pessoaId);
      setPessoas(prev => prev.filter(p => p.pessoa_id !== pessoaId));
      
      toast({
        title: "Sucesso",
        description: "Pessoa removida com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao remover pessoa:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: error?.response?.data?.message || "Não foi possível remover a pessoa"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para obter nome da unidade
  const getUnidadeNome = (pessoa: User) => {
    if (!pessoa.unidades || pessoa.unidades.length === 0) {
      return 'Unidade não definida';
    }
    
    // A estrutura correta tem unidade aninhado como vimos no backend
    if (pessoa.unidades[0].unidade && pessoa.unidades[0].unidade.nome_completo) {
      return pessoa.unidades[0].unidade.nome_completo;
    }
    
    return 'Nome não disponível';
  };

  // Lista de tipos de usuário conforme a hierarquia atual do sistema
  const tiposUsuario = [
    { value: TipoUsuario.ADMINISTRADOR, label: "Administrador" },
    { value: TipoUsuario.CPS, label: "CPS" },
    { value: TipoUsuario.REGIONAL, label: "Regional" },
    { value: TipoUsuario.DIRETOR, label: "Diretor" },
    { value: TipoUsuario.COORDENADOR, label: "Coordenador" },
    { value: TipoUsuario.ADMINISTRATIVO, label: "Administrativo" },
    { value: TipoUsuario.DOCENTE, label: "Docente" },
  ];
  
  // Filtrar tipos de usuário baseado nas permissões
  const getTiposUsuarioPermitidos = () => {
    const userTipo = (user as any)?.tipo_usuario || (user as any)?.tipoUsuario;
    
    if (userTipo === TipoUsuario.ADMINISTRADOR || userTipo === TipoUsuario.CPS) {
      return tiposUsuario; // Admin pode criar qualquer tipo
    } else if (userTipo === TipoUsuario.DIRETOR) {
      // Diretor pode criar coordenador, administrativo e docente
      return tiposUsuario.filter(tipo => 
        [TipoUsuario.COORDENADOR, TipoUsuario.ADMINISTRATIVO, TipoUsuario.DOCENTE].includes(tipo.value as TipoUsuario)
      );
    } else {
      // Outros podem criar apenas docente e administrativo
      return tiposUsuario.filter(tipo => 
        [TipoUsuario.ADMINISTRATIVO, TipoUsuario.DOCENTE].includes(tipo.value as TipoUsuario)
      );
    }
  };
  
  const filteredPessoas = pessoas.filter(pessoa => 
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pessoa.email && pessoa.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pessoa.tipo_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadgeColor = (tipo: TipoUsuario) => {
    switch(tipo) {
      case TipoUsuario.ADMINISTRADOR: return "bg-red-100 text-red-800 border-red-300";
      case TipoUsuario.CPS: return "bg-red-100 text-red-800 border-red-300";
      case TipoUsuario.REGIONAL: return "bg-orange-100 text-orange-800 border-orange-300";
      case TipoUsuario.DIRETOR: return "bg-green-100 text-green-800 border-green-300";
      case TipoUsuario.COORDENADOR: return "bg-teal-100 text-teal-800 border-teal-300";
      case TipoUsuario.ADMINISTRATIVO: return "bg-purple-100 text-purple-800 border-purple-300";
      case TipoUsuario.DOCENTE: return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const toggleAccessRequests = () => {
    setShowAccessRequests(!showAccessRequests);
  };

  // Verificar se usuário pode gerenciar pessoas
  const userTipo = (user as any)?.tipo_usuario || (user as any)?.tipoUsuario;
  const canManagePessoas = userTipo && [
    TipoUsuario.ADMINISTRADOR, 
    TipoUsuario.CPS, 
    TipoUsuario.DIRETOR, 
    TipoUsuario.COORDENADOR
  ].includes(userTipo);

  console.log("canManagePessoas:", canManagePessoas); // Debug
  console.log("userTipo:", userTipo); // Debug

  // Verificar se pode ver solicitações de acesso (incluindo diretores)
  const canViewAccessRequests = userTipo && [
    TipoUsuario.ADMINISTRADOR, 
    TipoUsuario.CPS,
    TipoUsuario.DIRETOR  // Adicionando diretor à lista
  ].includes(userTipo);

  console.log("canViewAccessRequests:", canViewAccessRequests); // Debug

  // Se não tem usuário ainda
  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a] mr-3"></div>
        <span className="text-gray-500">Carregando dados do usuário...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <UserRound className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Pessoas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userTipo === TipoUsuario.ADMINISTRADOR || userTipo === TipoUsuario.CPS
              ? "Cadastre pessoas para atribuição em projetos e ações (todas as unidades)"
              : "Cadastre pessoas para atribuição em projetos e ações (sua unidade)"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredPessoas.length} registros</span>
          
          {/* Botão de solicitações de acesso - apenas para admin e CPS */}
          {canViewAccessRequests && (
            <Button 
              variant="outline" 
              onClick={toggleAccessRequests}
              className="flex items-center text-[#ae0f0a] border-[#ae0f0a]/20 hover:bg-[#ae0f0a]/10 relative"
              disabled={loadingRequests}
            >
              <InboxIcon className="h-4 w-4 mr-2" />
              Solicitações de Acesso
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                  {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Card que alterna entre Adicionar Pessoas e Solicitações de Acesso */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        {!showAccessRequests ? (
          <>
            <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
              Adicionar Nova Pessoa
            </h3>
            
            {canManagePessoas ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <Input
                      id="nome"
                      placeholder="Ex: João Silva"
                      value={novaPessoa.nome}
                      onChange={e => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
                      className="w-full bg-white border-gray-300"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Ex: joao@fatec.sp.gov.br"
                      value={novaPessoa.email}
                      onChange={e => setNovaPessoa({ ...novaPessoa, email: e.target.value })}
                      className="w-full bg-white border-gray-300"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <Select
                      value={novaPessoa.tipo_usuario}
                      onValueChange={(value) => setNovaPessoa({ ...novaPessoa, tipo_usuario: value as TipoUsuario })}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getTiposUsuarioPermitidos().map(tipo => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddPessoa} 
                    className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-1" /> 
                    {loading ? 'Adicionando...' : 'Adicionar Pessoa'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Você não tem permissão para cadastrar pessoas.</p>
                <p className="text-sm mt-1">Entre em contato com o administrador do sistema.</p>
                <p className="text-xs mt-2 text-gray-400">Tipo de usuário atual: {userTipo}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#ae0f0a]" />
                {userTipo === TipoUsuario.DIRETOR 
                  ? "Solicitações de Acesso da sua Unidade" 
                  : "Solicitações de Acesso Pendentes"}
              </h3>
              <Button 
                variant="outline" 
                onClick={toggleAccessRequests}
                size="sm"
              >
                Voltar para Pessoas
              </Button>
            </div>
            <PendingAccessRequestsTab onRequestProcessed={loadAccessRequests} />
          </>
        )}
      </Card>
      
      {/* Lista de Pessoas - só mostra quando não estiver na aba de solicitações */}
      {!showAccessRequests && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-gray-700">
              Pessoas Cadastradas
              {userTipo !== TipoUsuario.ADMINISTRADOR && userTipo !== TipoUsuario.CPS && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (da sua unidade)
                </span>
              )}
            </h3>
            
            <div className="relative w-64">
              <Input
                placeholder="Pesquisar pessoas..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-white"
                disabled={loading}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="border rounded-md shadow-sm bg-white overflow-hidden">
            {loading ? (
              <div className="py-8 text-center">
                <div className="flex justify-center mb-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a]"></div>
                </div>
                <p className="text-gray-500">Carregando pessoas...</p>
              </div>
            ) : filteredPessoas.length > 0 ? (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    {(userTipo === TipoUsuario.ADMINISTRADOR || userTipo === TipoUsuario.CPS) && (
                      <TableHead>Unidade</TableHead>
                    )}
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    {canManagePessoas && <TableHead className="w-24 text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPessoas
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map(pessoa => (
                      <TableRow key={pessoa.pessoa_id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-700">
                          {pessoa.nome}
                        </TableCell>
                        <TableCell>{pessoa.email || '-'}</TableCell>
                        {(userTipo === TipoUsuario.ADMINISTRADOR || userTipo === TipoUsuario.CPS) && (
                          <TableCell className="text-sm text-gray-600">
                            <div className="group relative">
                              {getUnidadeNome(pessoa)}
                              
                              {pessoa.unidades && pessoa.unidades.length > 1 && (
                                <div className="absolute hidden group-hover:block z-10 bg-white border shadow-md rounded p-2 w-60">
                                  <p className="font-medium mb-1 text-xs text-gray-500">
                                    Todas as unidades:
                                  </p>
                                  <ul className="text-xs">
                                    {pessoa.unidades.map((u) => (
                                      <li
                                        key={u.unidade_id}
                                        className="py-1 border-b last:border-0"
                                      >
                                        {u.unidade && u.unidade.nome_completo ? u.unidade.nome_completo : "Nome não disponível"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant="outline" className={`${getTypeBadgeColor(pessoa.tipo_usuario)} font-semibold`}>
                            {tiposUsuario.find(t => t.value === pessoa.tipo_usuario)?.label || pessoa.tipo_usuario}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pessoa.ativo ? "default" : "secondary"}>
                            {pessoa.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        {canManagePessoas && (
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemovePessoa(pessoa.pessoa_id)}
                              className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20"
                              disabled={loading}
                            >
                              Remover
                            </Button>
                          </TableCell>
                        )}
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
                  {searchTerm ? "Nenhuma pessoa encontrada com estes critérios." : "Não há pessoas cadastradas ainda."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};