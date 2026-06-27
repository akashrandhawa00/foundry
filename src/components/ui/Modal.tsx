import type { ReactNode } from "react";
import { Button } from "../Button";

export interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export const Modal = ({ title, children, onClose }: ModalProps) => {
    return (
        <div className="w-full h-full fixed flex flex-col items-center gap-4 justify-center backdrop-blur-md bg-black/70">
            <div>
                <h3>Modal: {title}</h3>
            </div>
            {children}
            <div>
                <Button onClick={onClose}>close</Button>
                <Button>add</Button>
            </div>
        </div>
    );
};
