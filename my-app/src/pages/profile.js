import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

export default function Profile({ user, onUserUpdate }) {
  const [gender, setGender] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setGender(user.gender || "Not specified");
      setProfileImage(user.profileImage || null);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("gender", gender);
      if (selectedImage) formData.append("profileImage", selectedImage);

      const response = await axios.post("http://localhost:3001/update-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setEditMode(false);
        const updatedUser = response.data.user;
        onUserUpdate(updatedUser);
      } else {
        alert("Failed to update profile: " + response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to update profile.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-container">
          {profileImage ? (
            <img src={profileImage} alt="User Avatar" className="avatar" />
          ) : (
            <div className="empty-avatar">?</div>
          )}
        </div>

        {editMode && ( // Conditionally render the file upload section only in edit mode
          <div className="file-upload-container">
            <input type="file" accept="image/*" id="fileUpload" onChange={handleImageUpload} hidden />
            <label htmlFor="fileUpload" className="file-upload-btn">
              📸 Choose Photo
            </label>
            {selectedImage && <p className="file-name">Photo Selected</p>}
          </div>
        )}

        <h2>{user.username}</h2>
        <hr className="divider" />

        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <hr className="divider" />

        <p>
          <strong>Join:</strong> {formattedDate}
        </p>
        <hr className="divider" />

        <p>
          <strong>Gender:</strong>
        </p>
        {editMode ? (
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" value="Male" checked={gender === "Male"} onChange={() => setGender("Male")} /> Male
            </label>
            <label className="radio-option">
              <input type="radio" value="Female" checked={gender === "Female"} onChange={() => setGender("Female")} />{" "}
              Female
            </label>
          </div>
        ) : (
          <p>{gender}</p>
        )}

        <hr className="divider" />
        <div className="button-group">
          {editMode ? (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
          <button className="back-btn" onClick={() => navigate("/choose-role")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}