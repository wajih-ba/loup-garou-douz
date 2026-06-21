import { createPortal } from 'react-dom';
import { Role } from '../../data/roles.js';

export default function InfectModal({ infectorIdx, assignments, playerStatus, onInfect, onClose }) {
  const targets = assignments
    .map((a, i) => ({ ...a, idx: i }))
    .filter(t => t.idx !== infectorIdx && playerStatus[t.idx] !== 'dead' && t.role.team !== 'werewolf' && !t.infected);

  if (targets.length === 0) {
    onClose();
    return null;
  }

  const infector = assignments[infectorIdx];

  return createPortal(
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Infection du Loup Infect</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{infector.player}, choisissez qui infecter :</p>
          <div className="target-list">
            {targets.map(t => (
              <button
                key={t.idx}
                className="target-item"
                style={{ borderLeft: `4px solid ${Role.teamColor(t.role.team)}` }}
                onClick={() => onInfect(t.idx)}
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
