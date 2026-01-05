import { useRef, useEffect, ReactNode, useState } from 'react';
import { X, Minus, Square, Copy } from 'lucide-react';
import { WindowState } from '@/types/linux';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  children: ReactNode;
}

export const Window = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  children
}: WindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus();
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || window.isMaximized) return;
      const x = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 100));
      const y = Math.max(32, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
      onPositionChange(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || window.isMaximized) return;
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(touch.clientX - dragOffset.x, globalThis.innerWidth - 100));
      const y = Math.max(32, Math.min(touch.clientY - dragOffset.y, globalThis.innerHeight - 100));
      onPositionChange(x, y);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.isMaximized, onPositionChange]);

  if (window.isMinimized) return null;

  const windowStyle = window.isMaximized
    ? { top: 32, left: 0, right: 0, bottom: 0, width: '100%', height: 'calc(100vh - 32px)' }
    : { top: window.y, left: window.x, width: window.width, height: window.height };

  return (
    <div
      ref={windowRef}
      className={`linux-window fixed animate-window-open ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ 
        ...windowStyle, 
        zIndex: window.zIndex,
      }}
      onMouseDown={onFocus}
    >
      {/* Window Header */}
      <div 
        className={`window-header flex items-center justify-between px-4 py-2 cursor-grab select-none
          ${isActive ? '' : 'opacity-70'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={onMaximize}
      >
        <div className="window-controls flex items-center gap-2">
          <button 
            onClick={onClose}
            className="window-button window-button-close hover:brightness-110"
            title="Close"
          />
          <button 
            onClick={onMinimize}
            className="window-button window-button-minimize hover:brightness-110"
            title="Minimize"
          />
          <button 
            onClick={onMaximize}
            className="window-button window-button-maximize hover:brightness-110"
            title={window.isMaximized ? 'Restore' : 'Maximize'}
          />
        </div>
        
        <span className="text-sm font-medium text-muted-foreground">
          {window.title}
        </span>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Window Body */}
      <div className="h-[calc(100%-40px)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};
