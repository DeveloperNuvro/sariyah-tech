import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Quote,
  Code,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key for new paragraphs
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      execCommand('insertParagraph');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="rich-text-editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="h-8 w-8 p-0"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<pre>')}
          className="h-8 w-8 p-0"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo')}
          className="h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo')}
          className="h-8 w-8 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={`min-h-[300px] p-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
          isFocused ? '' : 'text-gray-500'
        }`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style>{`
        .rich-text-editor-wrapper [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        .rich-text-editor-wrapper [contenteditable]:focus {
          color: #1f2937;
        }
        .rich-text-editor-wrapper [contenteditable] h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0;
        }
        .rich-text-editor-wrapper [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.875rem 0;
        }
        .rich-text-editor-wrapper [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0;
        }
        .rich-text-editor-wrapper [contenteditable] p {
          margin: 0.75rem 0;
          line-height: 1.75;
        }
        .rich-text-editor-wrapper [contenteditable] ul,
        .rich-text-editor-wrapper [contenteditable] ol {
          margin: 0.75rem 0;
          padding-left: 2rem;
        }
        .rich-text-editor-wrapper [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
        }
        .rich-text-editor-wrapper [contenteditable] pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
