const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSetSchema = new Schema({
  workout_id: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
  exercise_id: { type: Number, required: true },
  set_number: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight_lbs: { type: Number, required: true },
});

module.exports = mongoose.model('WorkoutSet', workoutSetSchema);