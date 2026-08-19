import { useState, useEffect} from "react";
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
            <button className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 transition">Work</button>
            <button className="flex-1 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition">Short Break</button>
            <button className="flex-1 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-slate-200 transition">Long Break</button>
          </nav>
          <div className="relative flex items-center justify-center w-64 h-64 my-2">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-slate-800" cx={"128"} cy={"128"} r={"100"} stroke="currentColor" strokeWidth={"10"} fill="transparent"></circle>
              <circle className="text-rose-500 transition-all duration-500" cx={"128"} cy={"128"} r={"100"} stroke="currentColor" strokeWidth={"10"} strokeLinecap="round" fill="transparent"></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-mono uppercase font-extrabold text-slate-100 tracking-tight">25:00</span>
              <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 mt-1">stay focused</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full">
            <button className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-950/40 transition">START/PAUSE</button>
            <button className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 border border-slate-700/50 transition">RESET</button>
          </div>
        </section>
        <aside className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 w-full space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <h2>SESSION LOG</h2>
            <span>
              TOTAL : 0
            </span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-3 bg-slate-950/60 border-slate-800/40 rounded-xl text-xs"></li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
export default App;