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

  async getById(id: string): Promise<AcaoProjeto> {
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

  async update(id: string, data: UpdateProject1Dto): Promise<AcaoProjeto> {
    try {
      const response = await api.put<AcaoProjeto>(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw new Error('Falha ao atualizar projeto');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw new Error('Falha ao deletar projeto');
    }
  }

  async exportPgaPdf(pgaId: string): Promise<void> {
    try {
      const url = `${API_ENDPOINTS.PGA}/${pgaId}/export/pdf`;
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `pga-${pgaId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar PDF do PGA:', error);
      throw new Error('Falha ao exportar PDF');
    }
  }

  async exportPgaCsv(pgaId: string): Promise<void> {
    try {
      const url = `${API_ENDPOINTS.PGA}/${pgaId}/export/csv`;
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `pga-${pgaId}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar CSV do PGA:', error);
      throw new Error('Falha ao exportar CSV');
    }
  }

  async updatePga(id: string, data: any): Promise<any> {
    try {
      const response = await api.put(`${API_ENDPOINTS.PGA}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar PGA:', error);
      throw new Error('Falha ao atualizar PGA');
    }
  }
}

export const projectService = new ProjectService();