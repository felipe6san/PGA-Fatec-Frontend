import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { EixoTematico } from '@/types/api';

export interface CreateEixoDto {
  numero: number;
  nome: string;
}

export interface UpdateEixoDto {
  numero?: number;
  nome?: string;
}

class EixosService {
  async getAll(): Promise<EixoTematico[]> {
    try {
      const response = await api.get<EixoTematico[]>(API_ENDPOINTS.THEMATIC_AXIS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eixos temáticos:', error);
      throw new Error('Falha ao carregar eixos temáticos');
    }
  }

  async getById(id: number): Promise<EixoTematico> {
    try {
      const response = await api.get<EixoTematico>(`${API_ENDPOINTS.THEMATIC_AXIS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eixo temático:', error);
      throw new Error('Falha ao carregar eixo temático');
    }
  }

  async create(data: CreateEixoDto): Promise<EixoTematico> {
    try {
      const response = await api.post<EixoTematico>(API_ENDPOINTS.THEMATIC_AXIS, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar eixo temático:', error);
      throw new Error('Falha ao criar eixo temático');
    }
  }

  async update(id: number, data: UpdateEixoDto): Promise<EixoTematico> {
    try {
      const response = await api.put<EixoTematico>(`${API_ENDPOINTS.THEMATIC_AXIS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar eixo temático:', error);
      throw new Error('Falha ao atualizar eixo temático');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.THEMATIC_AXIS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar eixo temático:', error);
      throw new Error('Falha ao deletar eixo temático');
    }
  }
}

export const eixosService = new EixosService();