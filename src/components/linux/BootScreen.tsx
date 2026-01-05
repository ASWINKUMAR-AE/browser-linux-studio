import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootMessages = [
  { text: '[    0.000000] Linux version 6.2.0-web (gcc 12.2.0)', delay: 100 },
  { text: '[    0.000001] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1', delay: 150 },
  { text: '[    0.001234] BIOS-provided physical RAM map:', delay: 100 },
  { text: '[    0.001235] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff]', delay: 80 },
  { text: '[    0.002000] Initializing cgroup subsys cpu', delay: 120 },
  { text: '[    0.003000] Initializing cgroup subsys cpuacct', delay: 100 },
  { text: '[    0.010000] CPU: Virtual CPU @ 2.4GHz', delay: 150 },
  { text: '[    0.015000] Memory: 8192MB RAM available', delay: 120 },
  { text: '[    0.020000] Calibrating delay loop... 4800.00 BogoMIPS', delay: 200 },
  { text: '[    0.100000] Mount-cache hash table entries: 2048', delay: 100 },
  { text: '[    0.150000] Initializing ACPI...', delay: 180 },
  { text: '[    0.200000] Loading USB drivers...', delay: 150 },
  { text: '[    0.250000] Starting network subsystem...', delay: 200 },
  { text: '[    0.300000] Loading filesystem drivers...', delay: 150 },
  { text: '[    0.350000] Mounting root filesystem...', delay: 250 },
  { text: '[    0.500000] systemd[1]: Starting system services...', delay: 200 },
  { text: '[    0.600000] systemd[1]: Started D-Bus System Message Bus.', delay: 150 },
  { text: '[    0.700000] systemd[1]: Starting Network Manager...', delay: 180 },
  { text: '[    0.800000] systemd[1]: Started Login Service.', delay: 150 },
  { text: '[    0.900000] systemd[1]: Starting User Session Manager...', delay: 200 },
  { text: '[    1.000000] Starting graphical interface...', delay: 300 },
  { text: '[    1.200000] Desktop environment initialized.', delay: 400 },
];

export const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const displayNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        const message = bootMessages[currentIndex];
        setDisplayedMessages(prev => [...prev, message.text]);
        setProgress(((currentIndex + 1) / bootMessages.length) * 100);
        currentIndex++;
        timeout = setTimeout(displayNextMessage, message.delay);
      } else {
        setTimeout(() => {
          setShowLoader(false);
          setTimeout(onBootComplete, 800);
        }, 500);
      }
    };

    timeout = setTimeout(displayNextMessage, 500);

    return () => clearTimeout(timeout);
  }, [onBootComplete]);

  return (
    <div className="boot-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Ubuntu Logo */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary animate-pulse-glow flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-background" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-primary" />
            <div className="absolute top-1/2 -left-3 w-4 h-4 rounded-full bg-primary -translate-y-1/2" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Linux Web Simulator</h1>
            <p className="text-muted-foreground text-sm">Version 1.0</p>
          </div>
        </div>
      </div>

      {/* Boot Messages */}
      <div className="w-full max-w-3xl h-64 overflow-hidden mb-8 px-4">
        <div className="font-mono text-xs text-muted-foreground/70 space-y-0.5">
          {displayedMessages.slice(-15).map((msg, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              {msg}
            </div>
          ))}
          {showLoader && (
            <span className="inline-block w-2 h-4 bg-terminal-text animate-blink" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Indicator */}
      {showLoader && (
        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spinner" />
          <span className="text-sm">Loading system...</span>
        </div>
      )}
    </div>
  );
};
