import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "destructive" | "shiftActive";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    classes?: string;
    children: ReactNode;
    variant?: ButtonVariant;
}

const base =
    "px-4 py-2 rounded-md border transition-all text-sm duration-200 cursor-pointer";

const variants: Record<ButtonVariant, string> = {
    default: "border-white/10 text-ink hover:border-white/20",
    destructive:
        "border-red-500 bg-red-500/40 text-white hover:bg-red-700 hover:border-red-800",
    shiftActive: "border-amber-500 text-amber-500 bg-amber-500/10",
};

export const Button = ({
    children,
    variant = "default",
    className = "",
    ...props
}: Props) => {
    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
