import { useState, useEffect } from "react";
import { X, UserPlus, Mail, Trash2, Users } from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import { toast } from "react-toastify";
import "./Sidebar/Sidebar.css";
import "./FeaturePages.css";
import api from "../utils/axios";

const AddSharing = ({ albumId, currentSharedUsers = [], onSharingUpdate }) => {
  const { loading, setLoading, setAddNewSharing, backendUrl } =
    useImageContext();
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [sharedUsers, setSharedUsers] = useState(currentSharedUsers);

  useEffect(() => {
    setSharedUsers(currentSharedUsers);
  }, [currentSharedUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setAdding(true);
    try {
      const { data } = await api.post(
        `${backendUrl}/api/albums/${albumId}/share`,
        { emails: [email] },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setSharedUsers(data.data.sharedUsers);
      if (onSharingUpdate) onSharingUpdate();
      setAddNewSharing(false);
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setAdding(false);
    }
  };

  const handleRemoveUser = async (userEmail) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        `${backendUrl}/api/albums/${albumId}/remove_access`,
        { email: userEmail },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setSharedUsers(data.data.sharedUsers);
      if (onSharingUpdate) onSharingUpdate();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addalbum-outer">
      <div className="addAlbum-main share-modal-container">
        <div className="addAlbum-header">
          <p>Share Album</p>
          <X
            size={22}
            className="close-icon"
            onClick={() => setAddNewSharing(false)}
          />
        </div>

        <form onSubmit={handleAddUser} className="share-form">
          <div className="addalbum-inputs">
            <div className="share-email-input-wrapper">
              <Mail size={18} className="share-email-icon" />
              <input
                type="email"
                placeholder="Enter email address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="share-email-input"
                required
              />
            </div>
          </div>

          <button
            className="addAlbum-button share-add-button"
            type="submit"
            disabled={loading}>
            {adding ? (
              "Adding..."
            ) : (
              <>
                <UserPlus size={18} />
                Add User
              </>
            )}
          </button>
        </form>

        <div className="shared-users-section">
          <div className="shared-users-header">
            <Users size={18} />
            <span>Shared with ({sharedUsers.length})</span>
          </div>

          {sharedUsers.length > 0 ? (
            <div className="shared-users-list">
              {sharedUsers.map((user, index) => (
                <div key={index} className="shared-user-item">
                  <div className="shared-user-info">
                    <div className="shared-user-avatar">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="shared-user-email">{user.email}</span>
                  </div>

                  <button
                    onClick={() => handleRemoveUser(user.email)}
                    disabled={loading}
                    className="shared-user-remove-btn"
                    title="Remove access">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="shared-users-empty">
              <Users size={32} className="shared-users-empty-icon" />
              <p className="shared-users-empty-text">
                This album hasn't been shared yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSharing;
