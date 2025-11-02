import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { Plus, FolderOpen, Image, Heart, Trash2, Calendar } from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import AddSharing from "./AddSharing";
import Sidebar from "./Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SharedAlbums = () => {
  const {
    addNewSharing,
    setAddNewSharing,
    loading,
    setLoading,
    backendUrl,
    albumToggleFavorite,
  } = useImageContext();
  const [sharedAlbums, setSharedAlbums] = useState([]);
  const navigate = useNavigate();

  const fetchSharedAlbums = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/albums/shared`, {
        withCredentials: true,
      });
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setSharedAlbums(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromSharing = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/albums/${id}/remove_access`,
        {},
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      await fetchSharedAlbums(); 
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedAlbums();
  }, []);

  return (
    <>
      {addNewSharing && <AddSharing />}
      {loading ? (
        <Loading />
      ) : (
        <div className="main-layout">
          <Sidebar />
          <div className="content-area">
            <Navbar />

            <div className="albums-container">
              <div className="albums-header">
                <div className="albums-header-content">
                  <div className="photos-title-section">
                    <h1>Albums Shared with me</h1>
                    <p>View albums that others have shared with you</p>
                  </div>
                </div>
              </div>

              <div className="albums-main-content">
                {sharedAlbums && sharedAlbums.length > 0 ? (
                  <div className="albums-grid">
                    {sharedAlbums.map((album) => (
                      <div
                        key={album._id}
                        className="album-card"
                        onClick={() =>
                          navigate(`/album-details/${album.albumId}`)
                        }>
                        <div className="album-cover">
                          <div className="album-cover-overlay">
                            <span className="album-image-count">
                              <Image size={16} />
                              {album.imageCount || 0} photos
                            </span>
                          </div>

                          <div
                            className={`album-favorite-badge ${
                              album.isFavorite ? "active" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              albumToggleFavorite(album, fetchSharedAlbums);
                            }}>
                            <Heart
                              size={20}
                              fill={album.isFavorite ? "white" : "none"}
                              color={album.isFavorite ? "white" : "#64748b"}
                            />
                          </div>

                          <div
                            className="album-trash-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromSharing(album.albumId);
                            }}>
                            <Trash2 size={20} />
                          </div>
                        </div>

                        <div className="album-content">
                          <div className="album-header">
                            <h3 className="album-title">{album.name}</h3>
                          </div>

                          <p className="album-description">
                            {album.description || "No description"}
                          </p>

                          <div className="album-footer">
                            <span className="album-date">
                              <Calendar size={14} />
                              {new Date(album.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="album-size">
                              {album.formattedSize || "0 Bytes"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-albums">
                    <div className="empty-albums-icon">
                      <FolderOpen size={40} color="#3b82f6" />
                    </div>
                    <h3>No shared albums found</h3>
                    <p>
                      No one has shared any albums with you yet
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => navigate("/albums")}>
                      <Plus size={18} />
                      Go To My Albums
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharedAlbums;