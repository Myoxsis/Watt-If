import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export type GameWindowKind = 'advisor' | 'metrics' | 'presets' | 'export' | 'history' | 'settings' | null;

export function GameWindow({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="game-modal-window" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="game-modal-titlebar">
          <div className="window-lights" aria-hidden="true"><span /><span /><span /></div>
          <div>
            <strong>{title}</strong>
            {subtitle && <small>{subtitle}</small>}
          </div>
          <button className="window-close" onClick={onClose} aria-label="Close window"><X size={18} /></button>
        </header>
        <div className="game-modal-body">{children}</div>
      </section>
    </div>
  );
}

export function WindowDock({ openWindow }: { openWindow: (window: Exclude<GameWindowKind, null>) => void }) {
  return (
    <nav className="window-dock" aria-label="Window dock">
      <button onClick={() => openWindow('advisor')}>Advisor</button>
      <button onClick={() => openWindow('metrics')}>Metrics</button>
      <button onClick={() => openWindow('presets')}>Presets</button>
      <button onClick={() => openWindow('history')}>History</button>
      <button onClick={() => openWindow('export')}>Export</button>
    </nav>
  );
}
