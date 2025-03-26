import React, { useState, useEffect } from 'react';

function LogWorkout() {
  // Hard-coded date and exercise data for demo purposes
  const [workoutDate, setWorkoutDate] = useState('2025-04-01'); 
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const [currentWorkoutId, setCurrentWorkoutId] = useState('');

  const userId = 1; // Assume user ID 1 for now


  // Fetch the Exercises from the Server
  useEffect(() => {
    fetch('http://localhost:5000/api/exercises')
      .then((res) => res.json())
      .then((data) => {
        setExercisesList(data); // e.g. [{exercise_id:1, exercise_name:'Bench Press'}, ...]
      })
      .catch((err) => {
        console.error('Error fetching exercises:', err);
      });
  }, []);


  // Handlers to Add/Remove Exercises
  const handleAddExercise = () => {
    if (!selectedExerciseId) return;

    // Find the selected exercise object
    const exerciseObj = exercisesList.find(
      (ex) => ex.exercise_id === parseInt(selectedExerciseId, 10)
    );
    if (!exerciseObj) return;

    // Add exercise to the workout with an empty sets array
    const newExerciseEntry = {
      exercise_id: exerciseObj.exercise_id,
      exercise_name: exerciseObj.exercise_name,
      sets: [],
    };

    setExercisesInWorkout((prev) => [...prev, newExerciseEntry]);
    setSelectedExerciseId(''); // reset dropdown
  };

  const handleRemoveExercise = (index) => {
    setExercisesInWorkout((prev) => prev.filter((_, i) => i !== index));
  };


  // Handlers for Sets
  const handleAddSet = (exIndex) => {
    setExercisesInWorkout((prev) => {
      const updated = [...prev];
      const exercise = updated[exIndex];
      exercise.sets.push({
        set_number: exercise.sets.length + 1,
        reps: 0,
        weight_lbs: 0,
      });
      return updated;
    });
  };

  const handleRemoveSet = (exIndex, setIndex) => {
    setExercisesInWorkout((prev) => {
      const updated = [...prev];
      updated[exIndex].sets.splice(setIndex, 1);
      return updated;
    });
  };

  // When user changes reps or weight
  const handleSetChange = (exIndex, setIndex, field, value) => {
    setExercisesInWorkout((prev) => {
      const updated = [...prev];
      updated[exIndex].sets[setIndex][field] = value;
      return updated;
    });
  };


  // Save or Edit the Workout
  
  const handleSaveWorkout = () => {
    // Build request body
    const payload = {
      user_id: userId,
      workout_date: workoutDate,
      exercisesInWorkout: exercisesInWorkout,
    };

    // If we have an ID, we edit the existing workout; otherwise create a new one
    if (currentWorkoutId) {
      fetch(`http://localhost:5000/api/workouts/${currentWorkoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Workout updated:', data);
          alert('Workout updated!');
        })
        .catch((err) => console.error('Error updating workout:', err));
    } else {
      fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Workout created:', data);
          alert('Workout created!');
          setCurrentWorkoutId(data.workout_id); // so we can "edit" afterwards
        })
        .catch((err) => console.error('Error creating workout:', err));
    }
  };


  // Delete the Workout

  const handleDeleteWorkout = () => {
    if (!currentWorkoutId) {
      alert('No workout to delete!');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    fetch(`http://localhost:5000/api/workouts/${currentWorkoutId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Deleted workout:', data);
        alert('Workout deleted!');
        // Reset fields
        setCurrentWorkoutId(null);
        setWorkoutDate('');
        setExercisesInWorkout([]);
      })
      .catch((err) => console.error('Error deleting workout:', err));
  };


  // Render the UI

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{currentWorkoutId ? 'Edit Workout' : 'Log Workout'}</h2>

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

      {/* Dropdown to Add Exercises */}
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
        <button onClick={handleAddExercise} style={{ marginLeft: '1rem' }}>
          Add Exercise
        </button>
      </div>

      {/* List of Exercises in the Workout */}
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
            <button onClick={() => handleRemoveExercise(exIndex)}>
              Remove Exercise
            </button>
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
                    <input
                      type="number"
                      value={setObj.reps}
                      onChange={(e) =>
                        handleSetChange(exIndex, setIndex, 'reps', e.target.value)
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={setObj.weight_lbs}
                      onChange={(e) =>
                        handleSetChange(
                          exIndex,
                          setIndex,
                          'weight_lbs',
                          e.target.value
                        )
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleRemoveSet(exIndex, setIndex)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => handleAddSet(exIndex)} style={{ marginTop: '0.5rem' }}>
            + Add Set
          </button>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={handleSaveWorkout}>
          {currentWorkoutId ? 'Edit Workout' : 'Save Workout'}
        </button>
        {currentWorkoutId && (
          <button
            onClick={handleDeleteWorkout}
            style={{ marginLeft: '1rem', color: 'red' }}
          >
            Delete Workout
          </button>
        )}
      </div>
    </div>
  );
}

export default LogWorkout;