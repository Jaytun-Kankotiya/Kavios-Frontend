import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  HardDrive,
  Image,
  Folder,
  Heart,
  Tag,
  Users,
  LogOut,
  Edit2,
  Save,
  X,
  Trash2,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../Feature Pages/Sidebar/Sidebar";
import Navbar from './Navbar'
import Loading from "./Loading";
import "./Profile.css";
import api from "../utils/axios";

const MyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${backendUrl}/api/user/profile`, {
        withCredentials: true,
      });

      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.user.name,
          email: data.data.user.email,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ name: profile.user.name, email: profile.user.email });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put(
        `${backendUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        setProfile({
          ...profile,
          user: data.data,
        });
        setEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(
        `${backendUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className={`stat-icon stat-icon-${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="profile-error">
            <p>Failed to load profile. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="profile-content">
          <div className="profile-header-card">
            <div className="profile-header-content">
              <div className="profile-user-section">
                <div className="profile-avatar">
                  {profile.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-user-info">
                  {editing ? (
                    <div className="profile-edit-form">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="profile-edit-input"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="profile-edit-input"
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="profile-name">{profile.user.name}</h1>
                      <div className="profile-email">
                        <Mail size={16} />
                        <span>{profile.user.email}</span>
                      </div>
                      <div className="profile-date">
                        <Calendar size={16} />
                        <span>
                          Member since{" "}
                          {new Date(profile.user.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="profile-actions">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="profile-btn profile-btn-save">
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="profile-btn profile-btn-cancel">
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="profile-btn profile-btn-edit">
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="profile-btn profile-btn-logout">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Storage Overview</h2>
            <div className="stats-grid">
              <StatCard
                icon={HardDrive}
                label="Total Storage"
                value={profile.storage.combined.formattedSize}
                color="blue"
              />
              <StatCard
                icon={Image}
                label="Total Images"
                value={profile.storage.combined.totalImages}
                color="green"
              />
              <StatCard
                icon={Folder}
                label="Total Albums"
                value={profile.storage.combined.totalAlbums}
                color="purple"
              />
            </div>
          </div>

          <div className="profile-grid">

            <div className="profile-section">

              <h3 className="section-title">Your Content</h3>

              <div className="content-stats">

                <div className="content-stat content-stat-blue">
                  <span className="content-stat-label">Owned Albums</span>
                  <span className="content-stat-value">
                    {profile.storage.owned.totalAlbums}
                  </span>
                </div>

                <div className="content-stat content-stat-blue">
                  <span className="content-stat-label">Owned Images</span>
                  <span className="content-stat-value">
                    {profile.storage.owned.totalImages}
                  </span>
                </div>

                <div className="content-stat content-stat-green">
                  <span className="content-stat-label">Shared Albums</span>
                  <span className="content-stat-value">
                    {profile.storage.shared.totalAlbums}
                  </span>
                </div>

                <div className="content-stat content-stat-green">
                  <span className="content-stat-label">Shared Images</span>
                  <span className="content-stat-value">
                    {profile.storage.shared.totalImages}
                  </span>
                </div>

              </div>
            </div>

            <div className="profile-section">

              <h3 className="section-title">Activity & Favorites</h3>

              <div className="activity-stats">

                <div className="activity-stat activity-stat-purple">
                  <Heart size={24} />
                  <div className="activity-stat-content">
                    <p className="activity-stat-label">Favorite Images</p>
                    <p className="activity-stat-value">
                      {profile.storage.combined.favoriteImages}
                    </p>
                  </div>
                </div>

                <div className="activity-stat activity-stat-orange">
                  <Clock size={24} />
                  <div className="activity-stat-content">
                    <p className="activity-stat-label">
                      Recent Uploads (7 days)
                    </p>
                    <p className="activity-stat-value">
                      {profile.recentActivity.recentImages}
                    </p>
                  </div>
                </div>

                <div className="activity-stat activity-stat-red">
                  <Trash2 size={24} />
                  <div className="activity-stat-content">
                    <p className="activity-stat-label">Items in Trash</p>
                    <p className="activity-stat-value">
                      {profile.trash.trashedImages + profile.trash.trashedAlbums}
                    </p>
                  </div>
                </div>
                
                {profile.recentActivity.lastUpload && (
                  <div className="activity-stat activity-stat-gray">
                    <div className="activity-stat-content">
                      <p className="activity-stat-label">Last Upload</p>
                      <p className="activity-stat-text">
                        {new Date(
                          profile.recentActivity.lastUpload
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;


// import axios from "axios";
// import { OAuth2Client } from "google-auth-library";
// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleAuth = async (req, res) => {
//   try {
//     const { code } = req.body;

//     if (!code) {
//       return res
//         .status(400)
//         .json({ message: "Authorization code is required" });
//     }

//     const { data } = await axios.post("https://oauth2.googleapis.com/token", {
//       code,
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: process.env.GOOGLE_REDIRECT_URI,
//       grant_type: "authorization_code",
//     });

//     const idToken = data.id_token;
//     if (!idToken) {
//       return res
//         .status(400)
//         .json({ message: "Failed to retrieve ID token from Google" });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     console.log("Google user payload:", payload);

//     let user = await User.findOne({
//       $or: [
//         { email: payload.email },
//         { googleId: payload.sub },
//         { userId: payload.sub },
//       ],
//     });

//     if (!user) {
//       user = await User.create({
//         userId: payload.sub,
//         googleId: payload.sub,
//         email: payload.email,
//         name: payload.name,
//         avatar: payload.picture,
//         authProvider: "google",
//       });
//     }

//     const token = jwt.sign(
//       { userId: user.userId, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax',
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ message: "Login successful", user });
//   } catch (error) {
//     console.error("Google OAuth error:", error.message);
//     res.status(400).json({
//       message: "Google OAuth failed",
//       error: error.message,
//     });
//   }
// };






// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.token ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error.message);
//   }
// };