import { ReactNode } from "react";

interface ConfigSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
}

export const ConfigSection = ({ 
  title, 
  children, 
  description,
  className = ""
}: ConfigSectionProps) => {
  return (
    <div className={`mb-6 sm:mb-8 space-y-4 sm:space-y-6 ${className}`}>
      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  );
};