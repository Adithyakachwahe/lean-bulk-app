export default function Section5_Mistakes() {
  const mistakes = [
    "Dirty Bulk Mentality → Stick to 80/20 whole foods",
    "Ignoring Sleep → Non-negotiable 7+ hours",
    "Inconsistent Calories → Meal prep + alarms",
    "No Progressive Overload → Track every lift",
    "Overtraining → Mandatory rest + deloads",
    "Protein Timing Obsession → Hit total daily first",
    "Avoiding Carbs/Fats → Fuel performance & hormones",
    "Not Tracking Progress → Weigh, measure, photo",
    "Relying Only on Scale → Track strength & measurements",
    "Giving Up Too Soon → Commit 90 days minimum"
  ];

  return (
    <section id="Mistakes" className="section">
      <h2 className="text-2xl text-indigo-700 mb-4">SECTION 5: Common Bulking Mistakes & Fixes</h2>
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-red-700 mb-2">🚨 "Things Most People Miss While Bulking"</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {mistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}