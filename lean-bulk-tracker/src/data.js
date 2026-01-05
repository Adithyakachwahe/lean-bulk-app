export const profileData = {
  name: "Client Profile",
  currentWeight: 63,
  targetWeight: 76, // Revised realistic target in UI logic
  height: 172,
  age: 24,
  bmr: 1590,
  tdee: 2550,
  phases: [
    { name: "Phase 1: Foundation", weeks: "1-4", surplus: "+350", total: 2900, protein: "158g", carbs: "380g", fats: "78g" },
    { name: "Phase 2: Growth", weeks: "5-8", surplus: "+450", total: 3000, protein: "168g", carbs: "395g", fats: "80g" },
    { name: "Phase 3: Peak", weeks: "9-12", surplus: "+500", total: 3100, protein: "175g", carbs: "410g", fats: "82g" },
  ]
};

export const workoutPlan = [
  {
    day: "Monday",
    title: "Push A: Chest & Triceps",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "3 min" },
      { name: "Incline DB Press", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "90 sec" },
      { name: "Dips (Weighted)", sets: 3, reps: "8-12", rest: "2 min" },
      { name: "Close-Grip Bench", sets: 3, reps: "8-10", rest: "2 min" },
      { name: "Rope Pushdowns", sets: 3, reps: "12-15", rest: "60 sec" }
    ]
  },
  {
    day: "Tuesday",
    title: "Pull A: Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: 4, reps: "5-6", rest: "3 min" },
      { name: "Weighted Pull-Ups", sets: 4, reps: "6-8", rest: "2.5 min" },
      { name: "Barbell Rows", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
      { name: "Barbell Curls", sets: 3, reps: "8-10", rest: "90 sec" }
    ]
  },
  {
    day: "Wednesday",
    title: "Legs & Shoulders A",
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "6-8", rest: "3 min" },
      { name: "DB Lateral Raises", sets: 4, reps: "12-15", rest: "60 sec" },
      { name: "Barbell Squats", sets: 4, reps: "8-10", rest: "3 min" },
      { name: "RDLs", sets: 4, reps: "10-12", rest: "2 min" },
      { name: "Leg Press", sets: 3, reps: "12-15", rest: "2 min" },
      { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60 sec" }
    ]
  },
  {
    day: "Thursday",
    title: "Push B: Chest & Triceps",
    exercises: [
      { name: "Incline Barbell Press", sets: 4, reps: "6-8", rest: "3 min" },
      { name: "Flat DB Press", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Pec Deck", sets: 3, reps: "12-15", rest: "90 sec" },
      { name: "Skull Crushers", sets: 4, reps: "10-12", rest: "90 sec" },
      { name: "Cable Overhead Ext", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Diamond Push-Ups", sets: 2, reps: "Failure", rest: "60 sec" }
    ]
  },
  {
    day: "Friday",
    title: "Pull B: Back & Biceps",
    exercises: [
      { name: "Rack Pulls", sets: 4, reps: "5-6", rest: "3 min" },
      { name: "Lat Pulldowns", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "T-Bar Rows", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Single-Arm DB Rows", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Preacher Curls", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "60 sec" }
    ]
  },
  {
    day: "Saturday",
    title: "Legs & Shoulders B",
    exercises: [
      { name: "Front Squats", sets: 4, reps: "6-8", rest: "3 min" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", rest: "2 min" },
      { name: "Leg Curls", sets: 4, reps: "10-12", rest: "90 sec" },
      { name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Arnold Press", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" }
    ]
  }
];

export const nutritionPlan = {
  nonVeg: [
    { time: "9:00 AM", meal: "Breakfast", items: "4 Boiled Eggs, 2 Slices Multigrain Bread, 1 Banana, Black Coffee", cal: 550 },
    { time: "11:30 AM", meal: "Snack", items: "1 Scoop Whey, 40g Oats, 1 tbsp Peanut Butter", cal: 350 },
    { time: "1:30 PM", meal: "Lunch", items: "150g Chicken Breast, 200g White Rice, Veggies, 1 tsp Ghee", cal: 650 },
    { time: "5:00 PM", meal: "Snack", items: "150g Greek Yogurt, 25g Nuts, Honey", cal: 300 },
    { time: "7:30 PM", meal: "Pre-Workout", items: "4 Egg Whites, 200g Sweet Potato, 1 tbsp Peanut Butter", cal: 450 },
    { time: "11:00 PM", meal: "Post-Workout", items: "1.5 Scoops Whey, 300ml Milk, 50g Oats (Blended)", cal: 600 }
  ],
  veg: [
    { time: "9:00 AM", meal: "Breakfast", items: "100g Paneer Bhurji, 2 Whole Wheat Roti, Sprouts Salad", cal: 565 },
    { time: "11:30 AM", meal: "Snack", items: "1 Scoop Soy/Whey, 40g Oats, Almond Butter", cal: 365 },
    { time: "1:30 PM", meal: "Lunch", items: "200g Rajma Curry, 180g Basmati Rice, Ghee, Salad", cal: 635 },
    { time: "5:00 PM", meal: "Snack", items: "100g Paneer Tikka (Air Fried), Green Chutney", cal: 335 },
    { time: "7:30 PM", meal: "Pre-Workout", items: "150g Tofu Stir Fry, 150g Brown Rice, Olive Oil", cal: 460 },
    { time: "11:00 PM", meal: "Post-Workout", items: "100g Paneer, 200g Curd, 2 Chapatis, Casein/Whey", cal: 610 }
  ]
};

export const recoveryData = [
  { title: "Sleep", value: "7-8 Hours", desc: "Hard Stop: 12:30 AM. Wake: 8:30 AM. Cool room, no screens post-workout." },
  { title: "Hydration", value: "4.5 Liters", desc: "750ml AM, 1L Afternoon, 500ml Pre-workout, 750ml Intra." },
  { title: "Creatine", value: "5g Daily", desc: "Take anytime. Non-negotiable for volume." },
  { title: "Whey Protein", value: "30-45g", desc: "Essential post-workout for late night recovery." }
];