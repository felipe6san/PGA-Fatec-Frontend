import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { Attachment, CreateAttachmentDto, UpdateAttachmentDto, AnexoProjetoUm } from '@/types/api';

class AnexoService {
  async getAll(): Promise<Attachment[]> {
    try {
      const response = await api.get<Attachment[]>(API_ENDPOINTS.ATTACHMENTS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      throw new Error('Falha ao carregar anexos');
    }
  }

  async getById(id: number): Promise<Attachment> {
    try {
      const response = await api.get<Attachment>(`${API_ENDPOINTS.ATTACHMENTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexo:', error);
      throw new Error('Falha ao carregar anexo');
    }
  }

  async create(data: CreateAttachmentDto): Promise<Attachment> {
    try {
      const response = await api.post<Attachment>(API_ENDPOINTS.ATTACHMENTS, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anexo:', error);
      throw new Error('Falha ao criar anexo');
    }
  }

  async update(id: number, data: UpdateAttachmentDto): Promise<Attachment> {
    try {
      const response = await api.put<Attachment>(`${API_ENDPOINTS.ATTACHMENTS}/${id}`, data);
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