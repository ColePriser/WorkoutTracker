import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const WorkoutHistory = forwardRef(function WorkoutHistory(props, ref) {
  const { onEditWorkoutTriggered } = props;
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = () => {
    fetch('http://localhost:5000/api/workouts') // GET /api/workouts
      .then((res) => res.json())
      .then((data) => setWorkouts(data))
      .catch((err) => console.error('Error fetching workouts:', err));
  };

  // Parent calls refreshHistory using the ref
  useImperativeHandle(ref, () => ({
    refreshHistory: () => {
      fetchWorkouts();
    },
  }));


  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h2>Workout History</h2>
      {workouts.map((w) => {
        const dateStr = w.workout_date ? w.workout_date.split('T')[0] : '';
        // Only show the first three exercises in the workout for brevity
        const firstThree = (w.exercisesInWorkout || []).slice(0, 3);
        const exerciseNames = firstThree.map((ex) => ex.exercise_name).join(', ');
        return (
          <div key={w._id} style={{ border: '1px solid #999', margin: '0.5rem 0', padding: '0.5rem' }}>
            <p><strong>Date:</strong> {dateStr}</p>
            <p><strong>Exercises:</strong> {exerciseNames}</p>
            <button onClick={() => onEditWorkoutTriggered(w)}>
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default WorkoutHistory;