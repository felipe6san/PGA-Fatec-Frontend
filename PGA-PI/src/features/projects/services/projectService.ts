import api from '@/lib/api';
import { 
  AcaoProjeto, 
  CreateProject1Dto, 
  UpdateProject1Dto 
} from '@/types/api';

export class ProjectService {
  private baseUrl = '/project1';

  async getAll(): Promise<AcaoProjeto[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<AcaoProjeto> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar projeto ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateProject1Dto): Promise<AcaoProjeto> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProject1Dto): Promise<AcaoProjeto> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar projeto ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar projeto ${id}:`, error);
      throw error;
    }
  }
}

export const projectService = new ProjectService(); 