import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { Plus, Image, Heart, Trash2, FolderOpen, Calendar, History, TrendingUpDown } from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import ImagePreview from "./photos/PhotoPreview";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Trash = () => {
  const {
    loading,
    setLoading,
    backendUrl,
    setImagePreview,
    favoriteImages,
    favoriteAlbums,
    imageToggleFavorite,
    imageDeleteHandler,
    albumToggleFavorite,
    albumDeleteHandler
  } = useImageContext();

  const [trashImages, setTrashImages] = useState([]);
  const [trashAlbums, setTrashAlbums] = useState([]);

  const fetchImageTrash = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/images/trash/all`, {
        withCredentials: true,
      });
      if (!data.success) {
        toast.error(data.message);
      }
      setTrashImages(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumTrash = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/albums/trash/all`, {
        withCredentials: true,
      });
      if (!data.success) {
        toast.error(data.message);
      }
      setTrashAlbums(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageRestore = async (id) => {
    setLoading(true)
    try {
      const {data} = await axios.post(`${backendUrl}/api/images/trash/${id}/restore`, {withCredentials: true})
      if(!data.success){
        toast.error(data.message)
      }
      fetchImageTrash()
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImageTrash();
    fetchAlbumTrash;
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ImagePreview />

      {/* Favorite Images */}
      <div className="favorite-main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Favorite Images</h1>
                <p>{trashImages?.length || 0} photos you love</p>
              </div>
            </div>
          </div>

          <div className="photos-main">
            {trashImages && trashImages.length > 0 ? (
              <div className="photo-grid">
                {trashImages.map((image) => (
                  <div
                    className="photo-card"
                    key={image._id}
                    onClick={() => setImagePreview(image)}>
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.name || "Photo"}
                      className="photo-img"
                    />
                    <div
                      className={`album-favorite-badge ${
                        image.isFavorite ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        imageToggleFavorite(image, fetchImageTrash);
                      }}>
                      <Heart
                        size={20}
                        fill={image.isFavorite ? "white" : "none"}
                        color={image.isFavorite ? "white" : "#64748b"}
                      />
                    </div>
                    <div
                      className="image-trash-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        imageRestore(image.imageId);
                      }}>
                      <History  size={20} />
                    </div>
                    <div className="photo-overlay">
                      <h4 className="photo-title">
                        {image.name || "Untitled"}
                      </h4>
                      <p className="photo-tags">
                        {image.tags?.length
                          ? image.tags.join(", ")
                          : "No tags added"}
                      </p>
                      <span className="photo-size">
                        {image.formattedSize || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="no-photos">
                  <Image size={64} color="#cbd5e1" strokeWidth={1.5} />
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#334155",
                      }}>
                      No favorite images yet
                    </h3>
                    <p
                      style={{ margin: 0, fontSize: "15px", color: "#64748b" }}>
                      Mark some photos as favorites to see them here
                    </p>
                    <div className="photos-header-actions mt-2">
                      <button
                        className="view-toggle-btn"
                        onClick={() => setNewImage(true)}>
                        <Plus size={18} />
                        Add an Image
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Favorite Albums */}
      <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "0" }} />

      <div className="favorite-main-layout">
        <div className="content-area">
          <div className="albums-header">
            <div className="albums-header-content">
              <div className="albums-title-section">
                <h1>Favorite Albums</h1>
                <p>
                  {trashAlbums.length} Albums • Organize your photos into
                  beautiful collections
                </p>
              </div>
            </div>
          </div>

          <div className="albums-main-content">
            {trashAlbums && trashAlbums?.length > 0 ? (
              <div className="albums-grid">
                {trashAlbums?.map((album) => (
                  <div
                    key={album._id}
                    className="album-card"
                    onClick={() => navigate(`/album-details/${album.albumId}`)}>
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
                          albumToggleFavorite(album, fetchAlbumTrash);
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
                          albumDeleteHandler(
                            album.albumId,
                            album.name,
                            album.imageCount,
                            fetchAlbumTrash
                          );
                        }}>
                        <History size={20} />
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
                <h3>No albums found</h3>
                <p>
                  {favoriteAlbums.length === 0
                    ? "You haven't marked any albums as favorite yet"
                    : "Create your first album to organize your photos"}
                </p>
                <button
                  className="primary-button"
                  onClick={() => setNewAlbum(true)}>
                  <Plus size={18} />
                  Create Album
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trash;
