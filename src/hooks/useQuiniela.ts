import { useCallback, useEffect, useRef, useState } from 'react';
import { buildMatches } from '../data/tournament';
import { buildStandings, champOf, isLocked as isLockedFn } from '../lib/logic';
import { dec, enc } from '../lib/codec';
import { loadMe, loadOfficial, loadRoster, saveMe, saveOfficial, saveRoster } from '../lib/storage';
import type { ImportedCode, LockState, Me, Official, Pick, Side, Tab } from '../types';

const EMPTY_ME: Me = { name: '', champion: '', picks: {} };
const EMPTY_OFFICIAL: Official = { results: {}, locks: {}, standings: [], updatedAt: null };

export function useQuiniela() {
  const [me, setMe] = useState<Me>(() => loadMe() ?? EMPTY_ME);
  const [official, setOfficial] = useState<Official>(() => loadOfficial() ?? EMPTY_OFFICIAL);
  const [roster, setRoster] = useState<Me[]>(() => loadRoster() ?? []);
  const [tab, setTab] = useState<Tab>('pronos');
  const [round, setRound] = useState<string>('R32');
  const [nameDraft, setNameDraft] = useState('');
  const [importText, setImportText] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const persistMe = useCallback((next: Me) => { setMe(next); saveMe(next); }, []);
  const persistOfficial = useCallback((next: Official) => { setOfficial(next); saveOfficial(next); }, []);
  const persistRoster = useCallback((next: Me[]) => { setRoster(next); saveRoster(next); }, []);

  const setScore = useCallback((scope: 'me' | 'official', id: number, side: Side, raw: string) => {
    const v = raw === '' ? null : Math.max(0, Math.min(20, parseInt(raw, 10) || 0));
    if (scope === 'me') {
      const next = { ...me.picks };
      const cur: Pick = { ...(next[id] || { a: null, b: null }) };
      cur[side] = v;
      next[id] = cur;
      persistMe({ ...me, picks: next });
    } else {
      const next = { ...official.results };
      const cur: Pick = { ...(next[id] || { a: null, b: null }) };
      cur[side] = v;
      next[id] = cur;
      persistOfficial({ ...official, results: next });
    }
  }, [me, official, persistMe, persistOfficial]);

  const setAdv = useCallback((scope: 'me' | 'official', id: number, side: Side) => {
    if (scope === 'me') {
      const next = { ...me.picks };
      next[id] = { ...(next[id] || { a: null, b: null }), adv: side };
      persistMe({ ...me, picks: next });
    } else {
      const next = { ...official.results };
      next[id] = { ...(next[id] || { a: null, b: null }), adv: side };
      persistOfficial({ ...official, results: next });
    }
  }, [me, official, persistMe, persistOfficial]);

  const toggleLock = useCallback((id: number) => {
    const locks = { ...official.locks };
    const auto = Date.now() >= Date.parse(MATCHES[id].ko);
    const cur = locks[id];
    let nx: LockState;
    if (cur === 'closed') nx = 'open';
    else if (cur === 'open') nx = 'closed';
    else nx = auto ? 'open' : 'closed';
    locks[id] = nx;
    persistOfficial({ ...official, locks });
  }, [official, persistOfficial]);

  const isLocked = useCallback((id: number) => isLockedFn(id, official.locks, now), [official.locks, now]);

  const setChampion = useCallback((code: string) => {
    persistMe({ ...me, champion: code });
  }, [me, persistMe]);

  const editName = useCallback(() => {
    setNameDraft(me.name);
    persistMe({ ...me, name: '' });
  }, [me, persistMe]);

  const confirmName = useCallback(() => {
    const n = nameDraft.trim();
    if (!n) { toast('Escribe tu nombre 🙂'); return; }
    persistMe({ ...me, name: n });
    setNameDraft('');
  }, [nameDraft, me, persistMe, toast]);

  const myCode = useCallback(() => enc({ t: 'p', n: me.name, c: me.champion, k: me.picks }), [me]);
  const officialCode = useCallback(() => enc({
    t: 'o', r: official.results, l: official.locks, c: champOf(official.results),
    s: buildStandings(roster, me, official), u: Date.now(),
  }), [official, roster, me]);

  const copy = useCallback((text: string, okMsg?: string) => {
    const done = () => toast(okMsg || 'Copiado ✓');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }, [toast]);

  const download = useCallback((name: string, text: string, mime: string) => {
    try {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch { /* ignore */ }
  }, []);

  const copyMyCode = useCallback(() => copy(myCode(), 'Tu código está copiado ✓'), [copy, myCode]);
  const downloadMyPicks = useCallback(() => {
    const n = (me.name || 'jugador').replace(/[^a-z0-9]/gi, '_');
    download('quiniela_' + n + '.json', JSON.stringify({ t: 'p', n: me.name, c: me.champion, k: me.picks }, null, 2), 'application/json');
    toast('Archivo descargado ✓');
  }, [me, download, toast]);
  const copyOfficialCode = useCallback(() => copy(officialCode(), 'Código oficial copiado ✓'), [copy, officialCode]);

  const doImport = useCallback(() => {
    const tokens = importText.split(/\s+/).filter((t) => t.indexOf('QM26.') === 0);
    if (!tokens.length) { toast('No encontré códigos QM26. 🤔'); return; }
    let added = 0, off = 0;
    let nextRoster = [...roster];
    let nextOfficial = official;
    tokens.forEach((tk) => {
      const o = dec(tk) as ImportedCode | null;
      if (!o) return;
      if (o.t === 'p' && o.n) {
        nextRoster = nextRoster.filter((r) => r.name.toLowerCase() !== o.n.toLowerCase());
        nextRoster.push({ name: o.n, champion: o.c || '', picks: o.k || {} });
        added++;
      } else if (o.t === 'o') {
        nextOfficial = { results: o.r || {}, locks: o.l || {}, standings: o.s || [], updatedAt: o.u || null };
        off++;
      }
    });
    persistRoster(nextRoster);
    persistOfficial(nextOfficial);
    setImportText('');
    toast((added ? added + ' pronóstico(s) ' : '') + (off ? '· resultados oficiales ' : '') + 'importado(s) ✓');
  }, [importText, roster, official, persistRoster, persistOfficial, toast]);

  const removePlayer = useCallback((name: string) => {
    persistRoster(roster.filter((r) => r.name !== name));
  }, [roster, persistRoster]);

  const standings = useCallback(() => buildStandings(roster, me, official), [roster, me, official]);

  return {
    me, official, roster, tab, round, nameDraft, importText, toast: toastMsg, now,
    setTab, setRound, setNameDraft, setImportText,
    setScore, setAdv, toggleLock, isLocked, setChampion,
    editName, confirmName, myCode, officialCode,
    copyMyCode, downloadMyPicks, copyOfficialCode, doImport, removePlayer,
    standings, download,
  };
}

function fallbackCopy(text: string) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  } catch { /* ignore */ }
}

const MATCHES = buildMatches();
