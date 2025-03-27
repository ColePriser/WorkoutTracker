
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models
const Workout = require('./models/Workout');
const Set = require('./models/Set');
const Exercise = require('./models/Exercise');
const User = require('./models/User');

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
app.get('/api/exercises', async (req, res) => {
    try {
      const exercises = await Exercise.find({}).lean();
      res.json(exercises);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      res.status(500).json({ error: 'Failed to fetch exercises' });
    }
});

// Create a new exercise
app.post('/api/exercises', async (req, res) => {
  try {
    const { exercise_name } = req.body;
    if (!exercise_name) {
      return res.status(400).json({ error: 'exercise_name is required' });
    }
    // Insert using your Mongoose Exercise model
    const exercise = await Exercise.create({ exercise_name });
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Error creating exercise:', err);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// GET all Workouts
app.get('/api/workouts', async (req, res) => {
  try {
    // Load all workouts
    const workouts = await Workout.find({}).lean();

    // For each workout, fetch sets
    for (const w of workouts) {
      const sets = await Set.find({ workout_id: w._id }).lean();
      
      // Group sets by exercise_id so you can build "exercisesInWorkout"
      w.exercisesInWorkout = [];
      const exerciseMap = {};
      for (const s of sets) {
        if (!exerciseMap[s.exercise_id]) {
          const exercise = await Exercise.findById(s.exercise_id).lean();
          exerciseMap[s.exercise_id] = {
            exercise_id: s.exercise_id,
            exercise_name: exercise.exercise_name,
            sets: [],
          };
        }
        exerciseMap[s.exercise_id].sets.push({
          set_number: s.set_number,
          reps: s.reps,
          weight_lbs: s.weight_lbs,
        });
      }

      w.exercisesInWorkout = Object.values(exerciseMap);
    }

    res.json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
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
          await Set.create({
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
      await Set.deleteMany({ workout_id: id });
  
      // Insert new sets
      for (let ex of exercisesInWorkout) {
        for (let s of ex.sets) {
          await Set.create({
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
      await Set.deleteMany({ workout_id: id });
  
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
