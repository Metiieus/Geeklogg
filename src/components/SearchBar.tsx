import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar mídia..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800
                   text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};
