import React, { useState, useEffect } from "react";
import {
  Activity,
  Utensils,
  Dumbbell,
  Moon,
  PlusCircle,
  Calendar,
  Search,
  Database,
  Trash2,
  ChevronUp,
} from "lucide-react";
import * as api from "./api";

/* =================== APP =================== */

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState(null);

  const refreshPlan = async () => {
    try {
      setError(null);
      const res = await api.fetchPlan();

      if (!res.data || !res.data.workouts) {
        await api.seedDB();
        const seeded = await api.fetchPlan();
        setPlanData(seeded.data);
      } else {
        setPlanData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Backend not reachable. Please refresh.");
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshPlan();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="p-4 text-center md:text-left">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              LeanBulk OS
            </span>
          </div>

          <div className="flex overflow-x-auto px-2 pb-2 gap-1">
            <NavBtn label="Stats" icon={<Activity size={18} />} active={activeTab==="dashboard"} onClick={()=>setActiveTab("dashboard")} />
            <NavBtn label="Tracker" icon={<Calendar size={18} />} active={activeTab==="tracker"} onClick={()=>setActiveTab("tracker")} />
            <NavBtn label="Diet" icon={<Utensils size={18} />} active={activeTab==="nutrition"} onClick={()=>setActiveTab("nutrition")} />
            <NavBtn label="Plan" icon={<Dumbbell size={18} />} active={activeTab==="training"} onClick={()=>setActiveTab("training")} />
            <NavBtn label="Recover" icon={<Moon size={18} />} active={activeTab==="recovery"} onClick={()=>setActiveTab("recovery")} />
            <NavBtn label="Foods" icon={<Database size={18} />} active={activeTab==="library"} onClick={()=>setActiveTab("library")} />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-3 pt-6">
        {activeTab === "dashboard" && planData && <DashboardSection data={planData} />}
        {activeTab === "training" && planData && (
          <TrainingSection workouts={planData.workouts} onUpdate={refreshPlan} />
        )}
        {activeTab === "nutrition" && planData && (
          <NutritionSection diet={planData.nutrition} />
        )}
        {activeTab === "recovery" && planData && (
          <RecoverySection items={planData.recovery} />
        )}
        {activeTab === "tracker" && <TrackerSection />}
        {activeTab === "library" && <FoodLibrarySection />}
      </main>
    </div>
  );
};

/* =================== UI HELPERS =================== */

const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
      active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// --- SECTIONS ---

const DashboardSection = ({ data }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <StatCard label="Current" value={`${data.profile.currentWeight} kg`} />
      <StatCard label="Target" value={`${data.profile.targetWeight} kg`} color="text-blue-400" />
      <StatCard label="TDEE" value={data.profile.tdee} color="text-emerald-400" />
    </div>
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h3 className="font-bold mb-4 text-slate-200">Phase Structure</h3>
      <div className="space-y-2">
        {data.profile.phases.map((phase, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-900 rounded border border-slate-700 text-sm md:text-base">
                <span className="text-slate-300">{phase.name}</span>
                <span className="font-mono text-emerald-400 font-bold">{phase.total} kcal</span>
            </div>
        ))}
      </div>
    </div>
  </div>
);

const TrainingSection = ({ workouts, onUpdate }) => {
    const [addingToDay, setAddingToDay] = useState(null);
    const [newEx, setNewEx] = useState({ name: '', sets: 3, reps: '10-12', rest: '60s' });

    const handleAdd = async (day) => {
        if(!newEx.name) return;
        await api.addExerciseToPlan(day, newEx);
        setAddingToDay(null);
        setNewEx({ name: '', sets: 3, reps: '10-12', rest: '60s' });
        onUpdate();
    };

    const handleDelete = async (day, exName) => {
        if(window.confirm(`Remove ${exName}?`)) {
            await api.deleteExerciseFromPlan(day, exName);
            onUpdate();
        }
    };

    return (
        <div className="space-y-4">
            {workouts && workouts.map((day, i) => (
                <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="p-4 flex justify-between items-center bg-slate-800/50">
                        <div>
                            <h3 className="text-blue-400 font-bold text-lg">{day.day}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">{day.title}</p>
                        </div>
                        <button 
                            onClick={() => setAddingToDay(addingToDay === day.day ? null : day.day)}
                            className="bg-slate-700 p-2 rounded-full hover:bg-slate-600"
                        >
                            {addingToDay === day.day ? <ChevronUp size={20}/> : <PlusCircle size={20}/>}
                        </button>
                    </div>

                    {addingToDay === day.day && (
                        <div className="p-4 bg-slate-900 border-y border-slate-700">
                            <h4 className="text-xs uppercase text-emerald-400 mb-3 font-bold">Add Exercise</h4>
                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <input placeholder="Name (e.g. Bench Press)" className="bg-slate-800 p-3 rounded text-sm text-white" value={newEx.name} onChange={e=>setNewEx({...newEx, name: e.target.value})} />
                                <div className="grid grid-cols-3 gap-2">
                                    <input placeholder="Sets" type="number" className="bg-slate-800 p-3 rounded text-sm" value={newEx.sets} onChange={e=>setNewEx({...newEx, sets: e.target.value})} />
                                    <input placeholder="Reps" className="bg-slate-800 p-3 rounded text-sm" value={newEx.reps} onChange={e=>setNewEx({...newEx, reps: e.target.value})} />
                                    <input placeholder="Rest" className="bg-slate-800 p-3 rounded text-sm" value={newEx.rest} onChange={e=>setNewEx({...newEx, rest: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={() => handleAdd(day.day)} className="w-full bg-emerald-600 py-3 rounded-lg text-sm font-bold">Add to Workout</button>
                        </div>
                    )}

                    <div className="divide-y divide-slate-700/50">
                        {day.exercises.map((ex, j) => (
                            <div key={j} className="p-4 flex justify-between items-center hover:bg-slate-700/20">
                                <div>
                                    <div className="font-medium text-slate-200">{ex.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {ex.sets} sets × {ex.reps} • {ex.rest} rest
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(day.day, ex.name)}
                                    className="text-slate-600 hover:text-red-400 p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const FoodLibrarySection = () => {
    const [foods, setFoods] = useState([]);
    const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

    const loadFoods = async () => {
        const { data } = await api.fetchFoods();
        setFoods(data);
    };

    useEffect(() => { loadFoods(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newFood.name || !newFood.calories) return;
        await api.addFood(newFood);
        setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
        loadFoods();
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this food permanently?")) {
            await api.deleteFood(id);
            loadFoods();
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-800 p-4 md:p-5 rounded-xl border border-slate-700">
                <h3 className="font-bold mb-4 flex items-center text-emerald-400 text-sm uppercase tracking-wide">
                    <PlusCircle className="mr-2 w-4"/> New Food Item
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none" 
                        placeholder="Food Name" 
                        value={newFood.name}
                        onChange={e => setNewFood({...newFood, name: e.target.value})}
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {['Cal', 'Prot', 'Carb', 'Fat'].map((lbl, i) => (
                            <input 
                                key={i}
                                type="number" 
                                placeholder={lbl} 
                                className="bg-slate-900 rounded-lg p-3 text-sm border border-slate-700 outline-none" 
                                value={newFood[lbl === 'Cal' ? 'calories' : lbl === 'Prot' ? 'protein' : lbl === 'Carb' ? 'carbs' : 'fat']} 
                                onChange={e => setNewFood({...newFood, [lbl === 'Cal' ? 'calories' : lbl === 'Prot' ? 'protein' : lbl === 'Carb' ? 'carbs' : 'fat']: e.target.value})} 
                            />
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm">
                        Save to Database
                    </button>
                </form>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-800/80 border-b border-slate-700">
                    <h3 className="font-bold text-sm text-slate-400 uppercase">Database Entries ({foods.length})</h3>
                </div>
                <div className="divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto">
                    {foods.map((f, i) => (
                        <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-700/20">
                            <div>
                                <span className="font-medium text-sm block text-slate-200">{f.name}</span>
                                <div className="text-xs text-slate-500 space-x-2 font-mono mt-0.5">
                                    <span className="text-blue-400">{f.calories} cal</span>
                                    <span className="text-emerald-500">{f.protein}g P</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(f._id)} className="text-slate-600 hover:text-red-400 p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Re-using Tracker, Nutrition, Recovery, StatCard from previous (they are fine, just ensure Delete works in Tracker)
const TrackerSection = () => {
    const [log, setLog] = useState({ items: [], total_calories: 0, total_protein: 0 });
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");

    const loadData = async () => {
        const [logRes, foodRes] = await Promise.all([api.fetchDailyLog(), api.fetchFoods()]);
        setLog(logRes.data);
        setFoods(foodRes.data);
    };

    useEffect(() => { loadData(); }, []);

    const handleAdd = async (food) => {
        await api.addToLog({ ...food, qty: 1 });
        loadData(); 
    };

    const handleDelete = async (index) => {
        await api.deleteFromLog(index);
        loadData();
    };

    const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                    <h2 className="text-slate-400 text-xs uppercase z-10 relative font-bold">Calories</h2>
                    <div className="text-2xl font-bold text-white mt-1 z-10 relative">{log.total_calories} / 2900</div>
                    <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500" style={{width: `${Math.min((log.total_calories/2900)*100, 100)}%`}}></div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                    <h2 className="text-slate-400 text-xs uppercase z-10 relative font-bold">Protein</h2>
                    <div className="text-2xl font-bold text-white mt-1 z-10 relative">{log.total_protein?.toFixed(1) || 0} / 160g</div>
                    <div className="absolute bottom-0 left-0 h-1.5 bg-emerald-500 transition-all duration-500" style={{width: `${Math.min((log.total_protein/160)*100, 100)}%`}}></div>
                </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Log food..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {search && (
                    <div className="max-h-60 overflow-y-auto space-y-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
                        {filteredFoods.map((f, i) => (
                            <button key={i} onClick={() => {handleAdd(f); setSearch('')}} className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg text-left text-sm group">
                                <span className="font-medium text-slate-200">{f.name}</span>
                                <div className="space-x-2 text-xs">
                                    <span className="text-emerald-400">{f.protein}g P</span>
                                    <span className="text-blue-400">{f.calories} cal</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 min-h-[300px] overflow-hidden">
                 <div className="p-4 border-b border-slate-700 bg-slate-800/80">
                    <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Today's Intake</h3>
                 </div>
                 {log.items.length === 0 ? (
                     <div className="text-center py-10 text-slate-600">
                         <Utensils className="mx-auto w-8 h-8 mb-2 opacity-50"/>
                         <p className="text-sm">No food logged today.</p>
                     </div>
                 ) : (
                     <div className="divide-y divide-slate-700/50">
                         {log.items.map((item, idx) => (
                             <div key={idx} className="flex justify-between items-center p-4 bg-slate-800/20">
                                 <div>
                                     <div className="font-medium text-sm text-slate-200">{item.name}</div>
                                     <div className="text-xs text-slate-500 flex space-x-2 mt-0.5">
                                         <span className="text-blue-400">{item.calories} cal</span>
                                         <span className="text-emerald-500">{item.protein}g prot</span>
                                     </div>
                                 </div>
                                 <button onClick={() => handleDelete(idx)} className="text-slate-600 hover:text-red-400 p-2">
                                     <Trash2 size={18} />
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        </div>
    );
};

const NutritionSection = ({ diet }) => {
    const [type, setType] = useState('nonVeg');
    const meals = diet ? diet[type] : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h2 className="text-lg md:text-xl font-bold flex items-center">Meal Plan</h2>
                <div className="flex bg-slate-900 rounded p-1">
                    <button onClick={() => setType('nonVeg')} className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${type==='nonVeg' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Non-Veg</button>
                    <button onClick={() => setType('veg')} className={`px-3 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${type==='veg' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Veg</button>
                </div>
            </div>
            <div className="grid gap-3 md:gap-4">
                {meals.map((meal, i) => (
                    <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">{meal.time}</span>
                            <span className="font-bold text-emerald-400 text-sm">{meal.cal} kcal</span>
                        </div>
                        <h4 className="font-bold text-blue-300 mb-1">{meal.meal}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{meal.items}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RecoverySection = ({ items }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold px-1">Recovery Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {items && items.map((item, i) => (
                <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">{item.title}</h3>
                    <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

const StatCard = ({ label, value, color = "text-white" }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
    <div className="text-xs uppercase text-slate-500 font-bold mb-1">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
  </div>
);

export default App;