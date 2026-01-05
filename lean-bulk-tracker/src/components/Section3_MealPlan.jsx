export default function Section3_MealPlan() {
  return (
    <section id="MealPlan" className="section">
      <h2 className="text-2xl text-indigo-700 mb-4">SECTION 3: India-Friendly Meal Plan</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Daily Meal Structure (2,900 kcal example)</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr><th>Meal</th><th>Time</th><th>Purpose</th><th>Calories</th></tr>
          </thead>
          <tbody>
            <tr><td>Breakfast</td><td>9:00-9:30 AM</td><td>Sustained energy</td><td>550</td></tr>
            <tr><td>Mid-Morning</td><td>11:30 AM</td><td>Protein boost</td><td>350</td></tr>
            <tr><td>Lunch</td><td>1:30-2:00 PM</td><td>Major fuel load</td><td>650</td></tr>
            <tr><td>Evening Snack</td><td>5:00 PM</td><td>Light energy</td><td>300</td></tr>
            <tr><td>Pre-Workout</td><td>7:30-8:00 PM</td><td>Training fuel</td><td>450</td></tr>
            <tr><td>Post-Workout</td><td>11:00-11:30 PM</td><td>Recovery + Sleep</td><td>600</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-700 mb-2">🥗 NON-VEGETARIAN OPTION</h3>
          <p><strong>Breakfast:</strong> Egg Power Bowl (550 kcal)</p>
          <p><strong>Lunch:</strong> Chicken Rice Bowl (650 kcal)</p>
          <p><strong>Post-Workout:</strong> Whey + Oats Recovery Shake (620 kcal)</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-purple-700 mb-2">🥬 VEGETARIAN OPTION</h3>
          <p><strong>Breakfast:</strong> Paneer Power Start (565 kcal)</p>
          <p><strong>Lunch:</strong> Rajma Chawal Power Bowl (635 kcal)</p>
          <p><strong>Post-Workout:</strong> Paneer + Curd + Casein (610 kcal)</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Post-Workout Meal (Critical for 11 PM Training)</h3>
        <ul className="list-disc pl-5 text-sm">
          <li>Easy to digest (no heavy spices)</li>
          <li>Fast-absorbing protein (whey or curd)</li>
          <li>Slow-release carbs (oats, rice)</li>
          <li>Promotes quality sleep (casein, tart cherry)</li>
        </ul>
      </div>
    </section>
  );
}