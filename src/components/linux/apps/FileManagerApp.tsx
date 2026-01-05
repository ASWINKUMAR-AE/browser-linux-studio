import { useState, useCallback } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Home, HardDrive, ArrowLeft, ArrowRight, ArrowUp, Search, Grid, List, MoreVertical } from 'lucide-react';
import { virtualFileSystem, systemInfo } from '@/data/filesystem';
import { FileSystemNode } from '@/types/linux';

export const FileManagerApp = () => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [history, setHistory] = useState<string[]>(['/home/user']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const currentNode = getNodeAtPath(currentPath);
  const entries = currentNode?.children ? Object.entries(currentNode.children) : [];

  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const goUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 0) {
      parts.pop();
      navigateTo('/' + parts.join('/') || '/');
    }
  };

  const handleItemClick = (name: string, node: FileSystemNode) => {
    if (node.type === 'directory') {
      navigateTo(currentPath === '/' ? `/${name}` : `${currentPath}/${name}`);
    } else {
      setSelectedFile(name);
    }
  };

  const getPathSegments = () => {
    return currentPath.split('/').filter(Boolean);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="p-2 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="p-2 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={goUp}
          disabled={currentPath === '/'}
          className="p-2 rounded hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Path breadcrumb */}
        <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg overflow-x-auto">
          <button 
            onClick={() => navigateTo('/')}
            className="hover:text-primary transition-colors"
          >
            <HardDrive className="w-4 h-4" />
          </button>
          {getPathSegments().map((segment, index, arr) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <button
                onClick={() => navigateTo('/' + arr.slice(0, index + 1).join('/'))}
                className="hover:text-primary transition-colors text-sm whitespace-nowrap"
              >
                {segment}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-border p-2 flex-shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => navigateTo('/home/user')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/home/user' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </button>
            <button
              onClick={() => navigateTo('/home/user/documents')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/home/user/documents' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">Documents</span>
            </button>
            <button
              onClick={() => navigateTo('/home/user/downloads')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/home/user/downloads' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">Downloads</span>
            </button>
            <button
              onClick={() => navigateTo('/home/user/pictures')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/home/user/pictures' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">Pictures</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="px-3 text-xs text-muted-foreground mb-2">Other Locations</p>
            <button
              onClick={() => navigateTo('/')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-secondary`}
            >
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">Computer</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 overflow-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder className="w-16 h-16 mb-4 opacity-30" />
              <p>Folder is empty</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {entries.map(([name, node]) => (
                <button
                  key={name}
                  onClick={() => handleItemClick(name, node)}
                  onDoubleClick={() => node.type === 'directory' && handleItemClick(name, node)}
                  className={`file-item flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                    ${selectedFile === name ? 'file-item-selected' : 'hover:bg-secondary'}`}
                >
                  {node.type === 'directory' ? (
                    <Folder className="w-12 h-12 text-primary" />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  )}
                  <span className="text-sm text-center break-all line-clamp-2">{name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {entries.map(([name, node]) => (
                <button
                  key={name}
                  onClick={() => handleItemClick(name, node)}
                  onDoubleClick={() => node.type === 'directory' && handleItemClick(name, node)}
                  className={`file-item w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                    ${selectedFile === name ? 'file-item-selected' : 'hover:bg-secondary'}`}
                >
                  {node.type === 'directory' ? (
                    <Folder className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="flex-1 text-left text-sm">{name}</span>
                  <span className="text-xs text-muted-foreground">{node.size ? `${node.size} B` : '--'}</span>
                  <span className="text-xs text-muted-foreground w-20">{node.modified || '--'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
