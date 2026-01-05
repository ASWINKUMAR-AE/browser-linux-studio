import { Monitor, Cpu, HardDrive, MemoryStick, Wifi, Clock, Server, Terminal } from 'lucide-react';
import { systemInfo } from '@/data/filesystem';

export const SystemInfoApp = () => {
  const infoSections = [
    {
      icon: Server,
      title: 'Operating System',
      items: [
        { label: 'OS Name', value: systemInfo.os },
        { label: 'Hostname', value: systemInfo.hostname },
        { label: 'Kernel', value: systemInfo.kernel },
      ]
    },
    {
      icon: Cpu,
      title: 'Hardware',
      items: [
        { label: 'Processor', value: systemInfo.cpu },
        { label: 'Architecture', value: 'x86_64' },
      ]
    },
    {
      icon: MemoryStick,
      title: 'Memory',
      items: [
        { label: 'Total RAM', value: systemInfo.memory },
        { label: 'Used', value: '2048 MB' },
        { label: 'Available', value: '6144 MB' },
      ]
    },
    {
      icon: HardDrive,
      title: 'Storage',
      items: [
        { label: 'Total', value: systemInfo.storage },
        { label: 'Used', value: '52 GB (20%)' },
        { label: 'Available', value: '204 GB' },
      ]
    },
    {
      icon: Monitor,
      title: 'Display',
      items: [
        { label: 'Resolution', value: `${window.innerWidth} x ${window.innerHeight}` },
        { label: 'Renderer', value: 'WebGL (Browser)' },
      ]
    },
    {
      icon: Wifi,
      title: 'Network',
      items: [
        { label: 'Status', value: 'Connected' },
        { label: 'Type', value: 'Browser Simulated' },
      ]
    },
  ];

  return (
    <div className="h-full overflow-auto p-6 bg-card">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Terminal className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{systemInfo.os}</h1>
          <p className="text-muted-foreground">System Information</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {infoSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-medium">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Usage */}
      <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Resource Usage
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>CPU Usage</span>
              <span>12%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Memory Usage</span>
              <span>25%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Disk Usage</span>
              <span>20%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-info rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" />
          <span className="font-medium">System Uptime: {systemInfo.uptime}</span>
        </div>
      </div>
    </div>
  );
};
