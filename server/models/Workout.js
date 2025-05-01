const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  user_id: { 
    // type: Schema.Types.ObjectId, USE THIS AFTER CREATING USER DOC IN MANGO. hard coding it as 1 for now
    // ref: 'User', SAME AS ABOVE
    type: Number,
    required: true 
  },
  workout_date: { 
    type: Date, 
    required: true 
  },
});

// Create an index on workout_date for faster queries
workoutSchema.index({ workout_date: 1}); 
module.exports = mongoose.model('Workout', workoutSchema);