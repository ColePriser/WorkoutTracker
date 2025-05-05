import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const LogWorkout = forwardRef(function LogWorkout(props, ref) {
  const { onWorkoutSaved } = props;
  const [workoutDate, setWorkoutDate] = useState(''); 
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const [currentWorkoutId, setCurrentWorkoutId] = useState('');

  // Create new exercise state
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');

  // Hard code userID for testing
  const userId = 1;


  // Fetch the Exercises from the Server
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = () => {
    fetch('http://localhost:5000/api/exercises')
      .then((res) => res.json())
      .then(data => setExercisesList(data))
      .catch((err) => console.error('Error fetching exercises:', err));
  };

  // Show/hide new exercise form
  const handleCreateExercise = () => {
    setShowExerciseForm(!showExerciseForm);
  };

  // Save new exercise
  const handleSaveNewExercise = () => {
    if (!newExerciseName) return;
    fetch('http://localhost:5000/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise_name: newExerciseName }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Exercise created:', data);
        alert(`Exercise "${data.exercise_name}" created!`);
        fetchExercises();
        // reset the form
        if (props.onExerciseAdded) props.onExerciseAdded(); // refresh exercise list
        setShowExerciseForm(false);
        setNewExerciseName('');
      })
      .catch((err) => console.error('Error creating exercise:', err));
  };


  // Handlers to add/remove exercises in workout
  const handleAddExercise = () => {
    if (!selectedExerciseId) return;
    const exerciseObj = exercisesList.find(
      (ex) => ex._id === selectedExerciseId);
    if (!exerciseObj) return;

    setExercisesInWorkout((prev) => [
      ...prev, 
      {
        exercise_id: exerciseObj._id,
        exercise_name: exerciseObj.exercise_name,
        sets: [],
      }
    ]);
    setSelectedExerciseId(''); // reset dropdown
  };

  const handleRemoveExercise = (index) => {
    setExercisesInWorkout((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for Sets
  const handleAddSet = (exIndex) => {
    setExercisesInWorkout((prev) => {
      const updated = [...prev];
      updated[exIndex].sets.push({
        set_number: updated[exIndex].sets.length + 1,
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

  // Reset log workout form once workout is saved
  const resetForm = () => {
    setCurrentWorkoutId('');
    setWorkoutDate('');
    setExercisesInWorkout([]);
    setSelectedExerciseId('');
  };


  // Save or Edit the Workout
  const handleSaveWorkout = () => {
    // Build request body
    const payload = {
      user_id: userId,
      workout_date: workoutDate,
      exercisesInWorkout,
    };

    // If we have an ID, we edit the existing workout; otherwise create a new one
    if (currentWorkoutId) {
      // Edit existing workout
      fetch(`http://localhost:5000/api/workouts/${currentWorkoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Workout updated:', data);
          alert('Workout updated!');
          resetForm();
          if (onWorkoutSaved) onWorkoutSaved(); // refresh history
        })
        .catch((err) => console.error('Error updating workout:', err));
    } else {
      // Create new workout
      fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Workout created:', data);
          alert('Workout created!');
          resetForm();
          if (onWorkoutSaved) onWorkoutSaved(); // refresh history
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
        if (onWorkoutSaved) onWorkoutSaved(); // refresh
      })
      .catch((err) => console.error('Error deleting workout:', err));
  };

  // Load workout into form for editing
  const loadWorkout = (workout) => {
    setCurrentWorkoutId(workout._id || '');
    if (workout.workout_date) {
      setWorkoutDate(workout.workout_date.split('T')[0]); // if stored as full date string
    } else {
      setWorkoutDate('');
    }
    // transform workout.exercisesInWorkout into the shape we need
    setExercisesInWorkout(workout.exercisesInWorkout || []);
  };

  useImperativeHandle(ref, () => ({
    loadWorkout
  }));


  // Render the UI
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h2>Log Workout</h2>

      {/* Create New Exercise */}
      <button onClick={handleCreateExercise}>
        {showExerciseForm ? 'Cancel' : 'Create New Exercise'}
      </button>
      {showExerciseForm && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Exercise name"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
          />
          <button onClick={handleSaveNewExercise}>Save Exercise</button>
        </div>
      )}

      <hr />

      <label style={{ display: 'block', marginTop: '1rem' }}>
        Workout Date:
        <input
          type="date"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          <option value="">-- Select an exercise --</option>
          {exercisesList.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.exercise_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddExercise} style={{ marginLeft: '1rem' }}>
          Add Exercise
        </button>
      </div>

      {exercisesInWorkout.map((exObj, exIndex) => (
        <div key={exIndex} style={{ border: '1px solid #999', margin: '1rem 0', padding: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{exObj.exercise_name}</strong>
            <button onClick={() => handleRemoveExercise(exIndex)}>Remove</button>
          </div>
          <table style={{ width: '100%', marginTop: '0.5rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Set #</th>
                <th style={{ textAlign: 'center' }}>Reps</th>
                <th style={{ textAlign: 'center' }}>Weight (lbs)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {exObj.sets.map((s, setIndex) => (
                <tr key={setIndex}>
                  <td style={{ textAlign: 'center' }}>{s.set_number}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      value={s.weight_lbs}
                      onChange={(e) => handleSetChange(exIndex, setIndex, 'weight_lbs', e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleRemoveSet(exIndex, setIndex)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleAddSet(exIndex)}>+ Add Set</button>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSaveWorkout}>Save Workout</button>
        {currentWorkoutId && (
          <button onClick={handleDeleteWorkout} style={{ marginLeft: '1rem', color: 'red' }}>
            Delete Workout
          </button>
        )}
      </div>
    </div>
  );
});

export default LogWorkout;