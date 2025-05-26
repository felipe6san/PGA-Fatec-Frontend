import { ReactNode } from "react";

interface ConfigSectionProps {
  title: string;
  children: ReactNode;
}

export const ConfigSection = ({ title, children }: ConfigSectionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
};