import api from '@/lib/api';
import { SituacaoProblema } from '@/types/api';

export interface CreateSituacaoProblemaRequest {
  codigo_categoria: string;
  descricao: string;
  fonte?: string;
  ordem?: number;
}

export interface UpdateSituacaoProblemaRequest {
  codigo_categoria?: string;
  descricao?: string;
  fonte?: string;
  ordem?: number;
  ativo?: boolean;
}

class SituacoesService {
  // CORRIGIDO: endpoint correto
  private readonly endpoint = '/problem-situation';

  async getAll(): Promise<SituacaoProblema[]> {
    try {
      const response = await api.get<SituacaoProblema[]>(this.endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar situações problema:', error);
      throw new Error('Falha ao carregar situações problema');
    }
  }

  async getById(id: number): Promise<SituacaoProblema> {
    try {
      const response = await api.get<SituacaoProblema>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar situação problema:', error);
      throw new Error('Falha ao carregar situação problema');
    }
  }

  async create(data: CreateSituacaoProblemaRequest): Promise<SituacaoProblema> {
    try {
      const response = await api.post<SituacaoProblema>(this.endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar situação problema:', error);
      throw new Error('Falha ao criar situação problema');
    }
  }

  async update(id: number, data: UpdateSituacaoProblemaRequest): Promise<SituacaoProblema> {
    try {
      const response = await api.put<SituacaoProblema>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar situação problema:', error);
      throw new Error('Falha ao atualizar situação problema');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar situação problema:', error);
      throw new Error('Falha ao deletar situação problema');
    }
  }
}

export const situacoesService = new SituacoesService();