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
  const [editMode, setEditMode] = useState(null);
  const [editedBlog, setEditedBlog] = useState({});
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/user-blogs?email=${user.email}`);
      if (response.data.success) setBlogs(response.data.blogs);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (err.response && err.response.status === 404) {
        setBlogs([]);
      }
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
    setEditedBlog({ ...blog });
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
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
        // Update the blogs state with the updated blog
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === editedBlog._id ? response.data.blog : blog
          )
        );
        setEditMode(null);
        alert("Blog updated successfully!");
      } else {
        alert("Failed to update blog. Please try again.");
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Failed to update blog. Please check the server.");
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete("http://localhost:3001/delete-blog", { data: { email: user.email, id } });
        await fetchBlogs(); // Refetch blogs after successful deletion
        alert("Blog deleted successfully!");
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog. Please check the server.");
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditedBlog((prev) => ({ ...prev, image: reader.result, imageFile: file }));
      reader.readAsDataURL(file);
    }
  };

  const handleNewBlog = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const newBlog = { title: "New Blog", content: "Write something...", author: user.username, summary: "Blog Summary", image: "" };
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("title", newBlog.title);
      formData.append("summary", newBlog.summary);
      formData.append("content", newBlog.content);
      formData.append("author", user.username);

      const response = await axios.post("http://localhost:3001/add-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        await fetchBlogs(); // Refetch blogs to update the list
        setEditMode(response.data.blog._id);
        setEditedBlog(response.data.blog);
        alert("Blog added successfully!");
      } else {
        alert("Failed to add blog. Please try again.");
      }
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("Failed to add blog. Please check the server.");
    }
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
      <div className="search-container3">
        <input
          type="text"
          placeholder="Search my blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input3"
        />
        <div className="button-container3">
          <button onClick={handleNewBlog} className="add-button3"><Add /> Add</button>
          <div className="favorite-button3" onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
          </div>
        </div>
      </div>
      <div className="blog-list3">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-item3"
              style={{ backgroundImage: `url(${blog.image || process.env.PUBLIC_URL + '/default-image.jpg'})` }}
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
                    className="input3"
                    placeholder="Content"
                  />
                  <input
                    type="text"
                    value={editedBlog.author || ""}
                    onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
                    className="input3"
                    placeholder="Author (optional, defaults to your username)"
                  />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="input3" />
                  <button onClick={handleSave} className="save-button3"><Save /> Save</button>
                </>
              ) : (
                <>
                  <h2>{blog.title}</h2>
                  <p>{blog.summary}</p>
                  <h3 className="quote3">{blog.content} <br /> - <strong>{blog.author}</strong></h3>
                </>
              )}
              <div className="action-buttons3">
                <button onClick={() => toggleFavorite(blog._id)} className="favorite-button3">
                  {favorites.includes(blog._id) ? <Favorite /> : <FavoriteBorder />} Favorite
                </button>
                <button onClick={() => handleEdit(blog)} className="edit-button3"><Edit /> Edit</button>
                <button onClick={() => handleDelete(blog._id)} className="delete-button3"><Delete /> Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your blogs are empty.</p>
        )}
      </div>
      <footer className="footer">
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Contact: support@fusiondiaries.com")}>Help</a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Fusion Diaries is a blog platform.")}>About</a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Join Fusion Diaries for writing opportunities.")}>Careers</a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("We prioritize user privacy.")}>Privacy</a>
        <a href="#" className="footer-link" onClick={() => handleFooterClick("Follow our community guidelines.")}>Terms</a>
      </footer>
      {showPopup && (
        <div className="popup-overlay3" onClick={closePopup}>
          <div className="popup3" onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button className="close-button3" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}