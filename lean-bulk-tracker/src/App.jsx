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
  CheckCircle,
  Clock,
  History,
  X,
  Droplets,
  Scale,
  Flame,
  AlertCircle
} from "lucide-react";
import * as api from "./api";

/* =================== APP COMPONENT =================== */

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [dailyLog, setDailyLog] = useState({ 
    items: [], 
    completed_exercises: [], 
    total_calories: 0, 
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    water_ml: 0,
    body_weight: 0
  });
  const [error, setError] = useState(null);

  // Initial Data Load
  const init = async () => {
    try {
      setLoading(true);
      const [planRes, logRes] = await Promise.all([
        api.fetchPlan(),
        api.fetchDailyLog()
      ]);
      setPlanData(planRes.data);
      setDailyLog(logRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Backend not reachable. Ensure Flask is running.");
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const refreshLog = async () => {
    const res = await api.fetchDailyLog();
    setDailyLog(res.data);
  };

  const refreshPlan = async () => {
      const res = await api.fetchPlan();
      setPlanData(res.data);
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono animate-pulse">Loading OS...</div>;
  if (error) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 font-sans selection:bg-blue-500/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-700 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="p-4 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <Activity className="text-blue-400" size={24} />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              LeanBulk OS
            </span>
          </div>

          <div className="flex overflow-x-auto px-2 pb-2 md:pb-0 gap-1 no-scrollbar">
            <NavBtn label="Dash" icon={<Activity size={18} />} active={activeTab==="dashboard"} onClick={()=>setActiveTab("dashboard")} />
            <NavBtn label="Track" icon={<Utensils size={18} />} active={activeTab==="tracker"} onClick={()=>setActiveTab("tracker")} />
            <NavBtn label="Train" icon={<Dumbbell size={18} />} active={activeTab==="training"} onClick={()=>setActiveTab("training")} />
            <NavBtn label="History" icon={<History size={18} />} active={activeTab==="history"} onClick={()=>setActiveTab("history")} />
            <NavBtn label="Recov" icon={<Moon size={18} />} active={activeTab==="recovery"} onClick={()=>setActiveTab("recovery")} />
            <NavBtn label="DB" icon={<Database size={18} />} active={activeTab==="library"} onClick={()=>setActiveTab("library")} />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-3 pt-6">
        {activeTab === "dashboard" && planData && (
            <DashboardSection 
                data={planData} 
                dailyLog={dailyLog} 
                onUpdateLog={refreshLog}
                onUpdatePlan={refreshPlan}
            />
        )}
        
        {activeTab === "training" && planData && (
          <TrainingSection 
            workouts={planData.workouts} 
            dailyLog={dailyLog}
            onUpdatePlan={init} 
            onUpdateLog={refreshLog}
          />
        )}
        
        {activeTab === "tracker" && planData && (
          <TrackerSection 
            dailyLog={dailyLog} 
            targetCals={planData.profile.phases[0].total}
            onUpdate={refreshLog} 
          />
        )}

        {activeTab === "history" && <HistorySection />}

        {activeTab === "recovery" && planData && (
          <RecoverySection items={planData.recovery} />
        )}
        
        {activeTab === "library" && <FoodLibrarySection />}
      </main>
    </div>
  );
};

/* =================== SUB-COMPONENTS =================== */

const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 md:py-4 border-b-2 transition-colors whitespace-nowrap ${
      active ? "border-blue-500 text-blue-400 bg-slate-800" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// --- DASHBOARD ---
const DashboardSection = ({ data, dailyLog, onUpdateLog, onUpdatePlan }) => {
    const targetCals = data.profile.phases[0].total;
    const targetProt = 180; 
    
    const calsRemaining = targetCals - dailyLog.total_calories;
    const protRemaining = targetProt - dailyLog.total_protein;

    const [weightInput, setWeightInput] = useState("");

    const handleWeightLog = async () => {
        if(!weightInput) return;
        await api.updateWeight(weightInput);
        setWeightInput("");
        onUpdateLog();
        onUpdatePlan();
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <StatCard label="Current Weight" value={`${data.profile.currentWeight} kg`} icon={<Scale size={16} className="text-slate-400"/>} />
                <StatCard label="Target Weight" value={`${data.profile.targetWeight} kg`} color="text-blue-400" />
                <StatCard label="Calories Left" value={`${calsRemaining} kcal`} color={calsRemaining < 0 ? "text-red-400" : "text-emerald-400"} sub={calsRemaining < 0 ? "Over Limit" : "Remaining"}/>
                <StatCard label="Protein Left" value={`${Math.max(0, protRemaining).toFixed(1)} g`} color={protRemaining <= 0 ? "text-emerald-400" : "text-orange-400"} sub={protRemaining <= 0 ? "Goal Hit!" : "To Go"}/>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200">Daily Weigh-In</h3>
                        <p className="text-xs text-slate-400">Log your morning weight</p>
                    </div>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                     <input 
                        type="number" 
                        placeholder="kg" 
                        value={weightInput}
                        onChange={(e)=>setWeightInput(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 w-full md:w-24 text-center text-white outline-none focus:border-blue-500"
                     />
                     <button 
                        onClick={handleWeightLog}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-sm transition"
                     >
                        Log
                     </button>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-4 text-slate-200 flex items-center gap-2">
                        <Utensils size={18} className="text-emerald-400"/> Nutrition Overview
                    </h3>
                    {data.nutrition.nonVeg.map((meal, i) => (
                        <div key={i} className="mb-3 pb-3 border-b border-slate-700/50 last:border-0 last:pb-0">
                            <div className="flex justify-between text-sm">
                            <span className="font-semibold text-blue-300">{meal.meal}</span>
                            <span className="text-slate-400">{meal.cal} kcal</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{meal.items}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-4 text-slate-200 flex items-center gap-2">
                        <Activity size={18} className="text-blue-400"/> Active Phase
                    </h3>
                    <div className="space-y-3">
                        {data.profile.phases.map((phase, i) => (
                            <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 flex justify-between items-center">
                                <span className="text-slate-300 font-medium">{phase.name}</span>
                                <span className="font-mono text-emerald-400">{phase.total} kcal</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TRACKER ---
const TrackerSection = ({ dailyLog, targetCals = 3000, onUpdate }) => {
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const targetProt = 180;

    useEffect(() => { 
        api.fetchFoods().then(res => setFoods(res.data)); 
    }, []);

    const initiateAdd = (food) => {
        setSelectedFood(food);
        setQuantity(1);
    };

    const confirmAdd = async () => {
        if (!selectedFood) return;
        const totalCalories = Math.round(Number(selectedFood.calories) * quantity);
        const totalProtein = Number((Number(selectedFood.protein) * quantity).toFixed(1));
        const totalCarbs = Number(((Number(selectedFood.carbs) || 0) * quantity).toFixed(1));
        const totalFat = Number(((Number(selectedFood.fat) || 0) * quantity).toFixed(1));

        const itemToAdd = {
            ...selectedFood,
            name: `${selectedFood.name} (x${quantity})`, 
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
            qty: quantity
        };

        await api.addToLog(itemToAdd);
        onUpdate();
        setSelectedFood(null);
        setSearch("");
    };

    const handleDelete = async (index) => {
        await api.deleteFromLog(index);
        onUpdate();
    };

    const handleWater = async (amt) => {
        await api.updateWater(amt);
        onUpdate();
    }

    const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 relative">
            {selectedFood && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-sm shadow-2xl relative">
                        <button onClick={() => setSelectedFood(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                        <h3 className="text-xl font-bold text-white mb-1">{selectedFood.name}</h3>
                        <p className="text-slate-400 text-sm mb-6">Base: {selectedFood.calories} cal • {selectedFood.protein}g P</p>

                        <div className="mb-6">
                            <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Quantity / Servings</label>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))} className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xl">-</button>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-600 rounded-lg h-12 text-center text-lg font-bold text-emerald-400 outline-none"/>
                                <button onClick={() => setQuantity(q => q + 0.5)} className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xl">+</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setSelectedFood(null)} className="py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200">Cancel</button>
                            <button onClick={confirmAdd} className="py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Add Food</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden flex justify-between items-center">
                    <div className="z-10 relative">
                        <h2 className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-2"><Flame size={14}/> Calories</h2>
                        <div className="text-2xl font-bold text-white">
                            {dailyLog.total_calories} <span className="text-sm text-slate-500 font-normal">/ {targetCals}</span>
                        </div>
                        <div className="text-xs text-blue-400 font-mono mt-1">{targetCals - dailyLog.total_calories} remaining</div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-700">
                        <div className="h-full bg-blue-500 transition-all duration-700" style={{width: `${Math.min((dailyLog.total_calories/targetCals)*100, 100)}%`}}></div>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden flex justify-between items-center">
                    <div className="z-10 relative">
                        <h2 className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-2"><Dumbbell size={14}/> Protein</h2>
                        <div className="text-2xl font-bold text-white">
                            {Number(dailyLog.total_protein).toFixed(1)}g <span className="text-sm text-slate-500 font-normal">/ {targetProt}g</span>
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-1">{Math.max(0, (targetProt - dailyLog.total_protein)).toFixed(1)}g to goal</div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-700">
                        <div className="h-full bg-emerald-500 transition-all duration-700" style={{width: `${Math.min((dailyLog.total_protein/targetProt)*100, 100)}%`}}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 md:col-span-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-blue-400 text-xs font-bold uppercase flex items-center gap-2"><Droplets size={14}/> Hydration</h3>
                        <span className="text-white font-bold">{dailyLog.water_ml || 0} ml</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleWater(250)} className="flex-1 bg-blue-600/80 hover:bg-blue-500 py-2 rounded text-xs font-bold text-white transition">+ 250ml</button>
                        <button onClick={() => handleWater(-250)} className="px-3 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs">-</button>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 md:col-span-2 flex justify-around items-center">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase mb-1">Carbs</div>
                        <div className="text-xl font-bold text-white">{Number(dailyLog.total_carbs || 0).toFixed(1)}g</div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700"></div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase mb-1">Fats</div>
                        <div className="text-xl font-bold text-white">{Number(dailyLog.total_fat || 0).toFixed(1)}g</div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700"></div>
                    <div className="text-center">
                         <div className="text-xs text-slate-500 uppercase mb-1">Protein</div>
                         <div className="text-xl font-bold text-emerald-400">{Number(dailyLog.total_protein || 0).toFixed(1)}g</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative z-20">
                <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search food database..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                {search && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-slate-800 rounded-lg border border-slate-600 shadow-xl z-30">
                        {filteredFoods.length > 0 ? filteredFoods.map((f, i) => (
                            <button key={i} onClick={() => initiateAdd(f)} className="w-full flex justify-between items-center p-3 hover:bg-slate-700 border-b border-slate-700/50 last:border-0 text-left text-sm group transition">
                                <span className="font-medium text-slate-200">{f.name}</span>
                                <div className="space-x-3 text-xs">
                                    <span className="text-emerald-400 font-mono">{f.protein}g P</span>
                                    <span className="text-blue-400 font-mono">{f.calories} cal</span>
                                </div>
                            </button>
                        )) : (
                            <div className="p-4 text-center text-slate-500 text-sm">No food found. Add it in Library.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 min-h-[300px]">
                 <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Today's Intake</h3>
                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{dailyLog.items.length} items</span>
                 </div>
                 {dailyLog.items.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                         <Utensils className="w-10 h-10 mb-3 opacity-20"/>
                         <p className="text-sm">Log your first meal</p>
                     </div>
                 ) : (
                     <div className="divide-y divide-slate-700/50">
                         {dailyLog.items.map((item, idx) => (
                             <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-700/10 transition group">
                                 <div>
                                     <div className="font-medium text-sm text-slate-200">{item.name}</div>
                                     <div className="text-xs text-slate-500 flex space-x-3 mt-0.5 font-mono">
                                         <span className="text-blue-400">{item.calories} cal</span>
                                         <span className="text-emerald-500">{item.protein}g P</span>
                                         <span className="text-slate-500">{Number(item.carbs || 0).toFixed(1)}g C</span>
                                         <span className="text-slate-500">{Number(item.fat || 0).toFixed(1)}g F</span>
                                     </div>
                                 </div>
                                 {/* MODIFIED: Visible on mobile, hover on desktop */}
                                 <button onClick={() => handleDelete(idx)} className="text-slate-500 hover:text-red-400 p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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

// --- TRAINING SECTION (UPDATED) ---
const TrainingSection = ({ workouts, dailyLog, onUpdatePlan, onUpdateLog }) => {
    const [addingToDay, setAddingToDay] = useState(null);
    const [newEx, setNewEx] = useState({ name: '', sets: 3, reps: '10-12', rest: '60s' });
    const completedSet = new Set(dailyLog.completed_exercises?.map(e => e.name) || []);

    const handleToggleComplete = async (exName, dayLabel) => {
      await api.toggleExerciseLog(exName, dayLabel);
      onUpdateLog();
    };

    const handleAdd = async (day) => {
        if(!newEx.name) return;
        await api.addExerciseToPlan(day, newEx);
        setAddingToDay(null);
        setNewEx({ name: '', sets: 3, reps: '10-12', rest: '60s' });
        onUpdatePlan();
    };

    const handleDelete = async (day, exName) => {
        // Simple confirmation before deleting
        if(window.confirm(`Are you sure you want to remove "${exName}" from the ${day} workout?`)) {
            await api.deleteExerciseFromPlan(day, exName);
            onUpdatePlan();
        }
    };

    return (
        <div className="space-y-4">
            {workouts && workouts.map((day, i) => (
                <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700">
                        <div>
                            <h3 className="text-blue-400 font-bold text-lg">{day.day}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">{day.title}</p>
                        </div>
                        <button 
                            onClick={() => setAddingToDay(addingToDay === day.day ? null : day.day)} 
                            className="bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition"
                        >
                            {addingToDay === day.day ? <ChevronUp size={20}/> : <PlusCircle size={20}/>}
                        </button>
                    </div>

                    {/* Add Exercise Form (Responsive) */}
                    {addingToDay === day.day && (
                        <div className="p-4 bg-slate-900 border-b border-slate-700 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs uppercase text-emerald-400 mb-3 font-bold">Add New Exercise</h4>
                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <input 
                                    placeholder="Name (e.g. Bench Press)" 
                                    className="bg-slate-800 p-3 rounded text-sm text-white border border-slate-700 focus:border-emerald-500 outline-none" 
                                    value={newEx.name} 
                                    onChange={e=>setNewEx({...newEx, name: e.target.value})} 
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <input placeholder="Sets" type="number" className="bg-slate-800 p-2 rounded text-sm border border-slate-700 outline-none text-center" value={newEx.sets} onChange={e=>setNewEx({...newEx, sets: e.target.value})} />
                                    <input placeholder="Reps" className="bg-slate-800 p-2 rounded text-sm border border-slate-700 outline-none text-center" value={newEx.reps} onChange={e=>setNewEx({...newEx, reps: e.target.value})} />
                                    <input placeholder="Rest" className="bg-slate-800 p-2 rounded text-sm border border-slate-700 outline-none text-center" value={newEx.rest} onChange={e=>setNewEx({...newEx, rest: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={() => handleAdd(day.day)} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-bold transition">Add to Workout</button>
                        </div>
                    )}

                    {/* Exercise List */}
                    <div className="divide-y divide-slate-700/50">
                        {day.exercises.map((ex, j) => {
                            const isDone = completedSet.has(ex.name);
                            return (
                                <div key={j} className={`p-4 flex justify-between items-center transition-all duration-300 group ${isDone ? 'bg-emerald-900/10' : 'hover:bg-slate-700/20'}`}>
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <button onClick={() => handleToggleComplete(ex.name, day.day)} className={`flex-shrink-0 p-2 rounded-full border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 text-transparent hover:border-emerald-500'}`}>
                                            <CheckCircle size={18} fill={isDone ? "currentColor" : "none"} />
                                        </button>
                                        <div className={`min-w-0 ${isDone ? "opacity-50" : "opacity-100"}`}>
                                            <div className={`font-medium text-slate-200 truncate ${isDone ? 'line-through decoration-slate-500' : ''}`}>{ex.name}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                                                <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 whitespace-nowrap">{ex.sets} sets</span>
                                                <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 whitespace-nowrap">{ex.reps}</span>
                                                <span className="flex items-center gap-1 whitespace-nowrap"><Clock size={10}/> {ex.rest}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* DELETE BUTTON: Always visible on mobile (opacity-100), hidden on desktop until hover (md:opacity-0) */}
                                    {!isDone && (
                                        <button 
                                            onClick={() => handleDelete(day.day, ex.name)} 
                                            className="ml-2 text-slate-500 hover:text-red-400 p-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity"
                                            title="Remove Exercise"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- HISTORY SECTION ---
const HistorySection = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.fetchHistory();
      setHistory(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center p-10 text-slate-500">Loading history...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Activity Log</h2>
      {history.length === 0 && <p className="text-slate-500">No history found yet.</p>}
      
      <div className="space-y-4">
        {history.map((dayLog, i) => (
          <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Calendar className="text-blue-400" size={18} />
                 <span className="font-bold text-slate-200">{dayLog.date}</span>
               </div>
               <div className="text-xs text-slate-400 font-mono flex gap-3">
                 <span>{dayLog.total_calories} kcal</span>
                 <span>{Number(dayLog.total_protein || 0).toFixed(1)}g P</span>
                 {dayLog.body_weight > 0 && <span className="text-emerald-400">{dayLog.body_weight} kg</span>}
               </div>
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
               <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <Dumbbell size={14} /> Workouts Completed
                  </h4>
                  {(!dayLog.completed_exercises || dayLog.completed_exercises.length === 0) ? (
                    <span className="text-sm text-slate-600 italic">Rest day or not tracked.</span>
                  ) : (
                    <ul className="space-y-2">
                      {dayLog.completed_exercises.map((ex, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-emerald-300">
                          <CheckCircle size={14} />
                          {ex.name}
                        </li>
                      ))}
                    </ul>
                  )}
               </div>

               <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <Utensils size={14} /> Nutrition
                  </h4>
                  {(!dayLog.items || dayLog.items.length === 0) ? (
                     <span className="text-sm text-slate-600 italic">No food logged.</span>
                  ) : (
                    <div className="space-y-2">
                      {dayLog.items.map((item, k) => (
                        <div key={k} className="flex justify-between text-sm text-slate-300 border-b border-slate-700/50 pb-1 last:border-0">
                          <span>{item.name}</span>
                          <span className="text-slate-500 text-xs">{item.calories}</span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FOOD LIBRARY ---
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
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="font-bold mb-4 flex items-center text-emerald-400 text-sm uppercase tracking-wide">
                    <PlusCircle className="mr-2 w-4"/> Add Custom Food
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none text-white placeholder-slate-500" placeholder="Food Name (e.g. Chicken Breast)" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} />
                    <div className="grid grid-cols-4 gap-2">
                        {['Cal', 'Prot', 'Carb', 'Fat'].map((lbl, i) => (
                            <input key={i} type="number" placeholder={lbl} className="bg-slate-900 rounded-lg p-3 text-sm border border-slate-700 outline-none focus:border-emerald-500 text-white" value={newFood[lbl === 'Cal' ? 'calories' : lbl === 'Prot' ? 'protein' : lbl === 'Carb' ? 'carbs' : 'fat']} onChange={e => setNewFood({...newFood, [lbl === 'Cal' ? 'calories' : lbl === 'Prot' ? 'protein' : lbl === 'Carb' ? 'carbs' : 'fat']: e.target.value})} />
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition">Save to Database</button>
                </form>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-800/80 border-b border-slate-700">
                    <h3 className="font-bold text-sm text-slate-400 uppercase">Database Entries ({foods.length})</h3>
                </div>
                <div className="divide-y divide-slate-700/50 max-h-[50vh] overflow-y-auto">
                    {foods.map((f, i) => (
                        <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-700/20">
                            <div>
                                <span className="font-medium text-sm block text-slate-200">{f.name}</span>
                                <div className="text-xs text-slate-500 space-x-2 font-mono mt-0.5">
                                    <span className="text-blue-400">{f.calories} cal</span>
                                    <span className="text-emerald-500">{f.protein}g P</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(f._id)} className="text-slate-600 hover:text-red-400 p-2 transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- RECOVERY ---
const RecoverySection = ({ items }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {items && items.map((item, i) => (
                <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition">
                    <h3 className="text-slate-400 text-xs uppercase font-bold mb-1">{item.title}</h3>
                    <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                    <Moon className="absolute bottom-4 right-4 text-slate-700 group-hover:text-blue-500/20 transition transform group-hover:scale-110" size={40} />
                </div>
            ))}
        </div>
    </div>
);

// --- GENERIC STAT CARD ---
const StatCard = ({ label, value, color = "text-white", sub = "", icon }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center relative overflow-hidden group">
    {icon && <div className="absolute top-2 right-2 opacity-20">{icon}</div>}
    <div className="text-xs uppercase text-slate-500 font-bold mb-1">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mt-1">{sub}</div>}
  </div>
);

export default App;