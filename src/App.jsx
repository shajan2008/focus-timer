import { useState, useEffect, use} from "react";
const TIMER_MODES = {
  WORK :{
    label : 'Focus(25m)',
    duration : 25 * 60
  },
  SHORT_BREAK : {
    label : 'Short Break(5m)',
    duration : 5 * 60,
  },
  LONG_BREAK : {
    label : 'Long Break(15m)',
    duration : 15 * 60,
  },
};
function App() {
  const [currentMode, setCurrentMode] = useState(`WORK`);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_MODES['WORK'].duration);
  const [isRunnig, setIsRunning] = useState(false);
  const [history, setHistory] = useState(() =>{
    try {
      const savedHistory = localStorage.getItem('focus_session_history');
      if(savedHistory != null){
        return JSON.parse(savedHistory);
      }
      else if(savedHistory === null){
        return [];
      }
    }
    catch (error){
      console.error(`${error} occured`);
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(`focus_session_history`, JSON.stringify(history));
  }, [history]);
  const totalDuration = TIMER_MODES[currentMode].duration;
  const minutes = Math.floor(secondsLeft/60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
  const circumference = 628.32;
  const strokeDashoffset = circumference * (1-(secondsLeft/totalDuration));
  function handleModeChange(selectedMode) {
    setCurrentMode(selectedMode);
    setSecondsLeft(TIMER_MODES[selectedMode].duration);
    setIsRunning(false);
  };
  function handleToggleTimer(){
    setIsRunning((prev) => !prev);
  };
  function handleReset(){
    setIsRunning(false);
    setSecondsLeft(TIMER_MODES[currentMode].duration);
  };
  if(secondsLeft === 0){
    setIsRunning(false);
    setHistory(currentMode);
    setSecondsLeft(TIMER_MODES[currentMode].duration);
  }
  useEffect(() => {
    if(isRunnig === false || secondsLeft <= 0) return;

    const id = setInterval(() =>{
      setSecondsLeft(prev => {
        if(prev > 1)
          return prev-1;
        else if(prev === 1){
          setIsRunning(false);
          const newSession = {
            id : Date.now(),
            mode : TIMER_MODES[currentMode].label,
            duration : TIMER_MODES[currentMode].duration / 60,
            completedAt : new Date().toLocaleTimeString([], {hour : '2-digit', minute : '2-digit'}),
          }
          setHistory(prevHistory => [newSession, ...prevHistory]);
          setSecondsLeft(TIMER_MODES[currentMode].duration);
        }
      })
    }, 1000); 
  return () => clearInterval(id);
}, [isRunnig])

  return(
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex items-center justify-between px-2"> 
          <h1 className="text-sm font-bold tracking-wider text-rose-500 uppercase flex items-center gap-2">
            Focus Engine
          </h1>
          <span className="text-xs font-medium px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
            0/4 Session
          </span>
        </header>
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm flex flex-col items-center gap-8"> 
          <nav className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/60 w-full">
            <button className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${currentMode === 'WORK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :  'text-slate-400 hover:text-slate-200'}`} onClick={() => handleModeChange('WORK')}>Work</button>
            <button className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${currentMode === 'SHORT_BREAK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :  'text-slate-400 hover:text-slate-200'}`} onClick={() => handleModeChange('SHORT_BREAK')}>Short Break</button>
            <button className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${currentMode === 'LONG_BREAK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :  'text-slate-400 hover:text-slate-200'}`} onClick={() => handleModeChange('LONG_BREAK')}>Long Break</button>
          </nav>
          <div className="relative flex items-center justify-center w-64 h-64 my-2">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-slate-800" cx={"128"} cy={"128"} r={"100"} stroke="currentColor" strokeWidth={"10"} fill="transparent"></circle>
              <circle className="text-rose-500 transition-all duration-1000 ease-linear" cx={"128"} cy={"128"} r={"100"} stroke="currentColor" strokeWidth={"10"} strokeLinecap="round" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-mono uppercase font-extrabold text-slate-100 tracking-tight">{formattedTime}</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 mt-1">stay focused</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full">
            <button className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-950/40 transition" onClick={handleToggleTimer}>{isRunnig ? 'PAUSE' : 'START FOCUS'}</button>
            <button className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 border border-slate-700/50 transition" onClick={handleReset}>RESET</button>
          </div>
        </section>
        <aside className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 w-full space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <h2>SESSION LOG</h2>
            <span>
              TOTAL : {history.length}
            </span>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <li className="p-4 text-center text-xs text-slate-500 italic">
                No completed focus session yet
              </li>
            ) : (
            history.map((session) => (
            <li 
            key={session.id}
            className="flex items-center justify-between p-3 bg-slate-950/60 border-slate-800/40 rounded-xl text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-200">{session.mode}</span>
                <span className="text-[10px] text-slate-500">{session.completedAt}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-mono font-medium">
                +{session.duration}m
              </span>
            </li>
            ))
            )}
          </ul>
        </aside>
      </div>
    </main>
  )
}
export default App;