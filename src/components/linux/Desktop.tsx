import { WindowState } from '@/types/linux';
import { Window } from './Window';
import { TerminalApp } from './apps/TerminalApp';
import { FileManagerApp } from './apps/FileManagerApp';
import { TextEditorApp } from './apps/TextEditorApp';
import { BrowserApp } from './apps/BrowserApp';
import { SystemInfoApp } from './apps/SystemInfoApp';
import { SettingsApp } from './apps/SettingsApp';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { useWindowManager } from '@/hooks/useWindowManager';
import wallpaper from '@/assets/wallpaper.jpg';

export const Desktop = () => {
  const {
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
  } = useWindowManager();

  const renderWindowContent = (type: WindowState['type']) => {
    switch (type) {
      case 'terminal':
        return <TerminalApp />;
      case 'filemanager':
        return <FileManagerApp />;
      case 'texteditor':
        return <TextEditorApp />;
      case 'browser':
        return <BrowserApp />;
      case 'systeminfo':
        return <SystemInfoApp />;
      case 'settings':
        return <SettingsApp />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-background/20" />

      {/* Top Bar */}
      <TopBar onOpenSettings={() => createWindow('settings')} />

      {/* Windows */}
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          isActive={window.id === activeWindowId}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          onPositionChange={(x, y) => updateWindowPosition(window.id, x, y)}
          onSizeChange={(w, h) => updateWindowSize(window.id, w, h)}
        >
          {renderWindowContent(window.type)}
        </Window>
      ))}

      {/* Dock */}
      <Dock 
        windows={windows}
        onOpenApp={createWindow}
        onRestoreWindow={restoreWindow}
      />
    </div>
  );
};
