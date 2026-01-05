import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Star, Shield, X } from 'lucide-react';

const defaultBookmarks = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'Linux', url: 'https://www.linux.org' },
  { name: 'Ubuntu', url: 'https://ubuntu.com' },
];

export const BrowserApp = () => {
  const [url, setUrl] = useState('about:blank');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['about:blank']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = (newUrl: string) => {
    if (!newUrl.startsWith('http')) {
      newUrl = 'https://' + newUrl;
    }
    setIsLoading(true);
    setTimeout(() => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setUrl(newUrl);
      setIsLoading(false);
    }, 500);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Browser toolbar */}
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
          onClick={refresh}
          className="p-2 rounded hover:bg-secondary transition-colors"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => handleNavigate('about:blank')}
          className="p-2 rounded hover:bg-secondary transition-colors"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
          <Shield className="w-4 h-4 text-success" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate(url)}
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Enter URL..."
          />
        </div>

        <button className="p-2 rounded hover:bg-secondary transition-colors">
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border text-sm">
        {defaultBookmarks.map((bookmark) => (
          <button
            key={bookmark.name}
            onClick={() => handleNavigate(bookmark.url)}
            className="px-3 py-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            {bookmark.name}
          </button>
        ))}
      </div>

      {/* Browser content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
        {url === 'about:blank' ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Linux Web Browser</h2>
            <p className="text-muted-foreground mb-6">A simulated web browser for Linux Web Simulator</p>
            
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search or enter URL"
                  className="flex-1 bg-transparent outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      handleNavigate(target.value);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
              {defaultBookmarks.map((bookmark) => (
                <button
                  key={bookmark.name}
                  onClick={() => handleNavigate(bookmark.url)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {bookmark.name[0]}
                    </span>
                  </div>
                  <span className="text-sm">{bookmark.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Simulated Browser</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              This is a browser simulation. In a real Linux environment, this would navigate to:
            </p>
            <code className="px-4 py-2 bg-muted rounded-lg text-primary break-all">
              {url}
            </code>
            <p className="text-sm text-muted-foreground mt-4">
              For security reasons, actual web navigation is disabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
