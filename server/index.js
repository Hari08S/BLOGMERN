const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const EmployeeModel = require("./models/employee");

const app = express();
app.use(express.json());
app.use(cors());

// Multer Configuration (Memory Storage for MongoDB)
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/employee")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Setup Admin User
const setupAdmin = async () => {
  try {
    const adminData = {
      username: "HARI",
      email: "717823p315@kce.ac.in",
      password: "717823p315",
      isAdmin: true,
      blogs: [
        {
          title: "Understanding React",
          summary: "An introduction to React...",
          content: "React is a JavaScript library...",
          author: "John Doe",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "Why Blogging Matters",
          summary: "Exploring the importance...",
          content: "Blogging is a way...",
          author: "Jane Smith",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "The Power of JavaScript",
          summary: "A deep dive into JavaScript...",
          content: "JavaScript is a versatile...",
          author: "Alice Johnson",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "CSS for Beginners",
          summary: "Understanding the fundamentals...",
          content: "CSS (Cascading Style Sheets)...",
          author: "Bob Williams",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "Mastering Node.js",
          summary: "An overview of Node.js...",
          content: "Node.js allows developers...",
          author: "Charlie Davis",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "The Importance of UX/UI Design",
          summary: "How great UX/UI design...",
          content: "User experience (UX) and...",
          author: "Diana Roberts",
          authorEmail: "717823p315@kce.ac.in",
        },
        {
          title: "Getting Started with TypeScript",
          summary: "Why TypeScript is a great...",
          content: "TypeScript is a strongly typed...",
          author: "Edward Brown",
          authorEmail: "717823p315@kce.ac.in",
        },
      ],
    };
    const existingAdmin = await EmployeeModel.findOne({ email: adminData.email });
    if (!existingAdmin) {
      await EmployeeModel.create(adminData);
      console.log("Admin user created with default blogs");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error setting up admin user:", err);
  }
};
setupAdmin();

// Register User
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    console.log("Registering user:", { username, email });
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Already registered." });
    }
    const newUser = await EmployeeModel.create({ username, email, password, gender });
    console.log("User registered:", newUser.email);
    res.json({ success: true, message: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Error: " + err.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);
    const user = await EmployeeModel.findOne({ email }).select("+profileImage");
    if (!user || user.password !== password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    console.log("User logged in:", user.email);
    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Update User Profile
app.post("/update-user", upload.single("profileImage"), async (req, res) => {
  try {
    const { email, gender } = req.body;
    const profileImage = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : undefined;
    console.log("Updating profile for:", email);

    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.gender = gender || user.gender;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    const updatedUser = await EmployeeModel.findOne({ email });
    console.log("Profile updated for:", updatedUser.email);
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        profileImage: updatedUser.profileImage?.data
          ? `data:${updatedUser.profileImage.contentType};base64,${updatedUser.profileImage.data.toString('base64')}`
          : null,
      },
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ success: false, message: "Failed to update profile: " + err.message });
  }
});

// Add a New Blog
app.post("/add-blog", upload.single("image"), async (req, res) => {
  try {
    const { email, title, summary, content, author } = req.body;
    const image = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : null;
    console.log("Adding blog for user:", email, "Title:", title);

    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newBlog = {
      title,
      summary,
      content,
      author: author || user.username,
      authorEmail: email,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    user.blogs.push(newBlog);
    await user.save();

    const savedBlog = user.blogs[user.blogs.length - 1];
    console.log("Blog added successfully:", savedBlog.title, "ID:", savedBlog._id.toString());
    res.json({
      success: true,
      message: "Blog added",
      blog: {
        ...savedBlog.toObject(),
        _id: savedBlog._id.toString(),
        image: savedBlog.image
          ? {
              data: savedBlog.image.data.toString('base64'),
              contentType: savedBlog.image.contentType,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error adding blog:", err);
    res.status(500).json({ success: false, message: "Error: " + err.message });
  }
});

// Get All Blogs (Exclude Admin Blogs)
app.get("/all-blogs", async (req, res) => {
  try {
    const users = await EmployeeModel.find({ isAdmin: false }, "username blogs");
    console.log("Fetched non-admin users with blogs:", users.length);
    const allBlogs = users.flatMap((user) =>
      user.blogs.map((blog) => {
        console.log(`Processing blog: ${blog.title}, Has image: ${!!blog.image}`);
        return {
          ...blog.toObject(),
          author: user.username,
          _id: blog._id.toString(),
          image: blog.image && blog.image.data
            ? {
                data: blog.image.data.toString('base64'),
                contentType: blog.image.contentType,
              }
            : null,
        };
      })
    );
    console.log("Fetched all non-admin blogs, count:", allBlogs.length);
    res.json({ success: true, blogs: allBlogs });
  } catch (err) {
    console.error("Error fetching all blogs:", err);
    res.status(500).json({ success: false, message: "Error: " + err.message });
  }
});

// Get Blogs for a Specific User
app.get("/user-blogs", async (req, res) => {
  try {
    const { email } = req.query;
    console.log("Fetching blogs for user:", email);
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const blogs = user.blogs.map((blog) => ({
      ...blog.toObject(),
      author: user.username,
      _id: blog._id.toString(),
      image: blog.image && blog.image.data
        ? {
            data: blog.image.data.toString('base64'),
            contentType: blog.image.contentType,
          }
        : null,
    }));
    console.log(`Fetched ${blogs.length} blogs for ${email}`);
    res.json({ success: true, blogs });
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    res.status(500).json({ success: false, message: "Error: " + err.message });
  }
});

// Update a Blog
app.put("/update-blog", upload.single("image"), async (req, res) => {
  try {
    const { email, id, title, summary, content, author } = req.body;
    const image = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : undefined;
    console.log("Updating blog ID:", id, "for user:", email);

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
      authorEmail: email,
      image: image || user.blogs[blogIndex].image,
      updatedAt: new Date(),
    };

    await user.save();
    console.log("Blog updated:", user.blogs[blogIndex].title);
    res.json({
      success: true,
      message: "Blog updated successfully",
      blog: {
        ...user.blogs[blogIndex].toObject(),
        _id: id,
        image: user.blogs[blogIndex].image && user.blogs[blogIndex].image.data
          ? {
              data: user.blogs[blogIndex].image.data.toString('base64'),
              contentType: user.blogs[blogIndex].image.contentType,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ success: false, message: "Failed to update blog: " + err.message });
  }
});

// Delete a Blog
app.delete("/delete-blog", async (req, res) => {
  try {
    const { email, id } = req.body;
    console.log("Deleting blog ID:", id, "for user:", email);
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.blogs = user.blogs.filter((b) => b._id.toString() !== id);
    await user.save();
    console.log("Blog deleted successfully");
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ success: false, message: "Failed to delete blog: " + err.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Server is running on http://localhost:3001");
});