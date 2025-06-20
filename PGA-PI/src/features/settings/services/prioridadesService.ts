import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { PrioridadeAcao } from '@/types/api';

export interface CreatePrioridadeDto {
  grau: number;
  tipo_gestao: string;
  descricao: string;
  detalhes: string;
}

export interface UpdatePrioridadeDto {
  grau?: number;
  tipo_gestao?: string;
  descricao?: string;
  detalhes?: string;
}

class PrioridadesService {
  async getAll(): Promise<PrioridadeAcao[]> {
    try {
      const response = await api.get<PrioridadeAcao[]>(API_ENDPOINTS.PRIORITY_ACTIONS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prioridades de ação:', error);
      throw new Error('Falha ao carregar prioridades de ação');
    }
  }

  async getById(id: number): Promise<PrioridadeAcao> {
    try {
      const response = await api.get<PrioridadeAcao>(`${API_ENDPOINTS.PRIORITY_ACTIONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prioridade de ação:', error);
      throw new Error('Falha ao carregar prioridade de ação');
    }
  }

  async create(data: CreatePrioridadeDto): Promise<PrioridadeAcao> {
    try {
      const response = await api.post<PrioridadeAcao>(API_ENDPOINTS.PRIORITY_ACTIONS, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prioridade de ação:', error);
      throw new Error('Falha ao criar prioridade de ação');
    }
  }

  async update(id: number, data: UpdatePrioridadeDto): Promise<PrioridadeAcao> {
    try {
      const response = await api.put<PrioridadeAcao>(`${API_ENDPOINTS.PRIORITY_ACTIONS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar prioridade de ação:', error);
      throw new Error('Falha ao atualizar prioridade de ação');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.PRIORITY_ACTIONS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar prioridade de ação:', error);
      throw new Error('Falha ao deletar prioridade de ação');
    }
  }
}

export const prioridadesService = new PrioridadesService();