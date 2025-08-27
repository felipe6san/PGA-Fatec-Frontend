import { ReactNode } from "react";
import { XCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content - com arredondamento completo */}
      <div
        className={`relative z-50 w-full rounded-[21px] shadow-lg overflow-hidden mobile-modal ${
          className || ""
        }`}
        style={{ backgroundColor: "white" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 mobile-modal-header">
          <h2 className="font-['Source_Sans_3',Helvetica] text-2xl font-bold text-[#2D3748]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Container do conteúdo arredondado na parte inferior */}
        <div
          className="p-6 rounded-b-[21px] mobile-modal-content"
          style={{ backgroundColor: "white" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
