import { Terminal, Folder, FileText, Globe, Info, Settings } from 'lucide-react';
import { WindowState } from '@/types/linux';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DockProps {
  windows: WindowState[];
  onOpenApp: (type: WindowState['type']) => void;
  onRestoreWindow: (id: string) => void;
}

const dockItems = [
  { 
    type: 'terminal' as const, 
    icon: Terminal, 
    label: 'Terminal',
    tooltip: 'Terminal - The shell is your command-line interface to the Linux kernel. Run commands, manage files, and automate tasks.'
  },
  { 
    type: 'filemanager' as const, 
    icon: Folder, 
    label: 'Files',
    tooltip: 'File Manager - Navigate the Linux file system. Everything in Linux is a file, organized in a hierarchical directory structure starting from / (root).'
  },
  { 
    type: 'texteditor' as const, 
    icon: FileText, 
    label: 'Text Editor',
    tooltip: 'Text Editor - Edit configuration files and write code. In Linux, most configurations are stored as plain text files.'
  },
  { 
    type: 'browser' as const, 
    icon: Globe, 
    label: 'Web Browser',
    tooltip: 'Web Browser - Browse the internet. Linux powers most web servers worldwide!'
  },
  { 
    type: 'systeminfo' as const, 
    icon: Info, 
    label: 'System Info',
    tooltip: 'System Information - View details about your Linux system including kernel version, CPU, memory, and more.'
  },
  { 
    type: 'settings' as const, 
    icon: Settings, 
    label: 'Settings',
    tooltip: 'Settings - Configure your Linux desktop environment preferences.'
  },
];

export const Dock = ({ windows, onOpenApp, onRestoreWindow }: DockProps) => {
  const getWindowsOfType = (type: WindowState['type']) => {
    return windows.filter(w => w.type === type);
  };

  const handleClick = (type: WindowState['type']) => {
    const existingWindows = getWindowsOfType(type);
    const minimizedWindow = existingWindows.find(w => w.isMinimized);
    
    if (minimizedWindow) {
      onRestoreWindow(minimizedWindow.id);
    } else {
      onOpenApp(type);
    }
  };

  return (
    <div className="dock fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] px-4 py-2 rounded-2xl flex items-center gap-2 animate-slide-in-bottom">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const windowsOfType = getWindowsOfType(item.type);
        const hasOpenWindows = windowsOfType.length > 0;
        const hasMinimized = windowsOfType.some(w => w.isMinimized);

        return (
          <Tooltip key={item.type}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleClick(item.type)}
                className={`dock-item relative p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200
                  ${hasOpenWindows ? 'dock-item-active' : ''}`}
              >
                <Icon className="w-7 h-7" />
                {hasMinimized && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-warning" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="edu-tooltip max-w-xs p-3"
              sideOffset={12}
            >
              <p className="font-medium text-primary mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
