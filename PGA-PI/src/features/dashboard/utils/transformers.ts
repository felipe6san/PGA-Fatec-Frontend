import { AcaoProjeto } from '@/types/api';

export interface EmployeeData {
  id: string;
  name: string;
  hoursAllocated: number;
  projectsCount: number;
  department: string;
}

export interface ProjectCardData {
  id: string;
  name: string;
  progress: number;
  responsible: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'delayed';
}

export interface DeadlineData {
  id: string;
  title: string;
  date: string;
  type: 'milestone' | 'deadline' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  project?: string;
}

function calcProgress(dataInicio?: Date, dataFinal?: Date): number {
  if (!dataInicio || !dataFinal) return 0;
  const now = new Date();
  const start = new Date(dataInicio);
  const end = new Date(dataFinal);
  if (now < start) return 0;
  if (now > end) return 100;
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.round((elapsed / total) * 100);
}

function calcStatus(dataFinal?: Date, progress?: number): 'on-track' | 'at-risk' | 'delayed' {
  if (!dataFinal) return 'on-track';
  const now = new Date();
  const end = new Date(dataFinal);
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0 && (progress ?? 0) < 100) return 'delayed';
  if (diffDays >= 0 && diffDays <= 30) return 'at-risk';
  return 'on-track';
}

function derivePriority(dateStr: string): 'high' | 'medium' | 'low' {
  const diffDays = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 7) return 'high';
  if (diffDays <= 30) return 'medium';
  return 'low';
}

function projectDisplayName(proj: AcaoProjeto): string {
  return proj.tema?.descricao ?? proj.nome_projeto ?? 'Sem tema';
}

export function buildEmployees(projetos: AcaoProjeto[]): EmployeeData[] {
  const map = new Map<number, { name: string; hours: number; projects: Set<number>; department: string }>();

  for (const proj of projetos) {
    for (const pp of proj.pessoas ?? []) {
      const pessoaId = pp.pessoa?.pessoa_id;
      if (!pessoaId) continue;
      if (!map.has(pessoaId)) {
        map.set(pessoaId, {
          name: pp.pessoa.nome,
          hours: 0,
          projects: new Set(),
          department: pp.papel === 'Responsavel' ? 'Responsável' : 'Colaborador',
        });
      }
      const entry = map.get(pessoaId)!;
      entry.hours += pp.carga_horaria_semanal ?? 0;
      entry.projects.add(proj.acao_projeto_id);
    }
  }

  return Array.from(map.entries()).map(([id, data]) => ({
    id: String(id),
    name: data.name,
    hoursAllocated: data.hours,
    projectsCount: data.projects.size,
    department: data.department,
  }));
}

export function buildProjectCards(projetos: AcaoProjeto[]): ProjectCardData[] {
  return projetos.map((proj) => {
    const progress = calcProgress(proj.data_inicio, proj.data_final);
    const status = calcStatus(proj.data_final, progress);

    const responsavel = (proj.pessoas ?? []).find((p) => p.papel === 'Responsavel')
      ?? proj.pessoas?.[0];

    const deadlineFormatted = proj.data_final
      ? new Date(proj.data_final).toLocaleDateString('pt-BR')
      : 'Não definido';

    return {
      id: String(proj.acao_projeto_id),
      name: projectDisplayName(proj),
      progress,
      responsible: responsavel?.pessoa?.nome ?? '—',
      deadline: deadlineFormatted,
      status,
    };
  });
}

export function buildDeadlines(projetos: AcaoProjeto[]): DeadlineData[] {
  const cutoffPast = new Date();
  cutoffPast.setDate(cutoffPast.getDate() - 7);

  const items: DeadlineData[] = [];

  for (const proj of projetos) {
    // Etapas com data prevista
    for (const etapa of proj.etapas ?? []) {
      if (!etapa.data_verificacao_prevista) continue;
      const d = new Date(etapa.data_verificacao_prevista);
      if (d < cutoffPast) continue;
      items.push({
        id: `etapa-${etapa.etapa_id}`,
        title: etapa.descricao,
        date: etapa.data_verificacao_prevista,
        type: 'milestone',
        priority: derivePriority(etapa.data_verificacao_prevista),
        project: projectDisplayName(proj),
      });
    }

    // Data final do projeto
    if (proj.data_final) {
      const d = new Date(proj.data_final);
      if (d >= cutoffPast) {
        const dateStr = d.toISOString().split('T')[0];
        const label = projectDisplayName(proj);
        items.push({
          id: `proj-deadline-${proj.acao_projeto_id}`,
          title: `Prazo final: ${label}`,
          date: dateStr,
          type: 'deadline',
          priority: derivePriority(dateStr),
          project: label,
        });
      }
    }
  }

  items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return items;
}
