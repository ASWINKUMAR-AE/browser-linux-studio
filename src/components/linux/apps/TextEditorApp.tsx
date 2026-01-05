import { useState } from 'react';
import { Save, FileText, Undo, Redo, Copy, Scissors, Clipboard } from 'lucide-react';

export const TextEditorApp = () => {
  const [content, setContent] = useState(`# Welcome to the Text Editor

This is a simple text editor for Linux Web Simulator.

You can edit text here, just like you would in a real Linux text editor.

Try writing some code:

#!/bin/bash
echo "Hello, Linux World!"

# This is a comment
for i in {1..5}; do
  echo "Count: $i"
done

# Tips:
# - Use Ctrl+S to save (simulated)
# - Use Ctrl+Z to undo
# - Use Ctrl+Y to redo
`);
  const [fileName, setFileName] = useState('untitled.txt');
  const [isSaved, setIsSaved] = useState(true);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simulate save
    setIsSaved(true);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-secondary transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </button>
        <div className="h-4 w-px bg-border" />
        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Undo className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Redo className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-border" />
        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Scissors className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Clipboard className="w-4 h-4" />
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent outline-none text-sm w-32"
          />
          {!isSaved && <span className="text-warning text-xs">●</span>}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        {/* Line numbers */}
        <div className="w-12 bg-muted/30 border-r border-border pt-4 text-right pr-2 select-none">
          {content.split('\n').map((_, index) => (
            <div key={index} className="text-xs text-muted-foreground leading-6">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Text area */}
        <textarea
          value={content}
          onChange={handleContentChange}
          className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-sm leading-6"
          spellCheck={false}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-xs text-muted-foreground bg-muted/30">
        <span>Lines: {content.split('\n').length}</span>
        <span>Characters: {content.length}</span>
        <span>Plain Text</span>
      </div>
    </div>
  );
};
