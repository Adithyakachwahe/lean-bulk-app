export default function Section4_Recovery() {
  return (
    <section id="Recovery" className="section">
      <h2 className="text-2xl text-indigo-700 mb-4">SECTION 4: Hydration, Sleep, Supplements & Recovery</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-700">💧 Hydration</h3>
          <p>Daily: 4–4.5L water</p>
          <p>Use ORS intra-workout, coconut water post</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-purple-700">😴 Sleep Optimization</h3>
          <p>Bedtime: 12:00–12:30 AM</p>
          <p>Magnesium 400mg + Ashwagandha before bed</p>
          <p>No screens after post-workout meal</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Supplements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-600">🟢 ESSENTIAL</h4>
            <ul className="text-sm list-disc pl-5">
              <li>Whey Protein Isolate (30–45g post)</li>
              <li>Creatine Monohydrate (5g/day)</li>
              <li>Vitamin D3 (2000–4000 IU)</li>
              <li>Omega-3 (2–3g EPA+DHA)</li>
              <li>Magnesium Glycinate (400mg night)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-600">🟡 OPTIONAL</h4>
            <ul className="text-sm list-disc pl-5">
              <li>Casein Protein (before bed)</li>
              <li>Ashwagandha (300–600mg)</li>
              <li>ZMA (before bed)</li>
              <li>Citrulline Malate (pre-workout)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Active Recovery</h3>
        <p><strong>Daily:</strong> 10-min stretching post-workout</p>
        <p><strong>Sunday:</strong> Complete rest or light walk</p>
        <p><strong>Twice/week:</strong> Foam rolling</p>
        <p><strong>Weekly:</strong> Epsom salt bath</p>
      </div>
    </section>
  );
}