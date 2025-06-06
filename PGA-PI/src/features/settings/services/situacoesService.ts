import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { SituacaoProblema } from '@/types/api';

export interface CreateSituacaoDto {
  pga_id: number;
  descricao: string;
  fonte?: string;
}

export interface UpdateSituacaoDto {
  pga_id?: number;
  descricao?: string;
  fonte?: string;
}

class SituacoesService {
  async getAll(): Promise<SituacaoProblema[]> {
    try {
      const response = await api.get<SituacaoProblema[]>(`${API_ENDPOINTS.SITUATIONS}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar situações problema:', error);
      throw new Error('Falha ao carregar situações problema');
    }
  }

  async getById(id: number): Promise<SituacaoProblema> {
    try {
      const response = await api.get<SituacaoProblema>(`${API_ENDPOINTS.SITUATIONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar situação problema:', error);
      throw new Error('Falha ao carregar situação problema');
    }
  }

  async create(data: CreateSituacaoDto): Promise<SituacaoProblema> {
    try {
      const response = await api.post<SituacaoProblema>(`${API_ENDPOINTS.SITUATIONS}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar situação problema:', error);
      throw new Error('Falha ao criar situação problema');
    }
  }

  async update(id: number, data: UpdateSituacaoDto): Promise<SituacaoProblema> {
    try {
      const response = await api.put<SituacaoProblema>(`${API_ENDPOINTS.SITUATIONS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar situação problema:', error);
      throw new Error('Falha ao atualizar situação problema');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.SITUATIONS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar situação problema:', error);
      throw new Error('Falha ao deletar situação problema');
    }
  }
}

export const situacoesService = new SituacoesService();