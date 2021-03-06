var mongoose = require('mongoose');
var passwordSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  summary: String,
  category: String,
  company_url: String,
  company: String,
  pay_subscription: Boolean,
  pin: Number,
  year: Number,
  task_list: [String],
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
});

mongoose.model('Password', passwordSchema);
