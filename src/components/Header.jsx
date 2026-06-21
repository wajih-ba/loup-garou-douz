const tabs = [
  { key: 'roles', label: 'Rôles' },
  { key: 'players', label: 'Joueurs' },
  { key: 'guide', label: 'Jeu' },
];

export default function Header({ currentView, navigate, hasPlayers, hasAssignments }) {
  return (
    <header className="app-header">
      <h1 className="app-title"><span>🌙</span> Loup-Garou</h1>
      <nav className="header-nav">
        {tabs.map(t => {
          const disabled = (t.key === 'players' && !hasPlayers) ||
                           (t.key === 'guide' && !hasAssignments);
          return (
            <button
              key={t.key}
              className={`nav-btn ${currentView === t.key ? 'active' : ''}`}
              disabled={disabled}
              onClick={() => navigate(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
