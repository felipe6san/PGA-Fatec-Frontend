import { ReactNode } from "react";
import { XCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  sidePanel?: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  sidePanel,
}: ModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Wrapper relativo para posicionamento do sidePanel fora do overflow */}
      <div
        className={`relative z-50 w-full mx-auto ${className || ""}`}
        style={{ maxWidth: "min(100%,720px)" }}
      >
        {/* Modal Content */}
        <div
          className="w-full md:rounded-[21px] rounded-t-[21px] shadow-lg overflow-hidden mobile-modal bg-white dark:bg-[#1c2130]"
          style={{
            boxSizing: "border-box",
            maxHeight: "calc(100vh - 4rem)",
            overflowY: "auto",
          }}
        >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#30363d] mobile-modal-header">
          <h2 className="font-['Source_Sans_3',Helvetica] text-2xl font-bold text-[#2D3748] dark:text-[#e6edf3]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Container do conteúdo */}
        <div className="p-6 rounded-b-[21px] mobile-modal-content bg-white dark:bg-[#1c2130]">
          {children}
        </div>
        </div>{/* fim modal content */}

        {/* Side panel fora do overflow-hidden */}
        {sidePanel && (
          <div className="absolute top-0 left-full ml-3 hidden md:block">
            {sidePanel}
          </div>
        )}
      </div>{/* fim wrapper */}
    </div>
  );
};
