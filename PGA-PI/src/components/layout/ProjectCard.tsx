import { User, Calendar } from 'lucide-react';

interface ProjectCardProps {
  number: string;
  title: string;
  description: string;
  responsible: string;
  period: string;
  tags: string[];
}

export const ProjectCard = ({ number, title, description, responsible, period, tags }: ProjectCardProps) => {
  return (
    <div className="project-card space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{number} - {title}</h3>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <div className="flex gap-1">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{responsible}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{period}</span>
        </div>
      </div>
    </div>
  );
};