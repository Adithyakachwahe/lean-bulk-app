import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="text-lg font-semibold text-indigo-700">Lean Bulk Plan</div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              ☰
            </button>
          </div>
          <ul className="hidden md:flex space-x-6">
            {['Metabolic', 'Training', 'MealPlan', 'Recovery', 'Mistakes'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  {item === 'MealPlan' ? 'Meal Plan' : item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {isOpen && (
          <ul className="md:hidden py-3 border-t">
            {['Metabolic', 'Training', 'MealPlan', 'Recovery', 'Mistakes'].map((item) => (
              <li key={item} className="py-2">
                <button
                  onClick={() => scrollToSection(item)}
                  className="text-gray-600 hover:text-indigo-600 font-medium block w-full text-left"
                >
                  {item === 'MealPlan' ? 'Meal Plan' : item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}