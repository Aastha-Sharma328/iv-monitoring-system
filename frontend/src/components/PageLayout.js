import Sidebar from './Sidebar';
import './ui.css';

export default function PageLayout({ activeItem, onNavigate, children, header }) {
  return (
    <div className="app-shell">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <div className="app-shell-content">
        {header ? <div className="page-header-slot">{header}</div> : null}
        {children}
      </div>
    </div>
  );
}
