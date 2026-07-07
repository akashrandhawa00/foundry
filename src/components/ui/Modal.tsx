import { useEffect, type ReactNode } from "react";

export interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    showCloseButton?: boolean;
}

export const Modal = ({ children, onClose }: ModalProps) => {
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
        <div className="z-100 w-full h-dvh fixed inset-0  flex flex-col items-center justify-center backdrop-blur-sm bg-black/60">
            <div className="md:hidden"></div>
            {children}
        </div>
    );
};
