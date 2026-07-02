import { useEffect, type ReactNode } from "react";
import { Button } from "../Button";
import { IoIosClose } from "react-icons/io";

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
        <div className="z-100 w-full h-dvh fixed inset-0  flex flex-col md:items-center justify-end md:justify-center backdrop-blur-sm bg-black/60">
            <div className="relative bg-gray-900 border border-white/10 md:mx-1 mt-2 mx-auto max-w-3xl p-8 rounded-2xl px-6">
                <div className="md:hidden"></div>{" "}
                <Button
                    onClick={onClose}
                    className="font-mono hidden md:flex absolute right-4 top-4"
                    variant="destructive"
                    aria-label="Close"
                >
                    x
                </Button>
                <button
                    className="w-full -mt-3 -mb-6 flex justify-end text-white md:hidden"
                    onClick={onClose}
                >
                    <IoIosClose size={26} />
                </button>
                {children}
            </div>
        </div>
    );
};
