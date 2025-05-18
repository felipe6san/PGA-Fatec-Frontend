import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  show: boolean;
}

export const Tooltip = ({
  children,
  content,
  show,
}: TooltipProps): JSX.Element => {
  return (
    <div className="relative flex items-center group">
      {children}
      {show && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm 
          rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 
          whitespace-nowrap z-50 shadow-lg"
        >
          {content}
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 transform 
            border-4 border-transparent border-r-gray-900"
          />
        </div>
      )}
    </div>
  );
};
