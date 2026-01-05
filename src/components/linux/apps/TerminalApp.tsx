import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTerminal } from '@/hooks/useTerminal';

export const TerminalApp = () => {
  const { history, currentPath, executeCommand, getPreviousCommand, getNextCommand } = useTerminal();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCmd = getPreviousCommand();
      setInput(prevCmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCmd = getNextCommand();
      setInput(nextCmd);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete for common commands
      const commands = ['ls', 'cd', 'pwd', 'cat', 'clear', 'echo', 'whoami', 'date', 'help', 'history', 'neofetch'];
      const match = commands.find(cmd => cmd.startsWith(input));
      if (match) setInput(match);
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      executeCommand('clear');
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const getPromptPath = () => {
    if (currentPath === '/home/user') return '~';
    if (currentPath.startsWith('/home/user/')) return '~' + currentPath.slice(10);
    return currentPath;
  };

  return (
    <div 
      ref={containerRef}
      className="terminal-body h-full p-4 overflow-auto cursor-text"
      onClick={handleContainerClick}
    >
      {/* History */}
      {history.map((entry, index) => (
        <div key={index} className="mb-2">
          {entry.command && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="terminal-prompt font-bold">user@linux-web-sim</span>
              <span className="text-info">:</span>
              <span className="text-info font-bold">{getPromptPath()}</span>
              <span className="text-foreground">$</span>
              <span className="text-foreground">{entry.command}</span>
            </div>
          )}
          {entry.output && (
            <pre className={`whitespace-pre-wrap text-sm mt-1 ${entry.isError ? 'terminal-error' : 'terminal-output'}`}>
              {entry.output}
            </pre>
          )}
        </div>
      ))}

      {/* Current Input Line */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="terminal-prompt font-bold">user@linux-web-sim</span>
        <span className="text-info">:</span>
        <span className="text-info font-bold">{getPromptPath()}</span>
        <span className="text-foreground">$</span>
        <div className="flex-1 min-w-0 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none border-none text-foreground font-mono w-full caret-terminal-text"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
};
