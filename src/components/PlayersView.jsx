export default function PlayersView({
  players, totalSelected, addPlayer, removePlayer, updatePlayerName, assignRoles, navigate,
}) {
  const roleCount = totalSelected;
  return (
    <div className="fade-in">
      <h2 className="page-title">Joueurs</h2>
      <p className="page-subtitle">
        {roleCount} rôle(s) · <strong>{players.length}</strong> joueur(s)
        {players.length > roleCount
          ? <span style={{ color: 'var(--team-village)' }}> · Les excédents deviennent Villageois</span>
          : players.length < roleCount
          ? <span style={{ color: 'var(--accent)' }}> · {roleCount - players.length} rôle(s) non attribué(s)</span>
          : ''}
      </p>

      <div className="player-setup-grid">
        {players.length === 0 && (
          <div className="empty-players">Ajoutez votre premier joueur</div>
        )}
        {players.map((name, i) => (
          <div key={i} className="player-input-group">
            <span className="player-num">#{i + 1}</span>
            <input type="text" value={name} placeholder="Nom du joueur"
              onChange={e => updatePlayerName(i, e.target.value)} />
            <button onClick={() => removePlayer(i)} className="remove-btn">×</button>
          </div>
        ))}
        <div className="player-input-group add-player-row">
          <span className="add-player-hint">
            {players.length === 0 ? 'Ajouter' : players.length >= roleCount ? 'Max' : ''}
          </span>
          <button onClick={addPlayer} className="add-player-btn" disabled={players.length >= roleCount}>+</button>
        </div>
      </div>

      <div className="player-actions">
        <button className="btn btn-primary" disabled={players.length < 2} onClick={assignRoles}>
          Distribuer les rôles
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('roles')}>
          ← Rôles
        </button>
      </div>
    </div>
  );
}
