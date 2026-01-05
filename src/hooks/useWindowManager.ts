import { useState, useCallback } from 'react';
import { WindowState } from '@/types/linux';

let windowIdCounter = 0;
let zIndexCounter = 100;

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const createWindow = useCallback((type: WindowState['type'], title?: string) => {
    const id = `window-${++windowIdCounter}`;
    const offset = (windowIdCounter % 5) * 30;
    
    const defaults: Record<WindowState['type'], { width: number; height: number; title: string }> = {
      terminal: { width: 700, height: 450, title: 'Terminal' },
      filemanager: { width: 800, height: 500, title: 'Files' },
      texteditor: { width: 600, height: 400, title: 'Text Editor' },
      browser: { width: 900, height: 600, title: 'Web Browser' },
      systeminfo: { width: 500, height: 400, title: 'System Information' },
      settings: { width: 600, height: 500, title: 'Settings' }
    };

    const config = defaults[type];
    
    const newWindow: WindowState = {
      id,
      title: title || config.title,
      type,
      x: 100 + offset,
      y: 60 + offset,
      width: config.width,
      height: config.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++zIndexCounter
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
    return id;
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: false, zIndex: ++zIndexCounter } : w
    ));
    setActiveWindowId(id);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: ++zIndexCounter } : w
    ));
    setActiveWindowId(id);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);

  return {
    windows,
    activeWindowId,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize
  };
};
