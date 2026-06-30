import './ui.css';

export default function StatCard({ title, value, icon, tone = 'primary', onClick }) {
  return (
    <button type="button" className={`stat-card stat-card-ui tone-${tone}`} onClick={onClick}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-copy">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </button>
  );
}
