export default function Section1_Metabolic() {
  return (
    <section id="Metabolic" className="section">
      <h2 className="text-2xl text-indigo-700 mb-4">SECTION 1: Metabolic Calculations & Caloric Strategy</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">1.1 Client Profile Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Gender:</strong> Male</div>
          <div><strong>Age:</strong> 23-24 years</div>
          <div><strong>Height:</strong> 172 cm (5'8")</div>
          <div><strong>Current Weight:</strong> 63 kg</div>
          <div><strong>Target Weight:</strong> 76 kg</div>
          <div><strong>Weight Gain Required:</strong> 13 kg in 90 days</div>
          <div><strong>Training Experience:</strong> 2 years (Intermediate)</div>
          <div><strong>Gym Timing:</strong> 9:00–11:00 PM</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">1.2 Metabolic Calculations</h3>
        <p><strong>BMR (Mifflin-St Jeor):</strong> 1,590 kcal/day</p>
        <p><strong>TDEE (1.6 multiplier):</strong> 2,550 kcal/day</p>

        <h4 className="font-medium mt-3">Caloric Surplus Strategy</h4>
        <table className="w-full text-sm mt-2">
          <thead className="bg-gray-100">
            <tr><th>Phase</th><th>Duration</th><th>Surplus</th><th>Daily Calories</th><th>Weekly Gain</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td>Phase 1 (Foundation)</td><td>Weeks 1-4</td><td>+350 kcal</td><td>2,900 kcal</td><td>0.35 kg</td></tr>
            <tr className="border-b"><td>Phase 2 (Growth)</td><td>Weeks 5-8</td><td>+450 kcal</td><td>3,000 kcal</td><td>0.45 kg</td></tr>
            <tr><td>Phase 3 (Peak)</td><td>Weeks 9-12</td><td>+500 kcal</td><td>3,100 kcal</td><td>0.5 kg</td></tr>
          </tbody>
        </table>

        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800">
          <strong>⚠️ Reality Check:</strong> Gaining 13 kg lean in 90 days is unrealistic. Adjusted target: <strong>70–72 kg</strong> (6–9 kg total gain).
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">1.3 Macronutrient Distribution</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr><th>Phase</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fats</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td>Phase 1</td><td>2,900</td><td>158g</td><td>380g</td><td>78g</td></tr>
            <tr className="border-b"><td>Phase 2</td><td>3,000</td><td>168g</td><td>395g</td><td>80g</td></tr>
            <tr><td>Phase 3</td><td>3,100</td><td>175g</td><td>410g</td><td>82g</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}