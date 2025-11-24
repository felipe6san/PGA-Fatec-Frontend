import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { 
  EixoTematico, 
  PrioridadeAcao, 
  Tema, 
  User,
  SolicitacaoAcesso,
  TipoUsuario
} from '@/types/api';
import { TipoVinculoHAE } from "@/features/projects/components/projectFormTypes";

// Tipo para criação de usuário
interface CreateUserData {
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
  unidade_id?: number;
}

// EixoTematico Service
export const eixoTematicoService = {
  async getAll(): Promise<EixoTematico[]> {
    try {
      const response = await api.get(API_ENDPOINTS.THEMATIC_AXIS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eixos temáticos:', error);
      throw error;
    }
  },
  
  // Outros métodos como getById, create, update, delete...
};

// PrioridadeAcao Service
class PrioridadeAcaoService {
  async getAll(): Promise<PrioridadeAcao[]> {
    try {
      const response = await api.get<PrioridadeAcao[]>(API_ENDPOINTS.PRIORITY_ACTIONS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prioridades de ação:', error);
      throw error;
    }
  }
}

// Tema Service
class TemaService {
  async getAll(): Promise<Tema[]> {
    try {
      const response = await api.get<Tema[]>(API_ENDPOINTS.THEMES);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw error;
    }
  }
}

// User Service
class UserService {
  async getAll(): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`${API_ENDPOINTS.USERS}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      throw error;
    }
  }

async getByUnidade(unidadeId: number): Promise<User[]> {
  try {
    const response = await api.get<User[]>(`/users/by-unidade/${unidadeId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários por unidade:', error);
    return [];
  }
}

  async create(data: CreateUserData): Promise<User> {
    try {
      const response = await api.post<User>(`${API_ENDPOINTS.USERS}`, data);
      // backend may return { user, email_sent } or directly the created user
      if (response.data && (response.data as any).user) return (response.data as any).user;
      return response.data as any;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<CreateUserData>): Promise<User> {
    try {
      const response = await api.put<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}

// AccessRequest Service
class AccessRequestService {
  async getAll(): Promise<{ pendingRequests: SolicitacaoAcesso[], processedRequests: SolicitacaoAcesso[] }> {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS}/access-requests`);
      
      // Verificação detalhada do formato da resposta
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Formato de resposta inválido da API');
      }
      
      // Garantir que temos os dois arrays necessários
      const result = {
        pendingRequests: Array.isArray(response.data.pendingRequests) ? response.data.pendingRequests : [],
        processedRequests: Array.isArray(response.data.processedRequests) ? response.data.processedRequests : []
      };
      
      return result;
    } catch (error: any) {
      console.error('Erro ao buscar solicitações de acesso:', error);
      
      // Permite que o erro se propague para ser tratado pelo componente
      throw new Error(`Falha na conexão com servidor: ${error.message}`);
    }
  }

  async processRequest(
    requestId: number,
    status: 'Aprovada' | 'Rejeitada',
    tipo_usuario?: string,
    unidade_id?: number
  ): Promise<SolicitacaoAcesso> {
    const response = await api.post(`${API_ENDPOINTS.USERS}/process-access-request/${requestId}`, {
      status,
      tipo_usuario,
      unidade_id
    });
    
    return response.data;
  }
}

// WorkloadHae Service
class WorkloadHaeService {
  async getAll(): Promise<TipoVinculoHAE[]> {
    try {
      const response = await api.get<TipoVinculoHAE[]>(API_ENDPOINTS.WORKLOAD_HAE);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de vínculo HAE:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<TipoVinculoHAE> {
    try {
      const response = await api.get<TipoVinculoHAE>(`${API_ENDPOINTS.WORKLOAD_HAE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de vínculo HAE ID ${id}:`, error);
      throw error;
    }
  }
}

// Exportar instâncias dos serviços
export const prioridadeAcaoService = new PrioridadeAcaoService();
export const temaService = new TemaService();
export const userService = new UserService();
export const accessRequestService = new AccessRequestService();
export const workloadHaeService = new WorkloadHaeService();

// Exportar tipos para uso em outros arquivos
export type { CreateUserData };

// Serviço para entregáveis (linkSei)
export const entregaveisService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.DELIVERABLES);
    return response.data;
  },
  
  async getById(id: number) {
    const response = await api.get(`${API_ENDPOINTS.DELIVERABLES}/${id}`);
    return response.data;
  }
};