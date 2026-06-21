import { useState, useCallback } from 'react';
import { ROLES, Role } from './data/roles.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import Header from './components/Header.jsx';
import RolesView from './components/RolesView.jsx';
import PlayersView from './components/PlayersView.jsx';
import GuideView from './components/GuideView.jsx';
import './App.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [roles, setRoles] = useLocalStorage('loupgarou_roles', () => [...ROLES]);
  const [selections, setSelections] = useLocalStorage('loupgarou_selections', () => {
    const s = {};
    ROLES.forEach(r => { s[r.id] = r.defaultCount; });
    return s;
  });
  const [roleOrder, setRoleOrder] = useLocalStorage('loupgarou_roleOrder', () => ROLES.map(r => r.id));
  const [players, setPlayers] = useLocalStorage('loupgarou_players', []);
  const [assignments, setAssignments] = useLocalStorage('loupgarou_assignments', []);
  const [playerStatus, setPlayerStatus] = useLocalStorage('loupgarou_playerStatus', []);
  const [currentView, setCurrentView] = useLocalStorage('loupgarou_currentView', 'roles');

  const getNightPhases = useCallback(() => {
    return roles.filter(r =>
      r.wakeUp && r.nightOrder != null &&
      assignments.some((a, i) => a.role.id === r.id && playerStatus[i] !== 'dead')
    ).sort((a, b) => a.nightOrder - b.nightOrder);
  }, [roles, assignments, playerStatus]);

  const totalSelected = useCallback(() => {
    return Object.values(selections).reduce((a, b) => a + b, 0);
  }, [selections]);

  const selectedRolesArr = useCallback(() => {
    return roles.filter(r => selections[r.id] > 0)
      .flatMap(r => Array(selections[r.id]).fill(r));
  }, [roles, selections]);

  const setCount = useCallback((id, delta) => {
    const role = roles.find(r => r.id === id);
    if (!role) return;
    const cur = selections[id] || 0;
    const next = cur + delta;
    if (next < role.minCount || next > role.maxCount) return;
    setSelections(s => ({ ...s, [id]: next }));
  }, [roles, selections]);

  const toggleWake = useCallback((id, on) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = new Role({ ...r, wakeUp: on });
      if (on && updated.nightOrder == null) {
        const maxOrder = prev.reduce((mx, r2) => Math.max(mx, r2.nightOrder ?? 0), 0);
        updated.nightOrder = maxOrder + 1;
      }
      return updated;
    }));
  }, []);

  const addPlayer = useCallback(() => {
    if (players.length >= totalSelected()) return;
    setPlayers(p => [...p, `Joueur ${p.length + 1}`]);
  }, [players, totalSelected]);

  const removePlayer = useCallback((index) => {
    setPlayers(p => p.filter((_, i) => i !== index));
  }, []);

  const updatePlayerName = useCallback((index, name) => {
    setPlayers(p => p.map((n, i) => i === index ? name : n));
  }, []);

  const assignRoles = useCallback(() => {
    let pool = selectedRolesArr();
    const villager = roles.find(r => r.id === 'villager');
    while (pool.length < players.length) {
      pool.push(villager);
    }
    const shuffled = shuffle(pool);
    const as = players.map((name, i) => ({
      player: name,
      role: shuffled[i],
    }));
    setAssignments(as);
    setPlayerStatus(as.map(() => 'alive'));
    setCurrentView('guide');
  }, [players, selectedRolesArr, roles]);

  const killPlayer = useCallback((index) => {
    setAssignments(prev => {
      const a = prev[index];
      if (!a) return prev;
      const status = playerStatus[index];
      if (status === 'dead') return prev;

      const next = [...prev];
      if (a.role.id === 'elder' && status === 'alive') {
        setPlayerStatus(s => s.map((st, i) => i === index ? 'wounded' : st));
        return prev;
      }

      if (a.role.id === 'infectedwolf' && !a.infectedUsed) {
        next[index] = { ...next[index], infectedUsed: true };
        const targets = prev
          .map((t, i) => ({ ...t, idx: i }))
          .filter(t => t.idx !== index && playerStatus[t.idx] !== 'dead');
        if (targets.length > 0) {
          let msg = 'الذيبة المصابة تعض واحد. اختار اللي يعضّو:\n';
          targets.forEach((t, i) => {
            msg += `${i + 1}. ${t.player} (${t.role.emoji} ${t.role.name})\n`;
          });
          const choice = prompt(msg);
          const idx = parseInt(choice) - 1;
          if (!isNaN(idx) && idx >= 0 && idx < targets.length) {
            const ww = roles.find(r => r.id === 'werewolf');
            next[targets[idx].idx] = { ...next[targets[idx].idx], role: ww };
          }
        }
      }

      setPlayerStatus(s => s.map((st, i) => i === index ? 'dead' : st));
      return next;
    });
  }, [playerStatus, roles]);

  const executeInfect = useCallback((infectorIdx, targetIdx) => {
    setAssignments(prev => {
      const next = [...prev];
      next[infectorIdx] = { ...next[infectorIdx], usedPower: true };
      next[targetIdx] = { ...next[targetIdx], infected: true };
      return next;
    });
  }, []);

  const doRetroSwap = useCallback((fromIdx, toIdx) => {
    setAssignments(prev => {
      const next = [...prev];
      const villager = roles.find(r => r.id === 'villager');
      const fromRole = next[fromIdx].role;
      next[fromIdx] = { ...next[fromIdx], role: next[toIdx].role, usedPower: true };
      next[toIdx] = { ...next[toIdx], role: villager };
      return next;
    });
  }, [roles]);

  const restoreDefaults = useCallback(() => {
    setRoles([...ROLES]);
    const s = {};
    ROLES.forEach(r => { s[r.id] = r.defaultCount; });
    setSelections(s);
    setRoleOrder(ROLES.map(r => r.id));
    setPlayers([]);
    setAssignments([]);
    setPlayerStatus([]);
    setCurrentView('roles');
  }, []);

  const resetGame = useCallback(() => {
    setAssignments([]);
    setPlayerStatus([]);
    setCurrentView('roles');
  }, []);

  const saveNightOrder = useCallback((ordered) => {
    setRoles(prev => prev.map(r => {
      const idx = ordered.indexOf(r.id);
      if (idx !== -1) {
        return new Role({ ...r, nightOrder: idx + 1 });
      }
      return r;
    }));
  }, []);

  const navigate = useCallback((view) => {
    if (view === 'players' && totalSelected() === 0) return;
    if (view === 'guide' && assignments.length === 0) return;
    setCurrentView(view);
  }, [totalSelected, assignments]);

  const createRole = useCallback((roleData) => {
    const id = 'custom_' + Date.now();
    const nr = new Role({ ...roleData, id, nightOrder: null, wakeUp: false, ability: 'Rôle personnalisé' });
    setRoles(prev => [...prev, nr]);
    setSelections(s => ({ ...s, [id]: roleData.defaultCount || 1 }));
    setRoleOrder(prev => [...prev, id]);
  }, []);

  const updateRole = useCallback((id, data) => {
    setRoles(prev => prev.map(r => r.id === id ? new Role({ ...r, ...data }) : r));
    if (data.defaultCount != null) {
      setSelections(s => ({ ...s, [id]: data.defaultCount }));
    }
  }, []);

  const deleteRole = useCallback((id) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    setSelections(s => { const n = { ...s }; delete n[id]; return n; });
    setRoleOrder(prev => prev.filter(rid => rid !== id));
  }, []);

  const moveRoleOrder = useCallback((id, dir) => {
    setRoleOrder(prev => {
      const idx = prev.indexOf(id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const swap = idx + dir;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  return (
    <div className="app">
      <Header
        currentView={currentView}
        navigate={navigate}
        hasPlayers={totalSelected() > 0}
        hasAssignments={assignments.length > 0}
      />
      <main className="main-content">
        {currentView === 'roles' && (
          <RolesView
            roles={roles}
            selections={selections}
            roleOrder={roleOrder}
            totalSelected={totalSelected()}
            setCount={setCount}
            toggleWake={toggleWake}
            navigate={navigate}
            createRole={createRole}
            updateRole={updateRole}
            deleteRole={deleteRole}
            saveNightOrder={saveNightOrder}
            moveRoleOrder={moveRoleOrder}
            restoreDefaults={restoreDefaults}
          />
        )}
        {currentView === 'players' && (
          <PlayersView
            players={players}
            totalSelected={totalSelected()}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            updatePlayerName={updatePlayerName}
            assignRoles={assignRoles}
            navigate={navigate}
          />
        )}
        {currentView === 'guide' && (
          <GuideView
            assignments={assignments}
            playerStatus={playerStatus}
            getNightPhases={getNightPhases}
            killPlayer={killPlayer}
            executeInfect={executeInfect}
            doRetroSwap={doRetroSwap}
            resetGame={resetGame}
          />
        )}
      </main>
    </div>
  );
}
