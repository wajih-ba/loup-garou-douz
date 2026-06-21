import { createPortal } from 'react-dom';

export default function RetroSwapModal({ fromIdx, assignments, playerStatus, onSwap, onClose }) {
  const targets = assignments
    .map((a, i) => ({ ...a, idx: i }))
    .filter(t => t.idx !== fromIdx && playerStatus[t.idx] !== 'dead');

  return createPortal(
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Échange de rôle</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">
            {assignments[fromIdx].player} échange son rôle. L'autre devient Villageois.
          </p>
          <div className="target-list">
            {targets.map(t => (
              <button
                key={t.idx}
                className="target-item"
                style={{ borderLeft: `4px solid ${t.role.team === 'werewolf' ? 'var(--team-werewolf)' : t.role.team === 'solo' ? 'var(--team-solo)' : 'var(--team-village)'}` }}
                onClick={() => onSwap(t.idx)}
              >
                <span>{t.role.emoji}</span>
                <span style={{ fontWeight: 600 }}>{t.player}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.role.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
