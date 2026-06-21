import { useState } from 'react';
import { Role } from '../data/roles.js';
import CustomRoleModal from './modals/CustomRoleModal.jsx';
import NightOrderModal from './modals/NightOrderModal.jsx';

export default function RolesView({
  roles, selections, roleOrder, totalSelected,
  setCount, toggleWake, navigate,
  createRole, updateRole, deleteRole, saveNightOrder, moveRoleOrder,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showNightOrder, setShowNightOrder] = useState(false);

  const byTeam = (team) =>
    roles.filter(r => r.team === team).reduce((s, r) => s + (selections[r.id] || 0), 0);

  return (
    <div className="fade-in">
      <div className="summary-bar">
        <div className="counts">
          <span><span className="dot" style={{ background: 'var(--team-village)' }} /> Village: {byTeam('village')}</span>
          <span><span className="dot" style={{ background: 'var(--team-werewolf)' }} /> Loups: {byTeam('werewolf')}</span>
          <span><span className="dot" style={{ background: 'var(--team-solo)' }} /> Solo: {byTeam('solo')}</span>
          <span className="count-total">Total: {totalSelected}</span>
        </div>
        <div className="summary-actions">
          <button className="btn btn-secondary" onClick={() => setShowNightOrder(true)}>
            Ordre de réveil
          </button>
          <button className="btn btn-primary" disabled={totalSelected < 2} onClick={() => navigate('players')}>
            Jouer
          </button>
        </div>
      </div>

      <div className="role-grid">
        {roleOrder.map(id => {
          const r = roles.find(r => r.id === id);
          if (!r) return null;
          const count = selections[r.id] || 0;
          const tc = Role.teamColor(r.team);
          return (
            <div key={r.id} className={`role-card ${count > 0 ? 'selected' : ''}`}>
              <div className="role-card-drag">
                <button className="drag-btn" onClick={() => moveRoleOrder(r.id, -1)} disabled={roleOrder.indexOf(id) === 0}>▲</button>
                <button className="drag-btn" onClick={() => moveRoleOrder(r.id, 1)} disabled={roleOrder.indexOf(id) === roleOrder.length - 1}>▼</button>
              </div>
              <button className="role-edit-btn" onClick={() => { setEditingId(r.id); setShowCreate(true); }}>✎</button>
              <div className="role-card-image" style={{ background: `linear-gradient(135deg, ${tc}22, ${tc}44)` }}>
                <span className="team-badge" style={{ background: tc }}>{Role.teamLabel(r.team)}</span>
                {r.photo ? (
                  <img src={r.photo} alt={r.name} className="role-photo" />
                ) : (
                  <span className="role-emoji-display">{r.emoji}</span>
                )}
              </div>
              <div className="role-card-body">
                <h3>{r.name}</h3>
                <p>{r.description}</p>
              </div>
              <div className="role-card-actions">
                <label className="wake-toggle">
                  <input type="checkbox" checked={r.wakeUp} onChange={e => toggleWake(r.id, e.target.checked)} />
                  <span>Réveil</span>
                </label>
                <div className="count-controls">
                  <button onClick={() => setCount(r.id, -1)} disabled={count <= r.minCount}>−</button>
                  <span>{count}</span>
                  <button onClick={() => setCount(r.id, 1)} disabled={count >= r.maxCount}>+</button>
                </div>
              </div>
            </div>
          );
        })}
        <div className="role-card add-role-card" onClick={() => { setEditingId(null); setShowCreate(true); }}>
          <div className="add-role-inner">
            <span className="add-role-icon">+</span>
            <span>Rôle personnalisé</span>
          </div>
        </div>
      </div>

      {showCreate && (
        <CustomRoleModal
          editingId={editingId}
          roles={roles}
          onSave={(data) => {
            if (editingId) updateRole(editingId, data);
            else createRole(data);
            setShowCreate(false);
            setEditingId(null);
          }}
          onDelete={(id) => { deleteRole(id); setShowCreate(false); setEditingId(null); }}
          onClose={() => { setShowCreate(false); setEditingId(null); }}
        />
      )}

      {showNightOrder && (
        <NightOrderModal
          roles={roles}
          onSave={(ordered) => { saveNightOrder(ordered); setShowNightOrder(false); }}
          onClose={() => setShowNightOrder(false)}
        />
      )}
    </div>
  );
}
