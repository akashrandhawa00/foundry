import { useEffect, type ReactNode } from "react";
import { IoIosClose } from "react-icons/io";

export interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    showCloseButton?: boolean;
}

export const Modal = ({
    children,
    onClose,
    showCloseButton = true,
}: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="z-100 w-full h-dvh fixed inset-0  flex flex-col md:items-center justify-end md:justify-center backdrop-blur-sm bg-black/60">
            <div className="relative bg-gray-900 border border-white/10 md:mx-1 mt-2 mx-auto max-w-3xl p-8 rounded-2xl px-6 overflow-y-auto">
                <div className="md:hidden"></div>
                {showCloseButton && (
                    <button
                        className="flex absolute top-6 text-xs right-6 justify-end text-neutral-400 hover:text-white rounded-md px-1 py-1 border border-gray-900 hover:border-red-500 hover:bg-red-500/20 hover:font-bold cursor-pointer transition-all duration-150"
                        onClick={onClose}
                    >
                        <IoIosClose size={26} />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};
