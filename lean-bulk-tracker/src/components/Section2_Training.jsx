export default function Section2_Training() {
  const days = [
    {
      name: "Monday",
      title: "CHEST + TRICEPS (Push Day 1)",
      exercises: [
        { ex: "Barbell Bench Press", sets: "4", reps: "6-8", rest: "3 min", rpe: "8" },
        { ex: "Incline Dumbbell Press", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Cable Flyes (Low-to-High)", sets: "3", reps: "12-15", rest: "90 sec", rpe: "7" },
        { ex: "Dips (Weighted)", sets: "3", reps: "8-12", rest: "2 min", rpe: "8" },
        { ex: "Close-Grip Bench Press", sets: "3", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Rope Pushdowns", sets: "3", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Overhead Tricep Extension", sets: "3", reps: "10-12", rest: "60 sec", rpe: "8" }
      ]
    },
    {
      name: "Tuesday",
      title: "BACK + BICEPS (Pull Day 1)",
      exercises: [
        { ex: "Deadlift (Conventional)", sets: "4", reps: "5-6", rest: "3 min", rpe: "8" },
        { ex: "Weighted Pull-Ups", sets: "4", reps: "6-8", rest: "2.5 min", rpe: "8" },
        { ex: "Barbell Rows", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Seated Cable Rows", sets: "3", reps: "10-12", rest: "90 sec", rpe: "8" },
        { ex: "Face Pulls", sets: "3", reps: "15-20", rest: "60 sec", rpe: "7" },
        { ex: "Barbell Curls", sets: "3", reps: "8-10", rest: "90 sec", rpe: "8" },
        { ex: "Incline Dumbbell Curls", sets: "3", reps: "10-12", rest: "60 sec", rpe: "8" },
        { ex: "Hammer Curls", sets: "3", reps: "12-15", rest: "60 sec", rpe: "7" }
      ]
    },
    {
      name: "Wednesday",
      title: "SHOULDERS + LEGS (Hybrid Day 1)",
      exercises: [
        { ex: "Overhead Barbell Press", sets: "4", reps: "6-8", rest: "3 min", rpe: "8" },
        { ex: "Dumbbell Lateral Raises", sets: "4", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Rear Delt Flyes", sets: "3", reps: "15-20", rest: "60 sec", rpe: "7" },
        { ex: "Barbell Back Squats", sets: "4", reps: "8-10", rest: "3 min", rpe: "8" },
        { ex: "Romanian Deadlifts", sets: "4", reps: "10-12", rest: "2 min", rpe: "8" },
        { ex: "Leg Press", sets: "3", reps: "12-15", rest: "2 min", rpe: "8" },
        { ex: "Calf Raises", sets: "4", reps: "15-20", rest: "60 sec", rpe: "8" }
      ]
    },
    {
      name: "Thursday",
      title: "CHEST + TRICEPS (Push Day 2)",
      exercises: [
        { ex: "Incline Barbell Press", sets: "4", reps: "6-8", rest: "3 min", rpe: "8" },
        { ex: "Flat Dumbbell Press", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Pec Deck Machine", sets: "3", reps: "12-15", rest: "90 sec", rpe: "8" },
        { ex: "Push-Ups (Weighted/Decline)", sets: "3", reps: "To failure", rest: "90 sec", rpe: "9" },
        { ex: "Skull Crushers", sets: "4", reps: "10-12", rest: "90 sec", rpe: "8" },
        { ex: "Cable Overhead Extensions", sets: "3", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Diamond Push-Ups", sets: "2", reps: "To failure", rest: "60 sec", rpe: "9" }
      ]
    },
    {
      name: "Friday",
      title: "BACK + BICEPS (Pull Day 2)",
      exercises: [
        { ex: "Rack Pulls", sets: "4", reps: "5-6", rest: "3 min", rpe: "8" },
        { ex: "Lat Pulldowns", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "T-Bar Rows", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Single-Arm Dumbbell Rows", sets: "3", reps: "10-12", rest: "90 sec", rpe: "8" },
        { ex: "Straight Arm Pulldowns", sets: "3", reps: "12-15", rest: "60 sec", rpe: "7" },
        { ex: "Preacher Curls", sets: "3", reps: "10-12", rest: "90 sec", rpe: "8" },
        { ex: "Concentration Curls", sets: "3", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Reverse Curls", sets: "3", reps: "15-20", rest: "60 sec", rpe: "7" }
      ]
    },
    {
      name: "Saturday",
      title: "LEGS + SHOULDERS (Hybrid Day 2)",
      exercises: [
        { ex: "Front Squats", sets: "4", reps: "6-8", rest: "3 min", rpe: "8" },
        { ex: "Bulgarian Split Squats", sets: "3", reps: "10-12", rest: "2 min", rpe: "8" },
        { ex: "Leg Curls", sets: "4", reps: "10-12", rest: "90 sec", rpe: "8" },
        { ex: "Leg Extensions", sets: "3", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Seated Calf Raises", sets: "4", reps: "15-20", rest: "60 sec", rpe: "8" },
        { ex: "Arnold Press", sets: "4", reps: "8-10", rest: "2 min", rpe: "8" },
        { ex: "Cable Lateral Raises", sets: "3", reps: "12-15", rest: "60 sec", rpe: "8" },
        { ex: "Shrugs", sets: "4", reps: "12-15", rest: "90 sec", rpe: "8" }
      ]
    }
  ];

  return (
    <section id="Training" className="section">
      <h2 className="text-2xl text-indigo-700 mb-4">SECTION 2: Weekly Training Program</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Training Philosophy</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Split: Push-Pull-Legs (Modified)</li>
          <li>Volume: 16-20 sets/muscle/week</li>
          <li>Rep Ranges: Strength (4-6), Hypertrophy (8-12), Metabolic (12-15)</li>
          <li>Rest: Heavy compounds 2-3 min | Accessories 60-90 sec</li>
          <li>Tempo: 3-1-2 (eccentric-pause-concentric)</li>
        </ul>
      </div>

      {days.map((day) => (
        <div key={day.name} className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-bold text-indigo-600">{day.name}: {day.title}</h3>
          <table className="w-full text-sm mt-2">
            <thead className="bg-gray-100">
              <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th><th>RPE</th></tr>
            </thead>
            <tbody>
              {day.exercises.map((e, idx) => (
                <tr key={idx} className="border-b">
                  <td>{e.ex}</td>
                  <td>{e.sets}</td>
                  <td>{e.reps}</td>
                  <td>{e.rest}</td>
                  <td>{e.rpe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Progressive Overload Protocol</h3>
        <p><strong>Weeks 1-2:</strong> Volume baseline</p>
        <p><strong>Weeks 3-4:</strong> +2.5kg compounds</p>
        <p><strong>Weeks 5-6:</strong> Add 1-2 reps</p>
        <p><strong>Weeks 7-8:</strong> Add 1 set to lagging muscles</p>
        <p><strong>Weeks 9-10:</strong> Drop sets, rest-pause</p>
        <p><strong>Weeks 11-12:</strong> Peak → Deload (50% volume)</p>
      </div>
    </section>
  );
}