import { useState, useCallback } from 'react';
import { TerminalHistory, FileSystemNode } from '@/types/linux';
import { virtualFileSystem, systemInfo } from '@/data/filesystem';

export const useTerminal = () => {
  const [history, setHistory] = useState<TerminalHistory[]>([
    { command: '', output: 'Welcome to Linux Web Simulator Terminal\nType "help" for available commands.\n' }
  ]);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getNodeAtPath = useCallback((path: string): FileSystemNode | null => {
    if (path === '/') return virtualFileSystem;
    
    const parts = path.split('/').filter(Boolean);
    let current: FileSystemNode | null = virtualFileSystem;
    
    for (const part of parts) {
      if (!current?.children?.[part]) return null;
      current = current.children[part];
    }
    
    return current;
  }, []);

  const resolvePath = useCallback((inputPath: string): string => {
    if (inputPath === '~') return '/home/user';
    if (inputPath.startsWith('~/')) return '/home/user' + inputPath.slice(1);
    if (inputPath.startsWith('/')) return inputPath;
    
    const parts = currentPath.split('/').filter(Boolean);
    const inputParts = inputPath.split('/').filter(Boolean);
    
    for (const part of inputParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  }, [currentPath]);

  const formatDate = (): string => {
    return new Date().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      year: 'numeric'
    });
  };

  const executeCommand = useCallback((input: string): void => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;

    switch (command) {
      case 'ls': {
        const targetPath = args[0] ? resolvePath(args[0]) : currentPath;
        const node = getNodeAtPath(targetPath);
        const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        
        if (!node || node.type !== 'directory') {
          output = `ls: cannot access '${args[0] || '.'}': No such file or directory`;
          isError = true;
        } else if (node.children) {
          const entries = Object.keys(node.children);
          const filtered = showHidden ? entries : entries.filter(e => !e.startsWith('.'));
          
          if (showLong) {
            output = filtered.map(name => {
              const child = node.children![name];
              return `${child.permissions || '-rw-r--r--'} 1 ${child.owner || 'user'} ${child.owner || 'user'} ${String(child.size || 4096).padStart(6)} ${child.modified || 'Jan 20'} ${name}`;
            }).join('\n');
          } else {
            output = filtered.join('  ');
          }
        }
        break;
      }

      case 'cd': {
        const targetPath = args[0] ? resolvePath(args[0]) : '/home/user';
        const node = getNodeAtPath(targetPath);
        
        if (!node) {
          output = `cd: ${args[0]}: No such file or directory`;
          isError = true;
        } else if (node.type !== 'directory') {
          output = `cd: ${args[0]}: Not a directory`;
          isError = true;
        } else {
          setCurrentPath(targetPath);
          output = '';
        }
        break;
      }

      case 'pwd':
        output = currentPath;
        break;

      case 'echo':
        output = args.join(' ').replace(/["']/g, '');
        break;

      case 'cat': {
        if (!args[0]) {
          output = 'cat: missing file operand';
          isError = true;
        } else {
          const targetPath = resolvePath(args[0]);
          const node = getNodeAtPath(targetPath);
          
          if (!node) {
            output = `cat: ${args[0]}: No such file or directory`;
            isError = true;
          } else if (node.type === 'directory') {
            output = `cat: ${args[0]}: Is a directory`;
            isError = true;
          } else {
            output = node.content || '';
          }
        }
        break;
      }

      case 'clear':
        setHistory([]);
        return;

      case 'whoami':
        output = 'user';
        break;

      case 'hostname':
        output = systemInfo.hostname;
        break;

      case 'date':
        output = formatDate();
        break;

      case 'uname':
        if (args.includes('-a')) {
          output = `Linux ${systemInfo.hostname} 6.2.0-web #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`;
        } else if (args.includes('-r')) {
          output = '6.2.0-web';
        } else {
          output = 'Linux';
        }
        break;

      case 'uptime':
        output = ` ${new Date().toLocaleTimeString()} up ${systemInfo.uptime}, 1 user, load average: 0.15, 0.10, 0.05`;
        break;

      case 'free':
        output = `              total        used        free      shared  buff/cache   available
Mem:        8192000     2048000     4096000      256000     2048000     5632000
Swap:       2048000           0     2048000`;
        break;

      case 'df':
        output = `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1      268435456  53687091 214748365  20% /
tmpfs            4096000         0   4096000   0% /tmp`;
        break;

      case 'ps':
        output = `  PID TTY          TIME CMD
    1 ?        00:00:01 systemd
  256 pts/0    00:00:00 bash
  512 pts/0    00:00:00 ps`;
        break;

      case 'top':
        output = `top - ${new Date().toLocaleTimeString()} up ${systemInfo.uptime}, 1 user, load average: 0.15, 0.10, 0.05
Tasks:   3 total,   1 running,   2 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.0 us,  2.0 sy,  0.0 ni, 92.0 id,  1.0 wa,  0.0 hi,  0.0 si
MiB Mem :   8000.0 total,   4000.0 free,   2000.0 used,   2000.0 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0   16896   8192   6144 S   0.0   0.1   0:01.00 systemd
  256 user      20   0   12288   4096   3072 S   0.0   0.1   0:00.50 bash
  512 user      20   0    8192   2048   1024 R   0.3   0.0   0:00.01 top`;
        break;

      case 'mkdir': {
        if (!args[0]) {
          output = 'mkdir: missing operand';
          isError = true;
        } else {
          output = `mkdir: created directory '${args[0]}'`;
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          output = 'touch: missing file operand';
          isError = true;
        } else {
          output = '';
        }
        break;
      }

      case 'rm': {
        if (!args[0]) {
          output = 'rm: missing operand';
          isError = true;
        } else {
          output = '';
        }
        break;
      }

      case 'cp': {
        if (args.length < 2) {
          output = 'cp: missing destination file operand';
          isError = true;
        } else {
          output = '';
        }
        break;
      }

      case 'mv': {
        if (args.length < 2) {
          output = 'mv: missing destination file operand';
          isError = true;
        } else {
          output = '';
        }
        break;
      }

      case 'grep': {
        if (!args[0]) {
          output = 'Usage: grep PATTERN [FILE]...';
          isError = true;
        } else {
          output = `grep: ${args[1] || 'stdin'}: searching for "${args[0]}"...`;
        }
        break;
      }

      case 'find': {
        output = `${currentPath}
${currentPath}/documents
${currentPath}/downloads
${currentPath}/pictures`;
        break;
      }

      case 'history':
        output = commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n');
        break;

      case 'exit':
        output = 'logout';
        break;

      case 'sudo': {
        if (args[0] === 'apt' && args[1] === 'install') {
          output = `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${args[2] || 'package'}
0 upgraded, 1 newly installed, 0 to remove.
Need to get 1,024 kB of archives.
Selecting previously unselected package ${args[2] || 'package'}.
Setting up ${args[2] || 'package'} ...`;
        } else if (args[0] === 'apt' && args[1] === 'update') {
          output = `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
Get:3 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 229 kB in 2s (114 kB/s)
Reading package lists... Done`;
        } else {
          output = `[sudo] password for user: \nSorry, this is a simulation. No actual sudo access available.`;
        }
        break;
      }

      case 'apt':
        output = 'E: Could not open lock file - try using sudo';
        isError = true;
        break;

      case 'neofetch':
        output = `
        .-/+oossssoo+/-.        user@linux-web-sim
    \`:+ssssssssssssssssss+:\`    ------------------
  -+ssssssssssssssssssyyssss+-  OS: Linux Web Simulator 1.0
.ossssssssssssssssssdMMMNysssso. Kernel: 6.2.0-web
/ssssssssssshdmmNNmmyNMMMMhssss/ Uptime: ${systemInfo.uptime}
+ssssssssshmydMMMMMMMNddddyssss+ Shell: bash 5.1.16
/sssssssshNMMMyhhyyyyhmNMMMNhsss/ Resolution: ${window.innerWidth}x${window.innerHeight}
.ssssssssdMMMNhsssssssssshNMMMdss. Terminal: Linux Web Terminal
+sssshhhyNMMNyssssssssssssyNMMMysss CPU: ${systemInfo.cpu}
ossyNMMMNyMMhsssssssssssssshmmmhss Memory: ${systemInfo.memory}
ossyNMMMNyMMhsssssssssssssshmmmhss
+sssshhhyNMMNyssssssssssssyNMMMysss
.ssssssssdMMMNhsssssssssshNMMMdss.
/sssssssshNMMMyhhyyyyhdNMMMNhsss/
+sssssssssdmydMMMMMMMMddddyssss+
/ssssssssssshdmNNNNmyNMMMMhsss/
.ossssssssssssssssssdMMMNysssso.
  -+sssssssssssssssssyyyssss+-
    \`:+ssssssssssssssssss+:\`
        .-/+oossssoo+/-.`;
        break;

      case 'man': {
        if (!args[0]) {
          output = 'What manual page do you want?';
        } else {
          output = `${args[0].toUpperCase()}(1)                User Commands                ${args[0].toUpperCase()}(1)

NAME
       ${args[0]} - simulated command for Linux Web Simulator

DESCRIPTION
       This is a browser-based Linux simulation. For real documentation,
       visit the official Linux man pages online.

EXAMPLES
       ${args[0]} [options] [arguments]

SEE ALSO
       help(1)`;
        }
        break;
      }

      case 'help':
        output = `Available commands:
  ls [path]         - List directory contents
  cd [path]         - Change directory
  pwd               - Print working directory
  cat [file]        - Display file contents
  echo [text]       - Display text
  clear             - Clear terminal
  whoami            - Display current user
  hostname          - Display system hostname
  date              - Display current date/time
  uname [-a|-r]     - Display system information
  uptime            - Display system uptime
  free              - Display memory usage
  df                - Display disk usage
  ps                - Display running processes
  top               - Display system resources
  history           - Display command history
  mkdir [dir]       - Create directory
  touch [file]      - Create empty file
  rm [file]         - Remove file
  cp [src] [dest]   - Copy file
  mv [src] [dest]   - Move file
  grep [pattern]    - Search for pattern
  find              - Find files
  man [command]     - Display manual
  sudo apt install  - Install package (simulated)
  neofetch          - Display system info
  exit              - Exit terminal

Tips:
  - Use Tab for autocomplete
  - Use Up/Down arrows for command history
  - Use ~ for home directory
  - Use .. to go up one directory`;
        break;

      default:
        output = `${command}: command not found. Type 'help' for available commands.`;
        isError = true;
    }

    setHistory(prev => [...prev, { 
      command: trimmedInput, 
      output,
      isError 
    }]);
  }, [currentPath, resolvePath, getNodeAtPath, commandHistory]);

  const getPreviousCommand = useCallback(() => {
    if (commandHistory.length === 0) return '';
    const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(newIndex);
    return commandHistory[newIndex] || '';
  }, [commandHistory, historyIndex]);

  const getNextCommand = useCallback(() => {
    if (historyIndex === -1) return '';
    const newIndex = historyIndex + 1;
    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1);
      return '';
    }
    setHistoryIndex(newIndex);
    return commandHistory[newIndex] || '';
  }, [commandHistory, historyIndex]);

  return {
    history,
    currentPath,
    executeCommand,
    getPreviousCommand,
    getNextCommand
  };
};
