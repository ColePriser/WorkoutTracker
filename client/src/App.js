import React, { useRef } from 'react';
import LogWorkout from './components/LogWorkout';
import WorkoutHistory from './components/WorkoutHistory';
import Report from './components/Report';

function App() {
  // Reference "WorkoutHistory" and "LogWorkout" so we can trigger a refresh after making changes
  const historyRef = useRef(null);
  const logWorkoutRef = useRef(null);

  const handleWorkoutSaved = () => {
    // refresh the "WorkoutHistory" list
    if (historyRef.current) {
      historyRef.current.refreshHistory();
    }
  };

  const handleEditWorkoutTriggered = (workout) => {
    if (logWorkoutRef.current) {
      logWorkoutRef.current.loadWorkout(workout);
      // Scroll feature
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h1>Fitness App</h1>
      <LogWorkout ref={logWorkoutRef} onWorkoutSaved={handleWorkoutSaved} />   
      <WorkoutHistory ref={historyRef} onEditWorkoutTriggered={handleEditWorkoutTriggered} />
      <Report />
    </div>
  );
}

export default App;