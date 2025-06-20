import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { 
  AcaoProjeto, 
  CreateProject1Dto, 
  UpdateProject1Dto 
} from '@/types/api';

export class ProjectService {
  private baseUrl = '/project1';

  async getAll(): Promise<AcaoProjeto[]> {
    try {
      const response = await api.get<AcaoProjeto[]>(API_ENDPOINTS.PROJECTS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw new Error('Falha ao carregar projetos');
    }
  }

  async getById(id: number): Promise<AcaoProjeto> {
    try {
      const response = await api.get<AcaoProjeto>(`${API_ENDPOINTS.PROJECTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      throw new Error('Falha ao carregar projeto');
    }
  }

  async create(data: CreateProject1Dto): Promise<AcaoProjeto> {
    try {
      const response = await api.post<AcaoProjeto>(API_ENDPOINTS.PROJECTS, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw new Error('Falha ao criar projeto');
    }
  }

  async update(id: number, data: UpdateProject1Dto): Promise<AcaoProjeto> {
    try {
      const response = await api.put<AcaoProjeto>(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw new Error('Falha ao atualizar projeto');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw new Error('Falha ao deletar projeto');
    }
  }
}

export const projectService = new ProjectService();