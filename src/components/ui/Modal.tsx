import { useEffect, type ReactNode } from "react";
import { Button } from "../Button";

export interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
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
        <div className="w-full h-full fixed inset-0  flex flex-col items-center gap-4 justify-center backdrop-blur-sm bg-black/60">
            <div className="relative bg-surface border border-white/10 max-w-3xl p-8 rounded-2xl px-6">
                {" "}
                <Button
                    onClick={onClose}
                    className="font-mono absolute right-4 top-4"
                    variant="destructive"
                    aria-label="Close"
                >
                    x
                </Button>
                {children}
            </div>
        </div>
    );
};
