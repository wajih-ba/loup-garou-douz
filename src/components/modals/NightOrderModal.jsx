import { useState, useEffect } from 'react';
import { Role } from '../../data/roles.js';

export default function NightOrderModal({ roles, onSave, onClose }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  const waking = roles.filter(r => r.wakeUp)
    .sort((a, b) => (a.nightOrder ?? 99) - (b.nightOrder ?? 99));
  const [order, setOrder] = useState(() => waking.map(r => r.id));

  const move = (id, dir) => {
    setOrder(prev => {
      const idx = prev.indexOf(id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const swap = idx + dir;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content night-order-modal">
        <div className="modal-header">
          <h3>Ordre de réveil</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 0 }}>
          <div className="night-order-list">
            {order.map((id, i) => {
              const r = roles.find(rr => rr.id === id);
              if (!r) return null;
              return (
                <div key={r.id} className="night-order-item" style={{ borderLeft: `4px solid ${Role.teamColor(r.team)}` }}>
                  <span className="night-order-num">{i + 1}</span>
                  <span className="night-order-emoji">{r.emoji}</span>
                  <span className="night-order-name">{r.name}</span>
                  <div className="night-order-move">
                    <button className="drag-btn" onClick={() => move(r.id, -1)} disabled={i === 0}>▲</button>
                    <button className="drag-btn" onClick={() => move(r.id, 1)} disabled={i === order.length - 1}>▼</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => onSave(order)}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
