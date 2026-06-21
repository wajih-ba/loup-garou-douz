import { useState, useEffect, useRef } from 'react';

const teams = [
  { id: 'village', icon: '🏘️', label: 'Village' },
  { id: 'werewolf', icon: '🌕', label: 'Loup-Garou' },
  { id: 'solo', icon: '🎭', label: 'Solo' },
];

export default function CustomRoleModal({ editingId, roles, onSave, onDelete, onClose }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  const existing = editingId ? roles.find(r => r.id === editingId) : null;
  const [name, setName] = useState(existing?.name || '');
  const [emoji, setEmoji] = useState(existing?.emoji || '');
  const [count, setCount] = useState(String(existing?.defaultCount || 1));
  const [desc, setDesc] = useState(existing?.description || '');
  const [team, setTeam] = useState(existing?.team || 'village');
  const [photo, setPhoto] = useState(existing?.photo || '');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleSave = () => {
    if (!name.trim()) { setError('Nom requis'); return; }
    setError('');
    onSave({
      name: name.trim(),
      emoji: emoji.trim(),
      team,
      description: desc.trim() || 'Rôle personnalisé',
      defaultCount: parseInt(count) || 1,
      photo: photo || '',
    });
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{editingId ? `Modifier: ${existing?.name}` : 'Rôle personnalisé'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>Nom</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Vampire" maxLength={30} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Emoji</label>
              <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🧛" maxLength={10} />
            </div>
            <div className="form-group">
              <label>Quantité</label>
              <input type="number" value={count} onChange={e => setCount(e.target.value)} min={1} max={20} />
            </div>
          </div>
          <div className="form-group">
            <label>Équipe</label>
            <div className="team-selector">
              {teams.map(t => (
                <label key={t.id} className={`team-card ${team === t.id ? 'active' : ''}`} onClick={() => setTeam(t.id)}>
                  <span className="team-icon">{t.icon}</span>
                  <span className="team-name">{t.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Photo</label>
            <div
              className={`photo-dropzone ${dragOver ? 'drag-over' : ''} ${photo ? 'has-photo' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileRef.current?.click()}
            >
              {photo ? (
                <img src={photo} alt="preview" className="photo-preview-img" />
              ) : (
                <div className="photo-dropzone-hint">
                  <span className="photo-dropzone-icon">📸</span>
                  <span>Cliquez ou glissez une image ici</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={e => { const f = e.target.files[0]; handleFile(f); e.target.value = ''; }}
              />
              {photo && (
                <button className="photo-remove" onClick={e => { e.stopPropagation(); setPhoto(''); }}>×</button>
              )}
            </div>
            <input
              type="text"
              value={!photo.startsWith('data:') ? photo : ''}
              onChange={e => setPhoto(e.target.value)}
              placeholder="ou URL de l'image"
              className="photo-url-input"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Décrivez le rôle..." rows={3} />
          </div>
        </div>
        <div className="modal-footer">
          {editingId && (
            <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => onDelete(editingId)}>Supprimer</button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {editingId ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
