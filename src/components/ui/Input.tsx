import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, leftIcon, rightIcon, className = "", containerClassName = "", id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                        {label}
                        {props.required && <span className="text-pink-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full bg-slate-800/50 text-white rounded-xl border border-slate-700/50 
              placeholder:text-slate-500 
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${leftIcon ? "pl-10" : "px-3 sm:px-4"}
              ${rightIcon ? "pr-10" : "px-3 sm:px-4"}
              py-2.5 sm:py-3
              text-sm sm:text-base
              ${error ? "border-red-500/50 focus:ring-red-500/25 focus:border-red-500" : "hover:border-slate-600/50"}
              ${className}
            `}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <div className="mt-1.5 flex items-start gap-1">
                        {error ? (
                            <span className="text-xs text-red-400 font-medium">{error}</span>
                        ) : (
                            <span className="text-xs text-slate-500">{helperText}</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
