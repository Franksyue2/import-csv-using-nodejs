var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var wsstreamSchema = new Schema({

  stream_type: { type: String },
  stream_key: { type: String },
  stream_data: { student_id: {type: String},
  				status: {type: String},
  				application_date: {type: String},
  				department: {type: String},
  				course: {type: String}},
  is_processed:    { type: Boolean, default: false },
  createdAt: { type: Date },
  process_timestamp: {type: Date},
  is_duplicated:    { type: Boolean, default: false }
},
{
    versionKey: false
});

module.exports = mongoose.model('WSStream', wsstreamSchema);