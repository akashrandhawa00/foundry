import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    classes?: string;
    children: ReactNode;
}

export const Button = ({ children, classes, ...props }: Props) => {
    return (
        <button className={`px-4 py-2 rounded text-white bg-amber-500 cursor-pointer ${classes ?? ""}`} {...props}>
            {children}
        </button>
    );
};
