import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options?: Option[];
    containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, options = [], children, className = "", containerClassName = "", id, ...props }, ref) => {
        const selectId = id || props.name;

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                        {label}
                        {props.required && <span className="text-pink-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative group">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`
              w-full bg-slate-800/50 text-white rounded-xl border border-slate-700/50 
              appearance-none
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              pl-3 sm:pl-4 pr-10
              py-2.5 sm:py-3
              text-sm sm:text-base
              ${error ? "border-red-500/50 focus:ring-red-500/25 focus:border-red-500" : "hover:border-slate-600/50"}
              ${className}
            `}
                        {...props}
                    >
                        {children ? children : (
                            options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))
                        )}
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-purple-400 transition-colors">
                        <ChevronDown size={16} />
                    </div>
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

Select.displayName = "Select";
