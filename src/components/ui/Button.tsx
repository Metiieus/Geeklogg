import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target no-zoom";

    const variants = {
        primary: "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25 border border-transparent focus:ring-purple-500",
        secondary: "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 focus:ring-slate-500",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 focus:ring-red-500",
        ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5 focus:ring-white/20",
        outline: "bg-transparent text-white border border-slate-600 hover:bg-slate-800 focus:ring-slate-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2 text-sm sm:text-base gap-2",
        lg: "px-6 py-3 text-base sm:text-lg gap-2.5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
            ) : leftIcon ? (
                <span className="flex-shrink-0">{leftIcon}</span>
            ) : null}

            <span className="truncate">{children}</span>

            {!isLoading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
};
