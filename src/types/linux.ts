export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemNode>;
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: string;
}

export interface WindowState {
  id: string;
  title: string;
  type: 'terminal' | 'filemanager' | 'texteditor' | 'browser' | 'systeminfo' | 'settings';
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface TerminalHistory {
  command: string;
  output: string;
  isError?: boolean;
}

export interface SystemInfo {
  hostname: string;
  kernel: string;
  os: string;
  uptime: string;
  cpu: string;
  memory: string;
  storage: string;
  user: string;
}
