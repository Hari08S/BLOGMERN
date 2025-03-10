import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteBorder, Favorite, Edit, Delete, Add, Save } from "@mui/icons-material";
import initialBlogs from "../data";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Blogger.css"; // Import CSS file

function ProfileMenu() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="nav3" onClick={toggleDropdown}>
      <AccountCircleIcon className="profile-icon3" />
      {dropdownOpen && (
        <div className="dropdown-menu3">
          <div className="dropdown-item3" onClick={() => navigate("/profile")}>My Profile</div>
          <div
            className="dropdown-item3"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}

export default function Blogger() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [blogs, setBlogs] = useState(initialBlogs.slice(0, 3));
  const [editMode, setEditMode] = useState(null);
  const [editedBlog, setEditedBlog] = useState({});
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleFooterClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredBlogs = showFavorites
    ? blogs.filter((blog) => favorites.includes(blog.id))
    : blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );

  const handleEdit = (blog) => {
    setEditMode(blog.id);
    setEditedBlog({ ...blog });
  };

  const handleSave = (id) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => (blog.id === id ? editedBlog : blog))
    );
    setEditMode(null);
  };

  const handleDelete = (id) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedBlog((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewBlog = () => {
    const newBlog = {
      id: blogs.length + 1,
      title: "New Blog",
      content: "Write something...",
      author: "Anonymous",
      summary: "Blog Summary",
      image: "", 
    };
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    setEditMode(newBlog.id);
    setEditedBlog(newBlog);
  };

  return (
    <div className="container3">
      <div className="header-container3">
        <h1 className="header3">My Blogs</h1>
        <div className="profile-menu3">
          <ProfileMenu />
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
          <button onClick={handleNewBlog} className="add-button">
            <Add /> Add
          </button>
          <div className="favorite-button3" onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
          </div>
        </div>
      </div>

      <div className="blog-list3">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="blog-item3"
            style={{
              backgroundImage: `url(${blog.image || process.env.PUBLIC_URL + '/default-image.jpg'})`
            }}
          >
            {editMode === blog.id ? (
              <>
                <input
                  type="text"
                  value={editedBlog.title}
                  onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                  className="input3"
                />
                <textarea
                  value={editedBlog.content}
                  onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
                  className="input3"
                />
                <input
                  type="text"
                  value={editedBlog.author}
                  onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
                  className="input3"
                />
                <input
                  type="text"
                  value={editedBlog.summary}
                  onChange={(e) => setEditedBlog({ ...editedBlog, summary: e.target.value })}
                  className="input3"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input3"
                />
                <button onClick={() => handleSave(blog.id)} className="save-button3">
                  <Save /> Save
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
              <button onClick={() => toggleFavorite(blog.id)} className="favorite-button3">
                {favorites.includes(blog.id) ? <Favorite /> : <FavoriteBorder />} Favorite
              </button>
              <button onClick={() => handleEdit(blog)} className="edit-button3">
                <Edit /> Edit
              </button>
              <button onClick={() => handleDelete(blog.id)} className="delete-button3">
                <Delete /> Delete
              </button>
            </div>
          </div>
        ))}
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
            <button className="close-button3" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
