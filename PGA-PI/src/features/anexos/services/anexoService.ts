import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { Attachment1, AnexoProjetoUm } from '@/types/api';

export interface CreateAttachment1Dto {
  item: string;
  flag: AnexoProjetoUm;
  // outros campos conforme necessário
}

export interface UpdateAttachment1Dto {
  item?: string;
  flag?: AnexoProjetoUm;
  // outros campos conforme necessário
}

class AnexoService {
  async getAll(): Promise<Attachment1[]> {
    try {
      const response = await api.get<Attachment1[]>(API_ENDPOINTS.ATTACHMENTS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      throw new Error('Falha ao carregar anexos');
    }
  }

  async getById(id: number): Promise<Attachment1> {
    try {
      const response = await api.get<Attachment1>(`${API_ENDPOINTS.ATTACHMENTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexo:', error);
      throw new Error('Falha ao carregar anexo');
    }
  }

  async create(data: CreateAttachment1Dto): Promise<Attachment1> {
    try {
      const response = await api.post<Attachment1>(API_ENDPOINTS.ATTACHMENTS, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anexo:', error);
      throw new Error('Falha ao criar anexo');
    }
  }

  async update(id: number, data: UpdateAttachment1Dto): Promise<Attachment1> {
    try {
      const response = await api.put<Attachment1>(`${API_ENDPOINTS.ATTACHMENTS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar anexo:', error);
      throw new Error('Falha ao atualizar anexo');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.ATTACHMENTS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar anexo:', error);
      throw new Error('Falha ao deletar anexo');
    }
  }
}

export const anexoService = new AnexoService();