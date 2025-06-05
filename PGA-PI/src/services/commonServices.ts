import api from '@/lib/api';
import { 
  EixoTematico, 
  PrioridadeAcao, 
  Tema, 
  User
} from '@/types/api';

export class EixoTematicoService {
  private baseUrl = '/thematic-axis';

  async getAll(): Promise<EixoTematico[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eixos temáticos:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<EixoTematico> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar eixo temático ${id}:`, error);
      throw error;
    }
  }
}

export class PrioridadeAcaoService {
  private baseUrl = '/priority-action';

  async getAll(): Promise<PrioridadeAcao[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prioridades de ação:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<PrioridadeAcao> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prioridade de ação ${id}:`, error);
      throw error;
    }
  }
}

export class TemaService {
  private baseUrl = '/themes';

  async getAll(): Promise<Tema[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar temas:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Tema> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tema ${id}:`, error);
      throw error;
    }
  }
}

export class UserService {
  private baseUrl = '/users';

  async getAll(): Promise<User[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  }
}

export const eixoTematicoService = new EixoTematicoService();
export const prioridadeAcaoService = new PrioridadeAcaoService();
export const temaService = new TemaService();
export const userService = new UserService(); 