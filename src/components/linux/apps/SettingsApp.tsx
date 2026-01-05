import { Palette, Monitor, Bell, User, Shield, Keyboard, Wifi, Bluetooth, Volume2, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const settingsCategories = [
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'display', icon: Monitor, label: 'Display' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'users', icon: User, label: 'Users' },
  { id: 'privacy', icon: Shield, label: 'Privacy' },
  { id: 'keyboard', icon: Keyboard, label: 'Keyboard' },
  { id: 'network', icon: Wifi, label: 'Network' },
  { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth' },
  { id: 'sound', icon: Volume2, label: 'Sound' },
];

export const SettingsApp = () => {
  const [activeCategory, setActiveCategory] = useState('appearance');
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('orange');

  const accentColors = [
    { name: 'orange', value: 'hsl(25, 100%, 50%)' },
    { name: 'blue', value: 'hsl(210, 100%, 50%)' },
    { name: 'green', value: 'hsl(142, 76%, 36%)' },
    { name: 'purple', value: 'hsl(270, 76%, 50%)' },
    { name: 'red', value: 'hsl(0, 72%, 51%)' },
    { name: 'teal', value: 'hsl(180, 76%, 36%)' },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Appearance</h2>
            
            {/* Theme */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-medium mb-4">Style</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setDarkMode(false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    !darkMode ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Sun className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-center">Light</p>
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    darkMode ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Moon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-center">Dark</p>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-medium mb-4">Accent Color</h3>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color.name)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      accentColor === color.name ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-medium mb-4">Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 border border-border hover:border-primary transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Display</h2>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-medium mb-4">Screen</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Resolution</span>
                  <span className="text-muted-foreground">{window.innerWidth} × {window.innerHeight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Night Light</span>
                  <button className="w-10 h-6 rounded-full bg-muted relative">
                    <div className="w-4 h-4 rounded-full bg-muted-foreground absolute left-1 top-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select a category from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex bg-card">
      {/* Sidebar */}
      <div className="w-56 border-r border-border p-2 overflow-y-auto">
        <h2 className="px-4 py-2 text-lg font-bold">Settings</h2>
        <div className="space-y-1">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};
