import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { Tema } from '@/types/api';

export interface CreateTemaDto {
  tema_num: number;
  eixo_id: number;
  descricao: string;
}

export interface UpdateTemaDto {
  tema_num?: number;
  eixo_id?: number;
  descricao?: string;
}

class TemasService {
  async getAll(): Promise<Tema[]> {
    try {
      const response = await api.get<Tema[]>(API_ENDPOINTS.THEMES);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw new Error('Falha ao carregar temas');
    }
  }

  async getById(id: number): Promise<Tema> {
    try {
      const response = await api.get<Tema>(`${API_ENDPOINTS.THEMES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tema:', error);
      throw new Error('Falha ao carregar tema');
    }
  }

  async create(data: CreateTemaDto): Promise<Tema> {
    try {
      const response = await api.post<Tema>(API_ENDPOINTS.THEMES, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tema:', error);
      throw new Error('Falha ao criar tema');
    }
  }

  async update(id: number, data: UpdateTemaDto): Promise<Tema> {
    try {
      const response = await api.put<Tema>(`${API_ENDPOINTS.THEMES}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      throw new Error('Falha ao atualizar tema');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.THEMES}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar tema:', error);
      throw new Error('Falha ao deletar tema');
    }
  }
}

export const temasService = new TemasService();