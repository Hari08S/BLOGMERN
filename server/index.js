const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const EmployeeModel = require("./models/employee");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer Configuration (File Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use("/uploads", express.static(uploadDir));

// Setup Admin User
const setupAdmin = async () => {
  const adminData = {
    username: "HARI",
    email: "717823p315@kce.ac.in",
    password: "717823p315",
    isAdmin: true,
    blogs: [
      { title: "Understanding React", summary: "An introduction to React...", content: "React is a JavaScript library...", author: "John Doe", image: "react.png" },
      { title: "Why Blogging Matters", summary: "Exploring the importance...", content: "Blogging is a way...", author: "Jane Smith", image: "bb.avif" },
      { title: "The Power of JavaScript", summary: "A deep dive into JavaScript...", content: "JavaScript is a versatile...", author: "Alice Johnson", image: "js.jpg" },
      { title: "CSS for Beginners", summary: "Understanding the fundamentals...", content: "CSS (Cascading Style Sheets)...", author: "Bob Williams", image: "css.avif" },
      { title: "Mastering Node.js", summary: "An overview of Node.js...", content: "Node.js allows developers...", author: "Charlie Davis", image: "node.png" },
      { title: "The Importance of UX/UI Design", summary: "How great UX/UI design...", content: "User experience (UX) and...", author: "Diana Roberts", image: "uiux.jpeg" },
      { title: "Getting Started with TypeScript", summary: "Why TypeScript is a great...", content: "TypeScript is a strongly typed...", author: "Edward Brown", image: "typescript.jpeg" },
    ],
  };
  const existingAdmin = await EmployeeModel.findOne({ email: adminData.email });
  if (!existingAdmin) await EmployeeModel.create(adminData);
};
setupAdmin();

/** ================================
 *        USER AUTHENTICATION
 ===================================*/

// Register User
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "Already registered." });
    const newUser = await EmployeeModel.create({ username, email, password, gender });
    res.json({ success: true, message: "Registration successful", user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await EmployeeModel.findOne({ email }).select("+profileImage");
    if (!user || user.password !== password) return res.json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error: " + err });
  }
});

// Update User Profile
app.post("/update-user", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, gender } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.gender = gender || user.gender;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", profileImage: user.profileImage });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ success: false, message: "Failed to update profile. Please check the server." });
  }
});

/** ================================
 *        BLOG MANAGEMENT
 ===================================*/

// Add a New Blog
app.post("/add-blog", upload.single("image"), async (req, res) => {
  try {
    const { email, title, summary, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const newBlog = { title, summary, content, author: author || user.username, image };
    user.blogs.push(newBlog);
    await user.save();

    res.json({ success: true, message: "Blog added", blog: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err });
  }
});

// Get All Blogs
app.get("/all-blogs", async (req, res) => {
  try {
    const users = await EmployeeModel.find({}, "username blogs");
    const allBlogs = users.flatMap((user) =>
      user.blogs.map((blog) => ({ ...blog.toObject(), author: user.username }))
    );
    res.json({ success: true, blogs: allBlogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err });
  }
});

// Get Blogs for a Specific User
app.get("/user-blogs", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, blogs: user.blogs.map((blog) => ({ ...blog.toObject(), author: user.username })) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err });
  }
});

// Update a Blog
app.put("/update-blog", upload.single("image"), async (req, res) => {
  try {
    const { email, id, title, summary, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const user = await EmployeeModel.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const blogIndex = user.blogs.findIndex((b) => b._id.toString() === id);
    if (blogIndex === -1) return res.status(404).json({ success: false, message: "Blog not found" });

    user.blogs[blogIndex] = {
      ...user.blogs[blogIndex],
      title,
      summary,
      content,
      author: author || user.username,
      image: image || user.blogs[blogIndex].image,
    };

    await user.save();
    res.json({ success: true, message: "Blog updated", blog: user.blogs[blogIndex] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error: " + err });
  }
});

// Delete a Blog
app.delete("/delete-blog", async (req, res) => {
  try {
    const { email, id } = req.body;
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.blogs = user.blogs.filter((b) => b._id.toString() !== id);
    await user.save();

    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ success: false, message: "Failed to delete blog. Please check the server." });
  }
});

/** ================================
 *        START SERVER
 ===================================*/
app.listen(3001, () => {
  console.log("✅ Server is running on http://localhost:3001");
});