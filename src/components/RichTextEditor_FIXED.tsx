import { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Digite aqui...', 
  className = '' 
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Configuração de sanitização para editor
  const sanitizeConfig = {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Sanitizar antes de inserir no DOM
      const sanitizedValue = DOMPurify.sanitize(value, sanitizeConfig);
      editorRef.current.innerHTML = sanitizedValue;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      // Sanitizar conteúdo ao editar
      const content = editorRef.current.innerHTML;
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
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Obter texto puro do clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Sanitizar antes de inserir
    const sanitizedText = DOMPurify.sanitize(text, sanitizeConfig);
    
    // Inserir no cursor
    document.execCommand('insertHTML', false, sanitizedText);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      className={`rich-text-editor ${className}`}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  );
};

export default RichTextEditor;
