var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var studentSchema = new Schema({

  student_id: { type: String, Required:  'Student ID cannot be left blank.' },

  status:    { type: String },

  application_date: { type: String },

  department: { type: String },

  course: { type: String },

  api_called: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);