const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  exercise_name: { 
    type: String, 
    unique: true,
    required: true 
  },
});

module.exports = mongoose.model('Exercise', exerciseSchema);