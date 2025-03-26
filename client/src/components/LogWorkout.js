import React, { useState } from 'react';

function LogWorkout() {
  // Hard-coded date and exercise data for demo purposes
  const [workoutDate, setWorkoutDate] = useState('2025-04-01'); 
  const exercisesList = [
    { exercise_id: 1, exercise_name: 'Bench Press' },
    { exercise_id: 2, exercise_name: 'Squat' },
    { exercise_id: 3, exercise_name: 'Deadlift' },
  ];

  // The selected exercise from the dropdown (not used yet)
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  // One sample exercise in the “workout” to show the sets table
  // No dynamic functionality; purely for display
  const [exercisesInWorkout] = useState([
    {
      exercise_id: 1,
      exercise_name: 'Bench Press',
      sets: [
        { set_number: 1, reps: 10, weight_lbs: 135 },
        { set_number: 2, reps: 8, weight_lbs: 145 },
      ],
    },
  ]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Log Workout (Basic UI Demo)</h2>

      {/* Date Input */}
      <label>
        Workout Date:
        <input
          type="date"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
      </label>

      {/* Dropdown for Exercises */}
      <div style={{ marginTop: '1rem' }}>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          <option value="">-- Select an exercise --</option>
          {exercisesList.map((ex) => (
            <option key={ex.exercise_id} value={ex.exercise_id}>
              {ex.exercise_name}
            </option>
          ))}
        </select>
        <button style={{ marginLeft: '1rem' }}>
          Add Exercise
        </button>
      </div>

      {/* Render Exercises in the "workout" */}
      {exercisesInWorkout.map((exercise, exIndex) => (
        <div
          key={exIndex}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginTop: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{exercise.exercise_name}</strong>
            <button>Remove Exercise</button>
          </div>

          {/* Table of Sets */}
          <table style={{ width: '100%', marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th>Set #</th>
                <th>Reps</th>
                <th>Weight (lbs)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((setObj, setIndex) => (
                <tr key={setIndex}>
                  <td>{setObj.set_number}</td>
                  <td>
                    <input type="number" value={setObj.reps} readOnly />
                  </td>
                  <td>
                    <input type="number" value={setObj.weight_lbs} readOnly />
                  </td>
                  <td>
                    <button>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: '0.5rem' }}>
            + Add Set
          </button>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ marginTop: '1.5rem' }}>
        <button>Save Workout</button>
        <button style={{ marginLeft: '1rem', color: 'red' }}>
          Delete Workout
        </button>
      </div>
    </div>
  );
}

export default LogWorkout;