import Welcome from './components/Welcome';
import Header from './components/Header';
import Toast from './components/Toast';
import Pronosticos from './components/tabs/Pronosticos';
import Cuadro from './components/tabs/Cuadro';
import Ranking from './components/tabs/Ranking';
import Organizador from './components/tabs/Organizador';
import { useQuiniela } from './hooks/useQuiniela';
import { buildCsv } from './lib/export';
import type { Side } from './types';

function App() {
  const q = useQuiniela();
  const hasName = !!q.me.name;

  if (!hasName) {
    return (
      <Welcome
        nameDraft={q.nameDraft}
        onNameDraft={q.setNameDraft}
        onConfirm={q.confirmName}
      />
    );
  }

  const downloadCSV = () => {
    const csv = buildCsv(q.roster, q.me, q.official, q.standings());
    q.download('quiniela_mundial_2026.csv', csv, 'text/csv;charset=utf-8');
  };
  const downloadJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      official: q.official,
      roster: q.roster,
      me: q.me,
      standings: q.standings(),
    };
    q.download('quiniela_mundial_2026.json', JSON.stringify(data, null, 2), 'application/json');
  };

  return (
    <div>
      <Header myName={q.me.name} tab={q.tab} onEditName={q.editName} onSetTab={q.setTab} />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '18px 14px 90px' }}>
        {q.tab === 'pronos' && (
          <Pronosticos
            me={q.me}
            official={q.official}
            round={q.round}
            onSetRound={q.setRound}
            isLocked={q.isLocked}
            onScoreChange={(id: number, side: Side, raw: string) => q.setScore('me', id, side, raw)}
            onAdv={(id: number, side: Side) => q.setAdv('me', id, side)}
            onChampion={q.setChampion}
            myCode={q.myCode()}
            onCopyCode={q.copyMyCode}
            onDownload={q.downloadMyPicks}
            onRestoreMyPicks={q.restoreMyPicks}
          />
        )}
        {q.tab === 'cuadro' && <Cuadro official={q.official} />}
        {q.tab === 'ranking' && (
          <Ranking roster={q.roster} me={q.me} official={q.official} standings={q.standings()} />
        )}
        {q.tab === 'org' && (
          <Organizador
            importText={q.importText}
            onImportText={q.setImportText}
            onDoImport={q.doImport}
            roster={q.roster}
            onRemovePlayer={q.removePlayer}
            official={q.official}
            round={q.round}
            onSetRound={q.setRound}
            now={q.now}
            onScoreChange={(id: number, side: Side, raw: string) => q.setScore('official', id, side, raw)}
            onAdv={(id: number, side: Side) => q.setAdv('official', id, side)}
            onToggleLock={q.toggleLock}
            officialCode={q.officialCode()}
            onCopyOfficialCode={q.copyOfficialCode}
            onDownloadCsv={downloadCSV}
            onDownloadJson={downloadJSON}
          />
        )}
      </div>
      <Toast message={q.toast} />
    </div>
  );
}

export default App;
