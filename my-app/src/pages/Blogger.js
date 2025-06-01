import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteBorder, Favorite, Edit, Delete, Add, Save } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import "./Blogger.css";

function ProfileMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="nav3" onClick={toggleDropdown}>
      <AccountCircleIcon className="profile-icon3" />
      {dropdownOpen && (
        <div className="dropdown-menu3">
          <div className="dropdown-item3" onClick={() => navigate("/profile")}>My Profile</div>
          <div className="dropdown-item3" onClick={onLogout}>Log Out</div>
        </div>
      )}
    </div>
  );
}

export default function Blogger({ user }) {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedBlog, setEditedBlog] = useState({});
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", summary: "", content: "", author: "", imageFile: null });
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    if (!user) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/user-blogs?email=${user.email}`);
      console.log("Fetched user blogs:", response.data);
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
      } else {
        console.error("Failed to fetch blogs:", response.data.message);
        setBlogs([]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [user, navigate]);

  const handleFooterClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const handleEdit = (blog) => {
    setEditMode(blog._id);
    setEditedBlog({ ...blog, imageFile: null });
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("id", editedBlog._id);
      formData.append("title", editedBlog.title);
      formData.append("summary", editedBlog.summary);
      formData.append("content", editedBlog.content);
      formData.append("author", editedBlog.author || user.username);
      if (editedBlog.imageFile) formData.append("image", editedBlog.imageFile);

      const response = await axios.put("http://localhost:3001/update-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog._id === editedBlog._id ? response.data.blog : blog))
        );
        setEditMode(null);
        alert("Blog updated successfully!");
      } else {
        alert("Failed to update blog: " + response.data.message);
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        await axios.delete("http://localhost:3001/delete-blog", { data: { email: user.email, id } });
        await fetchBlogs();
        alert("Blog deleted successfully!");
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUpload = (event, isNewBlog = false) => {
    const file = event.target.files[0];
    if (file) {
      if (isNewBlog) {
        setNewBlog((prev) => ({ ...prev, imageFile: file }));
      } else {
        setEditedBlog((prev) => ({ ...prev, imageFile: file }));
      }
    }
  };

  const handleNewBlog = () => {
    const author = prompt("Enter author name:", user?.username || "");
    if (author === null || author.trim() === "") return;
    setShowForm(true);
    setNewBlog({ title: "", summary: "", content: "", author: author.trim(), imageFile: null });
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newBlog.title || !newBlog.summary || !newBlog.content || !newBlog.imageFile || !newBlog.author) {
      alert("Please fill all required fields (title, summary, content, author, image).");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("title", newBlog.title);
      formData.append("summary", newBlog.summary);
      formData.append("content", newBlog.content);
      formData.append("author", newBlog.author);
      formData.append("image", newBlog.imageFile);

      const response = await axios.post("http://localhost:3001/add-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        // Optimistic update: Add the new blog to the state immediately
        const newBlogEntry = {
          ...response.data.blog,
          author: newBlog.author,
        };
        setBlogs((prevBlogs) => [...prevBlogs, newBlogEntry]);
        setShowForm(false);
        setNewBlog({ title: "", summary: "", content: "", author: user.username, imageFile: null });
        // Fetch the latest blogs to confirm
        await fetchBlogs();
        alert("Blog added successfully!");
      } else {
        alert("Failed to add blog: " + response.data.message);
      }
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("Failed to add blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowForm(false);
    setNewBlog({ title: "", summary: "", content: "", author: user.username, imageFile: null });
  };

  const handleLogout = () => navigate("/login");

  const filteredBlogs = showFavorites
    ? blogs.filter((blog) => favorites.includes(blog._id))
    : blogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container3">
      <div className="header-container3">
        <h1 className="header3">My Blogs</h1>
        <div className="profile-menu3">
          <ProfileMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
      <div className="welcome-message3">
        Welcome, <strong>{user?.username}</strong>!
      </div>
      <div className="search-container3">
        <input
          type="text"
          placeholder="Search my blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input3"
        />
        <div className="button-container3">
          <button onClick={handleNewBlog} className="add-button3">
            <Add /> Add Blog
          </button>
          <div className="favorite-button3" onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
          </div>
        </div>
      </div>
      {showForm && (
        <form onSubmit={handleAddBlog} className="form3">
          <input
            type="text"
            placeholder="Title"
            className="input3"
            value={newBlog.title}
            onChange={(e) => setNewBlog((prev) => ({ ...prev, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Summary"
            className="input3"
            value={newBlog.summary}
            onChange={(e) => setNewBlog((prev) => ({ ...prev, summary: e.target.value }))}
          />
          <textarea
            placeholder="Write your blog content here..."
            className="input3 textarea3"
            value={newBlog.content}
            onChange={(e) => setNewBlog((prev) => ({ ...prev, content: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Author"
            className="input3"
            value={newBlog.author}
            onChange={(e) => setNewBlog((prev) => ({ ...prev, author: e.target.value }))}
          />
          <input type="file" accept="image/*" className="input3" onChange={(e) => handleImageUpload(e, true)} />
          <div className="form-actions3">
            <button type="submit" className="save-button3" disabled={loading}>
              <Save /> {loading ? "Publishing..." : "Publish"}
            </button>
            <button type="button" onClick={handleCancelAdd} className="cancel-button3" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="blog-list3">
        {loading ? (
          <p>Loading blogs...</p>
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-item3"
              style={{
                backgroundImage: `url(${blog.image?.data ? `data:${blog.image.contentType};base64,${blog.image.data}` : "https://via.placeholder.com/800x200?text=No+Image"})`,
              }}
            >
              {editMode === blog._id ? (
                <>
                  <input
                    type="text"
                    value={editedBlog.title || ""}
                    onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                    className="input3"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editedBlog.summary || ""}
                    onChange={(e) => setEditedBlog({ ...editedBlog, summary: e.target.value })}
                    className="input3"
                    placeholder="Summary"
                  />
                  <textarea
                    value={editedBlog.content || ""}
                    onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
                    className="input3 textarea3"
                    placeholder="Content"
                  />
                  <input
                    type="text"
                    value={editedBlog.author || ""}
                    onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
                    className="input3"
                    placeholder="Author"
                  />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="input3" />
                  <button onClick={handleSave} className="save-button3" disabled={loading}>
                    <Save /> {loading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <>
                  <h2>{blog.title}</h2>
                  <p>{blog.summary}</p>
                  <h3 className="quote3">
                    {blog.content} <br /> - <strong>{blog.author}</strong>
                  </h3>
                </>
              )}
              <div className="action-buttons3">
                <button onClick={() => toggleFavorite(blog._id)} className="favorite-button3">
                  {favorites.includes(blog._id) ? <Favorite /> : <FavoriteBorder />} Favorite
                </button>
                <button onClick={() => handleEdit(blog)} className="edit-button3" disabled={loading}>
                  <Edit /> Edit
                </button>
                <button onClick={() => handleDelete(blog._id)} className="delete-button3" disabled={loading}>
                  <Delete /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your blogs are empty. Add a new blog to get started!</p>
        )}
      </div>
      <footer className="footer">
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Contact: support@fusiondiaries.com")}>
          Help
        </a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Fusion Diaries is a blog platform.")}>
          About
        </a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Join Fusion Diaries for writing opportunities.")}>
          Careers
        </a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("We prioritize user privacy.")}>
          Privacy
        </a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Follow our community guidelines.")}>
          Terms
        </a>
      </footer>
      {showPopup && (
        <div className="popup-overlay3" onClick={closePopup}>
          <div className="popup3" onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button className="close-button3" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}