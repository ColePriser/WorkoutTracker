const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  user_id: { type: Number, required: true },
  workout_date: { type: Date, required: true },
});

module.exports = mongoose.model('Workout', workoutSchema);