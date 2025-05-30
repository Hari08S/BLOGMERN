const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gender: { type: String, default: "Not specified" },
  joinedDate: { type: Date, default: Date.now },
  profileImage: String,
  blogs: [{
    id: Number,
    title: String,
    summary: String,
    content: String,
    author: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isAdmin: { type: Boolean, default: false }
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;