import { FileSystemNode } from '@/types/linux';

export const virtualFileSystem: FileSystemNode = {
  name: '/',
  type: 'directory',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  children: {
    home: {
      name: 'home',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      children: {
        user: {
          name: 'user',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'user',
          children: {
            documents: {
              name: 'documents',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              owner: 'user',
              children: {
                'readme.txt': {
                  name: 'readme.txt',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'user',
                  size: 256,
                  modified: '2024-01-15',
                  content: 'Welcome to Linux Web Simulator!\n\nThis is a virtual Linux environment running in your browser.\nExplore the file system, use the terminal, and learn Linux basics!\n\nTry these commands:\n- ls: list files\n- cd: change directory\n- pwd: print working directory\n- cat: view file contents\n- help: see all commands'
                },
                'notes.txt': {
                  name: 'notes.txt',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'user',
                  size: 128,
                  modified: '2024-01-20',
                  content: 'Linux Learning Notes:\n\n1. Everything is a file in Linux\n2. The root directory is /\n3. Your home directory is ~\n4. Use man <command> for help\n5. Practice makes perfect!'
                }
              }
            },
            downloads: {
              name: 'downloads',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              owner: 'user',
              children: {
                'package.tar.gz': {
                  name: 'package.tar.gz',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'user',
                  size: 4096,
                  modified: '2024-01-18',
                  content: '[Binary Archive File]'
                }
              }
            },
            pictures: {
              name: 'pictures',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              owner: 'user',
              children: {
                'wallpaper.png': {
                  name: 'wallpaper.png',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'user',
                  size: 2048,
                  modified: '2024-01-10',
                  content: '[Image File]'
                }
              }
            },
            '.bashrc': {
              name: '.bashrc',
              type: 'file',
              permissions: '-rw-r--r--',
              owner: 'user',
              size: 512,
              modified: '2024-01-01',
              content: '# ~/.bashrc: executed by bash for non-login shells\n\n# Aliases\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"\n\n# PS1 prompt\nexport PS1="\\u@\\h:\\w$ "\n\n# History settings\nHISTSIZE=1000\nHISTFILESIZE=2000'
            }
          }
        }
      }
    },
    etc: {
      name: 'etc',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      children: {
        'hostname': {
          name: 'hostname',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          size: 16,
          modified: '2024-01-01',
          content: 'linux-web-sim'
        },
        'passwd': {
          name: 'passwd',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          size: 256,
          modified: '2024-01-01',
          content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin'
        },
        'os-release': {
          name: 'os-release',
          type: 'file',
          permissions: '-rw-r--r--',
          owner: 'root',
          size: 128,
          modified: '2024-01-01',
          content: 'NAME="Linux Web Simulator"\nVERSION="1.0"\nID=linuxweb\nVERSION_ID="1.0"\nPRETTY_NAME="Linux Web Simulator 1.0"\nHOME_URL="https://github.com"'
        }
      }
    },
    var: {
      name: 'var',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      children: {
        log: {
          name: 'log',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: {
            'syslog': {
              name: 'syslog',
              type: 'file',
              permissions: '-rw-r-----',
              owner: 'root',
              size: 1024,
              modified: '2024-01-20',
              content: 'Jan 20 10:00:00 linux-web-sim kernel: [    0.000000] Linux version 6.2.0-web\nJan 20 10:00:01 linux-web-sim systemd[1]: Starting system services...\nJan 20 10:00:02 linux-web-sim systemd[1]: Started Session Manager.'
            }
          }
        }
      }
    },
    usr: {
      name: 'usr',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      children: {
        bin: {
          name: 'bin',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: {}
        },
        share: {
          name: 'share',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: {}
        }
      }
    },
    tmp: {
      name: 'tmp',
      type: 'directory',
      permissions: 'drwxrwxrwt',
      owner: 'root',
      children: {}
    }
  }
};

export const systemInfo = {
  hostname: 'linux-web-sim',
  kernel: 'Linux 6.2.0-web x86_64',
  os: 'Linux Web Simulator 1.0',
  uptime: '0 days, 0:15:32',
  cpu: 'Virtual CPU @ 2.4GHz (Browser Simulated)',
  memory: '8192 MB (Simulated)',
  storage: '256 GB (Virtual)',
  user: 'user'
};
