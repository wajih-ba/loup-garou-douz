import { useState } from 'react';
import { Role } from '../data/roles.js';
import InfectModal from './modals/InfectModal.jsx';
import RetroSwapModal from './modals/RetroSwapModal.jsx';

function PlayerRow({ a, i, status, killPlayer, openInfect, setRetroIdx }) {
  const role = a.role;
  const tc = a.infected ? Role.teamColor('werewolf') : Role.teamColor(role.team);
  const isDead = status === 'dead';
  const isWounded = status === 'wounded';
  const isElder = role.id === 'elder';

  const roleDisplay = a.infected ? `${role.emoji} ${role.name} + Loup-Garou` : `${role.emoji} ${role.name}`;

  let statusIcon = '🟢';
  let statusLabel = 'حي';
  if (isWounded) { statusIcon = '🟡'; statusLabel = 'مجروح'; }
  if (isDead) { statusIcon = '⚫'; statusLabel = 'ميت'; }

  return (
    <div className={`player-row ${isDead ? 'dead' : ''} ${isWounded ? 'wounded' : ''}`}>
      <span className="player-status-icon">{statusIcon}</span>
      <span className="player-row-name">{a.player}</span>
      <span className="player-row-role" style={{ color: tc }}>{roleDisplay}</span>
      <span className="player-row-status">{statusLabel}</span>
      {!isDead && (
        <>
          {isElder && !isWounded && <button className="btn-sm btn-wound" onClick={() => killPlayer(i)}>يجرح</button>}
          {isElder && isWounded && <button className="btn-sm btn-kill" onClick={() => killPlayer(i)}>يقتل</button>}
          {!isElder && <button className="btn-sm btn-kill" onClick={() => killPlayer(i)}>يقتل</button>}
          {role.id === 'retro' && !a.usedPower && (
            <button className="btn-sm btn-retro" onClick={() => setRetroIdx(i)}>يسرق</button>
          )}
          {role.id === 'infectedwolf' && !a.usedPower && (
            <button className="btn-sm btn-infect" onClick={() => openInfect(i)}>يعدي</button>
          )}
        </>
      )}
    </div>
  );
}

export default function GuideView({
  assignments, playerStatus, getNightPhases,
  killPlayer, executeInfect, doRetroSwap, resetGame,
}) {
  const [infectIdx, setInfectIdx] = useState(null);
  const [retroIdx, setRetroIdx] = useState(null);
  const phases = getNightPhases();
  const alive = playerStatus.filter(s => s !== 'dead').length;

  return (
    <div className="fade-in game-guide">
      <div className="guide-header">
        <span className="guide-alive">🟢 {alive} حي</span>
      </div>

      <div className="guide-card">
        <div className="guide-title">اللاعبين</div>
        <div className="player-table">
          {assignments.map((a, i) => (
            <PlayerRow
              key={i} a={a} i={i} status={playerStatus[i]}
              killPlayer={killPlayer}
              openInfect={() => setInfectIdx(i)}
              setRetroIdx={setRetroIdx}
            />
          ))}
        </div>
      </div>

      {phases.length > 0 && (
        <div className="guide-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <div className="guide-title">ترتيب الاستيقاظ</div>
          <ol className="wake-order-list">
            {phases.map((role, i) => (
              <li key={i} style={{ color: Role.teamColor(role.team) }}>
                {role.emoji} {role.name}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="guide-actions">
        <button className="btn btn-danger" onClick={resetGame}>لعبة جديدة</button>
      </div>

      {infectIdx !== null && (
        <InfectModal
          infectorIdx={infectIdx}
          assignments={assignments}
          playerStatus={playerStatus}
          onInfect={(targetIdx) => { executeInfect(infectIdx, targetIdx); setInfectIdx(null); }}
          onClose={() => setInfectIdx(null)}
        />
      )}

      {retroIdx !== null && (
        <RetroSwapModal
          fromIdx={retroIdx}
          assignments={assignments}
          playerStatus={playerStatus}
          onSwap={(toIdx) => { doRetroSwap(retroIdx, toIdx); setRetroIdx(null); }}
          onClose={() => setRetroIdx(null)}
        />
      )}
    </div>
  );
}
