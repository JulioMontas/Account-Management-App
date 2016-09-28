var mongoose = require('mongoose');
var clientSchema = new mongoose.Schema({
  name: String,
  company: String,
  position: String,
  email: String,
  rate: Number,
  contact_number: Number,
  project_summary: String,
  task_list: [String],
  created_at: { type: Date, default: Date.now }
});

mongoose.model('Client', clientSchema);
