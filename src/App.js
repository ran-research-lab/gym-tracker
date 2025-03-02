import { useState, useEffect } from "react";

const routines = {
  RoutineA: ["Squats", "Bench Press", "Deadlifts"],
  RoutineB: ["Pull-ups", "Rows", "Bicep Curls"],
  RoutineC: ["Leg Press", "Shoulder Press", "Triceps Dips"],
};

export default function GymTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState({});

  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(storedWorkouts);
  }, []);

  const startRoutine = (routineName) => {
    setSelectedRoutine(routineName);
    setCurrentWorkout(
      routines[routineName].map((exercise) => ({
        name: exercise,
        reps: "",
        weight: "",
        completed: false,
      }))
    );
  };

  const updateExercise = (index, field, value) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const saveWorkout = () => {
    const newWorkout = {
      date: new Date().toLocaleDateString(),
      routine: selectedRoutine,
      exercises: currentWorkout,
    };
    const updatedWorkouts = [newWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    setSelectedRoutine(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {!selectedRoutine ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Select Routine</h2>
          {Object.keys(routines).map((routine) => (
            <button
              key={routine}
              className="block w-full p-2 mb-2 bg-blue-500 text-white rounded"
              onClick={() => startRoutine(routine)}
            >
              {routine}
            </button>
          ))}
          <h3 className="text-lg font-semibold mt-4">Workout History</h3>
          {workouts.map((workout, idx) => (
            <div key={idx} className="border p-2 mt-2 rounded">
              <strong>{workout.date} - {workout.routine}</strong>
              <ul>
                {workout.exercises.map((ex, i) => (
                  <li key={i}>{ex.name}: {ex.reps} reps @ {ex.weight}kg</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">{selectedRoutine}</h2>
          {currentWorkout.map((exercise, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <label>
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={(e) =>
                    updateExercise(index, "completed", e.target.checked)
                  }
                />
                {exercise.name}
              </label>
              <input
                type="number"
                placeholder="Reps"
                value={exercise.reps}
                onChange={(e) => updateExercise(index, "reps", e.target.value)}
                className="ml-2 p-1 border rounded"
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={exercise.weight}
                onChange={(e) => updateExercise(index, "weight", e.target.value)}
                className="ml-2 p-1 border rounded"
              />
            </div>
          ))}
          <button
            className="mt-4 p-2 bg-green-500 text-white rounded"
            onClick={saveWorkout}
          >
            Save Workout
          </button>
        </div>
      )}
    </div>
  );
}

