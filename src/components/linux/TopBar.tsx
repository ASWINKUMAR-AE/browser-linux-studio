import { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, Moon, Sun, Search, Power, Settings, User } from 'lucide-react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export const TopBar = ({ onOpenSettings }: TopBarProps) => {
  const [time, setTime] = useState(new Date());
  const [showSystemMenu, setShowSystemMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="topbar fixed top-0 left-0 right-0 h-8 z-[1000] flex items-center justify-between px-4 text-sm animate-slide-in-top">
      {/* Left side - Activities */}
      <div className="flex items-center gap-4">
        <button className="hover:text-primary transition-colors font-medium">
          Activities
        </button>
      </div>

      {/* Center - Date/Time */}
      <button className="flex items-center gap-2 hover:bg-secondary/50 px-3 py-1 rounded transition-colors">
        <span>{formatDate(time)}</span>
        <span className="font-medium">{formatTime(time)}</span>
      </button>

      {/* Right side - System tray */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-secondary/50 rounded transition-colors">
          <Search className="w-4 h-4" />
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 p-1.5 hover:bg-secondary/50 rounded transition-colors"
            onClick={() => setShowSystemMenu(!showSystemMenu)}
          >
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </button>

          {/* System dropdown */}
          {showSystemMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSystemMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-card rounded-xl shadow-2xl border border-border p-4 z-50 animate-fade-in-up">
                {/* Volume slider */}
                <div className="flex items-center gap-3 mb-4">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <input 
                    type="range" 
                    className="flex-1 accent-primary h-1" 
                    defaultValue={75}
                  />
                </div>

                {/* Brightness slider */}
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-5 h-5 text-muted-foreground" />
                  <input 
                    type="range" 
                    className="flex-1 accent-primary h-1" 
                    defaultValue={100}
                  />
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  {/* Network */}
                  <div className="flex items-center justify-between py-2 px-2 hover:bg-secondary rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5" />
                      <span>Wi-Fi</span>
                    </div>
                    <span className="text-muted-foreground text-sm">Connected</span>
                  </div>

                  {/* Battery */}
                  <div className="flex items-center justify-between py-2 px-2 hover:bg-secondary rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Battery className="w-5 h-5" />
                      <span>Battery</span>
                    </div>
                    <span className="text-muted-foreground text-sm">100%</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <button 
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    onClick={onOpenSettings}
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <Moon className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors">
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
