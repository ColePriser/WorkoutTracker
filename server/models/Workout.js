const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  workout_date: { 
    type: Date, 
    required: true 
  },
});

module.exports = mongoose.model('Workout', workoutSchema);