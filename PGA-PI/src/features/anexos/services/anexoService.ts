import api from '@/lib/api';
import { 
  Attachment1, 
  CreateAttachment1Dto, 
  UpdateAttachment1Dto 
} from '@/types/api';

export class AnexoService {
  private baseUrl = '/attachment1';

  async getAll(): Promise<Attachment1[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Attachment1> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anexo ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateAttachment1Dto): Promise<Attachment1> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anexo:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateAttachment1Dto): Promise<Attachment1> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anexo ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar anexo ${id}:`, error);
      throw error;
    }
  }
}

export const anexoService = new AnexoService(); 