import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { EntregavelLinkSei } from '@/types/api';

export interface CreateEntregavelDto {
  entregavel_numero: string;
  descricao: string;
  detalhes?: string;
}

export interface UpdateEntregavelDto {
  entregavel_numero?: string;
  descricao?: string;
  detalhes?: string;
}

class EntregaveisService {
  async getAll(): Promise<EntregavelLinkSei[]> {
    try {
      const response = await api.get<EntregavelLinkSei[]>(`${API_ENDPOINTS.DELIVERABLES}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entregáveis:', error);
      throw new Error('Falha ao carregar entregáveis');
    }
  }

  async getById(id: number): Promise<EntregavelLinkSei> {
    try {
      const response = await api.get<EntregavelLinkSei>(`${API_ENDPOINTS.DELIVERABLES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entregável:', error);
      throw new Error('Falha ao carregar entregável');
    }
  }

  async create(data: CreateEntregavelDto): Promise<EntregavelLinkSei> {
    try {
      const response = await api.post<EntregavelLinkSei>(`${API_ENDPOINTS.DELIVERABLES}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar entregável:', error);
      throw new Error('Falha ao criar entregável');
    }
  }

  async update(id: number, data: UpdateEntregavelDto): Promise<EntregavelLinkSei> {
    try {
      const response = await api.put<EntregavelLinkSei>(`${API_ENDPOINTS.DELIVERABLES}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar entregável:', error);
      throw new Error('Falha ao atualizar entregável');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.DELIVERABLES}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar entregável:', error);
      throw new Error('Falha ao deletar entregável');
    }
  }
}

export const entregaveisService = new EntregaveisService();