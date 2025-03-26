const mongoose = require('mongoose');
const { Schema } = mongoose;

const setSchema = new Schema({
  workout_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Workout', 
    required: true 
  },
  exercise_id: { 
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true 
  },
  set_number: { 
    type: Number, 
    required: true 
  },
  reps: { 
    type: Number, 
    required: true 
  },
  weight_lbs: { 
    type: Number, 
    default: 0 
  },
});

module.exports = mongoose.model('Set', setSchema);