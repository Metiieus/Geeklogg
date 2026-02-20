import React, { useRef, useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxLength?: number;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escreva aqui...",
  minHeight = "200px",
  maxLength = 5000,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Configuração de sanitização
  const sanitizeConfig = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  };

  // Inicializar conteúdo do editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const sanitizedValue = DOMPurify.sanitize(value, sanitizeConfig);
      editorRef.current.innerHTML = sanitizedValue;
      updateCharCount();
    }
  }, [value]);

  // Atualizar contador de caracteres
  const updateCharCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setCharCount(text.length);
    }
  };

  // Executar comando de formatação
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // Lidar com entrada de texto
  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || "";

      // Verificar limite de caracteres
      if (maxLength && text.length > maxLength) {
        // Reverter para o conteúdo anterior
        const sanitizedValue = DOMPurify.sanitize(value, sanitizeConfig);
        editorRef.current.innerHTML = sanitizedValue;
        return;
      }

      // Sanitizar conteúdo antes de salvar
      const sanitizedContent = DOMPurify.sanitize(content, sanitizeConfig);
      
      // Se o conteúdo foi alterado pela sanitização, atualizar o editor
      if (content !== sanitizedContent) {
        editorRef.current.innerHTML = sanitizedContent;
        
        // Restaurar cursor no final
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      onChange(sanitizedContent);
      updateCharCount();
    }
  };

  // Lidar com colagem de texto
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    // Sanitizar antes de inserir
    const sanitizedText = DOMPurify.sanitize(text, sanitizeConfig);
    document.execCommand("insertHTML", false, sanitizedText);
  };

  // Botões da barra de ferramentas
  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Negrito (Ctrl+B)",
      ariaLabel: "Negrito",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Itálico (Ctrl+I)",
      ariaLabel: "Itálico",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Sublinhado (Ctrl+U)",
      ariaLabel: "Sublinhado",
    },
    { type: "separator" },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Lista com marcadores",
      ariaLabel: "Lista não ordenada",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Lista numerada",
      ariaLabel: "Lista ordenada",
    },
    { type: "separator" },
    {
      icon: Undo,
      command: "undo",
      title: "Desfazer (Ctrl+Z)",
      ariaLabel: "Desfazer",
    },
    {
      icon: Redo,
      command: "redo",
      title: "Refazer (Ctrl+Y)",
      ariaLabel: "Refazer",
    },
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Barra de ferramentas */}
      <div className="toolbar bg-slate-700/30 border border-slate-600 rounded-t-lg p-2 flex flex-wrap items-center gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.type === "separator") {
            return (
              <div
                key={`separator-${index}`}
                className="w-px h-6 bg-slate-600 mx-1"
              />
            );
          }

          const Icon = button.icon!;
          return (
            <button
              key={button.command}
              type="button"
              onClick={() => executeCommand(button.command!)}
              title={button.title}
              aria-label={button.ariaLabel}
              className="p-2 hover:bg-slate-600/50 rounded transition-colors text-slate-300 hover:text-white"
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* Área de edição */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`editor-content bg-slate-700/50 border-x border-b border-slate-600 rounded-b-lg px-4 py-3 text-white focus:outline-none overflow-y-auto ${
          isFocused ? "ring-2 ring-purple-500" : ""
        }`}
        style={{ minHeight }}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-label="Editor de texto rico"
      />

      {/* Contador de caracteres */}
      {maxLength && (
        <div className="flex justify-end mt-2">
          <span
            className={`text-xs ${
              charCount > maxLength * 0.9
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {charCount} / {maxLength}
          </span>
        </div>
      )}

      {/* Estilos CSS inline */}
      <style>{`
        .rich-text-editor .editor-content:empty:before {
          content: attr(data-placeholder);
          color: rgb(148 163 184 / 0.5);
          pointer-events: none;
        }

        .rich-text-editor .editor-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .rich-text-editor .editor-content p {
          margin: 0.5em 0;
        }

        .rich-text-editor .editor-content p:first-child {
          margin-top: 0;
        }

        .rich-text-editor .editor-content p:last-child {
          margin-bottom: 0;
        }

        .rich-text-editor .editor-content ul,
        .rich-text-editor .editor-content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .rich-text-editor .editor-content ul {
          list-style-type: disc;
        }

        .rich-text-editor .editor-content ol {
          list-style-type: decimal;
        }

        .rich-text-editor .editor-content li {
          margin: 0.25em 0;
        }

        .rich-text-editor .editor-content strong {
          font-weight: bold;
        }

        .rich-text-editor .editor-content em {
          font-style: italic;
        }

        .rich-text-editor .editor-content u {
          text-decoration: underline;
        }

        .rich-text-editor .editor-content a {
          color: rgb(147 197 253);
          text-decoration: underline;
        }

        /* Scrollbar customizado */
        .rich-text-editor .editor-content::-webkit-scrollbar {
          width: 8px;
        }

        .rich-text-editor .editor-content::-webkit-scrollbar-track {
          background: rgb(51 65 85 / 0.3);
          border-radius: 4px;
        }

        .rich-text-editor .editor-content::-webkit-scrollbar-thumb {
          background: rgb(100 116 139);
          border-radius: 4px;
        }

        .rich-text-editor .editor-content::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184);
        }
      `}</style>
    </div>
  );
};
