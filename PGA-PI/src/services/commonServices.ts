import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { 
  EixoTematico, 
  PrioridadeAcao, 
  Tema, 
  User 
} from '@/types/api';

// EixoTematico Service
class EixoTematicoService {
  async getAll(): Promise<EixoTematico[]> {
    try {
      const response = await api.get<EixoTematico[]>(API_ENDPOINTS.THEMATIC_AXIS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eixos temáticos:', error);
      throw error;
    }
  }
}

// PrioridadeAcao Service
class PrioridadeAcaoService {
  async getAll(): Promise<PrioridadeAcao[]> {
    try {
      const response = await api.get<PrioridadeAcao[]>(API_ENDPOINTS.PRIORITY_ACTIONS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prioridades de ação:', error);
      throw error;
    }
  }
}

// Tema Service
class TemaService {
  async getAll(): Promise<Tema[]> {
    try {
      const response = await api.get<Tema[]>(API_ENDPOINTS.THEMES);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw error;
    }
  }
}

// User Service
class UserService {
  async getAll(): Promise<User[]> {
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }
}

// Exportar instâncias dos serviços
export const eixoTematicoService = new EixoTematicoService();
export const prioridadeAcaoService = new PrioridadeAcaoService();
export const temaService = new TemaService();
export const userService = new UserService();