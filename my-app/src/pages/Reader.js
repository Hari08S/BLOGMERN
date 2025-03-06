import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import blogs from "../data";

function ProfileMenu() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div style={styles.nav} onClick={toggleDropdown}>
      <AccountCircleIcon style={{ cursor: "pointer", fontSize: "2rem" }} />
      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          <div style={styles.dropdownItem} onClick={() => navigate("/profile")}>
            My Profile
          </div>
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

function Reader() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const handleFooterClick = (content) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Search Blogs</h1>
        <div style={styles.profileMenu}>
          <ProfileMenu />
        </div>
      </div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for a blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <div
          style={styles.favoriteButton}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
        </div>
      </div>
      <div>
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            style={{
              ...styles.blogItem,
              backgroundImage: `url(${process.env.PUBLIC_URL}/${blog.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
            }}
          >
            <h2>{blog.title}</h2>
            <p>{blog.summary}</p>
            <h3 style={styles.quote}>
              {blog.content} <br /> - <strong>{blog.author}</strong>
            </h3>
            <div style={styles.alignbutton}>
              <button
                onClick={() => toggleFavorite(blog.id)}
                style={styles.favoriteButton}
              >
                {favorites.includes(blog.id) ? <Favorite /> : <FavoriteBorder />} Favorite
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
  input: {
    padding: "10px",
    fontSize: "1rem",
    width: "60%",
    border: "2px solid #86B890",
    borderRadius: "5px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  favoriteButton: {
    backgroundColor: "#FFC107",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    fontWeight: "bold",
    alignItems: "center",
    color: "#333333",
  },
  blogItem: {
    border: "2px solidrgb(14, 31, 17)",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    color: "#fff",
  },
  profileMenu: {
    position: "absolute",
    right: "10px", 
  },
  alignbutton: {
    display: "flex",
    justifyContent: "center",
  },
  quote: {
    fontStyle: "italic",
    color: "#fff",
    marginTop: "10px",
  },
  footer: {
    width: "101.2%",
    borderTop: "1px solid #ddd",
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    backgroundColor: "black",
    color: "white",
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

export default Reader;
