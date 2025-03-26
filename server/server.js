
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Workout = require('./models/Workout');
const WorkoutSet = require('./models/WorkoutSet');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://colepriser:Lgwhic7kqcpCmHlM@cluster0.iriij.mongodb.net/gymDatabase?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

// Return static array of exercises to populate the dropdown in "LogWorkout"
app.get('/api/exercises', (req, res) => {
    // Hard coded sample for testing
    const exercises = [
        { exercise_id: 1, exercise_name: 'Bench Press' },
        { exercise_id: 2, exercise_name: 'Squat' },
        { exercise_id: 3, exercise_name: 'Deadlift' },
    ];
    res.json(exercises);
});

// CREATE a Workout + its Sets
app.post('/api/workouts', async (req, res) => {
    try {
      const { user_id, workout_date, exercisesInWorkout } = req.body;
      
      // Create the main Workout document
      const newWorkout = await Workout.create({
        user_id: user_id,
        workout_date: workout_date,
      });
  
      // For each exercise, create the sets referencing this workout
      for (let ex of exercisesInWorkout) {
        for (let s of ex.sets) {
          await WorkoutSet.create({
            workout_id: newWorkout._id,
            exercise_id: ex.exercise_id,
            set_number: s.set_number,
            reps: s.reps,
            weight_lbs: s.weight_lbs,
          });
        }
      }
  
      res.status(201).json({ message: 'Workout created!', workout_id: newWorkout._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create workout' });
    }
  });
  
  // EDIT a Workout + its Sets
  app.put('/api/workouts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { workout_date, exercisesInWorkout } = req.body;
  
      // Update the main workout doc
      await Workout.findByIdAndUpdate(id, { workout_date });
  
      // Remove old sets referencing this workout
      await WorkoutSet.deleteMany({ workout_id: id });
  
      // Insert new sets
      for (let ex of exercisesInWorkout) {
        for (let s of ex.sets) {
          await WorkoutSet.create({
            workout_id: id,
            exercise_id: ex.exercise_id,
            set_number: s.set_number,
            reps: s.reps,
            weight_lbs: s.weight_lbs,
          });
        }
      }
  
      res.json({ message: 'Workout updated!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update workout' });
    }
  });
  
  // DELETE a Workout + its Sets
  app.delete('/api/workouts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      // Remove the main workout doc
      await Workout.findByIdAndDelete(id);
      // Remove all sets referencing this workout
      await WorkoutSet.deleteMany({ workout_id: id });
  
      res.json({ message: 'Workout deleted successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete workout' });
    }
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
