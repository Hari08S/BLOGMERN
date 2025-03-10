import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import blogs from "../data";
import "./Reader.css"; // Import external CSS file

function ProfileMenu() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="nav2" onClick={toggleDropdown}>
      <AccountCircleIcon className="icon2" />
      {dropdownOpen && (
        <div className="dropdownMenu2">
          <div className="dropdownItem2" onClick={() => navigate("/profile")}>
            My Profile
          </div>
          <div
            className="dropdownItem2"
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
    <div className="container2">
      <div className="headerContainer2">
        <h1 className="header2">Search Blogs</h1>
        <div className="profileMenu2">
          <ProfileMenu />
        </div>
      </div>
      <div className="searchContainer2">
        <input
          type="text"
          placeholder="Search for a blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <div className="favoriteButton2" onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? <Favorite /> : <FavoriteBorder />} Favorites
        </div>
      </div>
      <div>
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="blogItem2"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/${blog.image})`,
            }}
          >
            <h2>{blog.title}</h2>
            <p>{blog.summary}</p>
            <h3 className="quote2">
              {blog.content} <br /> - <strong>{blog.author}</strong>
            </h3>
            <div className="alignbutton2">
              <button onClick={() => toggleFavorite(blog.id)} className="favoriteButton2">
                {favorites.includes(blog.id) ? <Favorite /> : <FavoriteBorder />} Favorite
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer className="footer">
        <a href="#" className="footerLink" onClick={() => handleFooterClick("For queries, contact us at support@fusiondiaries.com")}>
          Help
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("Fusion Diaries is a blog platform where users can share their stories and experiences.")}>
          About
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("Joining Fusion Diaries can enhance your writing skills and open new career opportunities in content creation.")}>
          Careers
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("We value your privacy. Your personal data will not be shared without your consent.")}>
          Privacy
        </a>
        <a href="#" className="footerLink" onClick={() => handleFooterClick("By using this platform, you agree to follow our community guidelines and content policies.")}>
          Terms
        </a>
      </footer>

      {showPopup && (
        <div className="popupOverlay2" onClick={closePopup}>
          <div className="popup2" onClick={(e) => e.stopPropagation()}>
            <p>{popupContent}</p>
            <button className="closeButton2" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reader;
