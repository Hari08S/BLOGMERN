import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteBorder, Favorite, Edit, Delete, Add, Save } from "@mui/icons-material";
import initialBlogs from "../data";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function ProfileMenu() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div style={styles.nav} onClick={toggleDropdown}>
      <AccountCircleIcon style={{ cursor: "pointer", fontSize: "2rem" }} />
      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>My Profile</div>
          <div
            style={styles.dropdownItem}
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
      image: "", // Placeholder
    };
    setBlogs((prevBlogs) => [ newBlog,...prevBlogs]);
    setEditMode(newBlog.id);
    setEditedBlog(newBlog);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>My Blogs</h1>
        <div style={styles.profileMenu}>
          <ProfileMenu />
        </div>
      </div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search my blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button onClick={handleNewBlog} style={styles.addButton}>
            <Add /> Add
          </button>
           <div
             style={styles.favoriteButton}
             onClick={() => setShowFavorites(!showFavorites)}
           >
            {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
             </div>
        </div>
      </div>
      <div style={styles.blogList}>
      {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                ...styles.blogItem,
                backgroundImage: `url(${blog.image || process.env.PUBLIC_URL + '/default-image.jpg'})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
              }}
            >
              {editMode === blog.id ? (
                <>
                  <input
                    type="text"
                    value={editedBlog.title}
                    onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
                    style={styles.input}
                  />
                  <textarea
                    value={editedBlog.content}
                    onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={editedBlog.author}
                    onChange={(e) => setEditedBlog({ ...editedBlog, author: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    value={editedBlog.summary}
                    onChange={(e) => setEditedBlog({ ...editedBlog, summary: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={styles.input}
                  />
                  <button onClick={() => handleSave(blog.id)} style={styles.saveButton}>
                    <Save /> Save
                  </button>
                </>
              ) : (
                <>
                  <h2>{blog.title}</h2>
                  <p>{blog.summary}</p>
                  <h3 style={styles.quote}>
                    {blog.content} <br /> - <strong>{blog.author}</strong>
                  </h3>
                </>
              )}
              <div style={styles.actionButtons}>
                <button
                   onClick={() => toggleFavorite(blog.id)}
                   style={styles.favoriteButton}
                >
                 {favorites.includes(blog.id) ? <Favorite /> : <FavoriteBorder />} Favorite
                  </button>
                <button onClick={() => handleEdit(blog)} style={styles.editButton}>
                  <Edit /> Edit
                </button>
                <button onClick={() => handleDelete(blog.id)} style={styles.deleteButton}>
                  <Delete /> Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      <footer style={styles.footer}>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("For queries, contact us at support@fusiondiaries.com")}>
          Help
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("Fusion Diaries is a blog platform where users can share their stories and experiences.")}>
          About
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("Joining Fusion Diaries can enhance your writing skills and open new career opportunities in content creation.")}>
          Careers
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("We value your privacy. Your personal data will not be shared without your consent.")}>
          Privacy
        </a>
        <a href="#" style={styles.footerLink} onClick={() => handleFooterClick("By using this platform, you agree to follow our community guidelines and content policies.")}>
          Terms
        </a>
      </footer>

      {showPopup && (
        <div style={styles.popupOverlay} onClick={closePopup}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button style={styles.closeButton} onClick={closePopup}>Close</button>
          </div>
        </div>
      )} 
    </div>
   
  );
}
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#163d77",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    backgroundColor: "#dbdec0",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center", 
    alignItems: "center",
    position: "relative", 
  },
  header: {
    fontSize: "2rem",
    color: "black",
    WebkitTextStroke: "0.5px red",
    fontFamily: "Irish Grover",
    
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  nav: {
    position: "relative",
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: "0px",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "150px",
    zIndex: 10,
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    color: "black",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
  },
  profileMenu: {
    position: "absolute",
    right: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    width: "60%",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  addButton: {
    backgroundColor: "#4caf50",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: "#ffcc00",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
  },
  blogList: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1, // Allows content to take up available space
  },
  blogItem: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    Color: "#fff",
    textAlign: "center",
    width: "90%",
  },
  quote: {
    fontStyle: "italic",
    color: "#fff", 
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#008CBA",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    color: "white",
    marginTop: "10px",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#4caf50",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
  },
  footer: {
    width: "100%",
    borderTop: "1px solid #ddd",
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    backgroundColor: "black",
    color: "white",
    marginTop: "auto", // Pushes the footer to the bottom
  },
  footerLink: {
    textDecoration: "none",
    color: "#fafafa",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    textAlign: "center",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 16px",
    border: "none",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  },
};
