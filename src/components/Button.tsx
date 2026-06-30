import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "destructive" | "shiftActive" | "primary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    classes?: string;
    children: ReactNode;
    variant?: ButtonVariant;
}

const base =
    "px-4 py-2 rounded-md border transition-all text-sm duration-200 cursor-pointer";

const variants: Record<ButtonVariant, string> = {
    default: "text-primary border-white/10 hover:border-white/20",
    destructive:
        "border-red-500 bg-danger/40 text-white hover:bg-danger hover:border-danger",
    shiftActive: "border-amber-500 text-amber-500 bg-amber-500/10",
    primary: "bg-brand text-primary border-brand hover:bg-brand/80",
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
