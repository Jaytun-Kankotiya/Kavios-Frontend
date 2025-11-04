import Navbar from "../components/Navbar";
import { Plus, Image, Heart, Trash2, FolderOpen, Calendar } from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";
import "./photos/photo.css";
import Loading from "../components/Loading";
import AddNewImage from "./photos/AddNewPhoto";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImagePreview from "./photos/PhotoPreview";
import AddNewAlbum from "./albums/AddNewAlbum";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Favorite = () => {
  const {
    backendUrl,
    setImagePreview,
    imageToggleFavorite,
    imageDeleteHandler,
    fetchFavoriteAlbums,
    favoriteAlbums,
    loading,
    setLoading,
    newAlbum,
    setNewAlbum,
    albumDeleteHandler,
    albumToggleFavorite,
    search, setSearch
  } = useImageContext();

  const [newImage, setNewImage] = useState(false);
  const [favoriteImages, setFavoriteImages] = useState([]);

  const navigate = useNavigate();

  const fetchFavoriteImages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `${backendUrl}/api/images/favorites/all`,
        {
          withCredentials: true,
        }
      );

      if (!data.success) {
        toast.error(data.message);
      }
      setFavoriteImages(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteImages();
    fetchFavoriteAlbums();
    setSearch("")
  }, []);

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchFavoriteImages();
  };

  const searchValue = search?.trim().toLowerCase() || "";

  const filteredFavorites = !searchValue
    ? { images: favoriteImages, albums: favoriteAlbums }
    : {
        images: (favoriteImages || []).filter((img) =>
          img.name?.toLowerCase().includes(searchValue)
        ),
        albums: (favoriteAlbums || []).filter((album) =>
          album.name?.toLowerCase().includes(searchValue)
        ),
      };


  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage onClose={handleImageAdded} />}
      {newAlbum && <AddNewAlbum />}
      <ImagePreview images={favoriteImages} />

      <div className="favorite-main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Favorite Images</h1>
                <p>{filteredFavorites.images?.length || 0} photos you love</p>
              </div>

              <div className="photos-header-actions">
                <button
                  className="primary-button"
                  onClick={() => setNewImage(true)}>
                  <Plus size={18} />
                  Add an Image
                </button>
              </div>
            </div>
          </div>

          <div className="photos-main">
            {filteredFavorites.images?.length > 0 ? (
              <div className="photo-grid">
                {filteredFavorites.images?.map((image) => (
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
                        imageToggleFavorite(image, fetchFavoriteImages);
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
                        imageDeleteHandler(image.imageId, fetchFavoriteImages);
                      }}>
                      <Trash2 size={20} />
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
                      {search ? "No photos found" : "No favorite images yet"}
                    </h3>
                    <p
                      style={{ margin: 0, fontSize: "15px", color: "#64748b" }}>
                      {search
                        ? "No photos match your search"
                        : "Mark some photos as favorites to see them here"}
                    </p>
                    <div className="photos-header-actions mt-2">
                      <button
                        className="view-toggle-btn"
                        onClick={() => navigate("/photos")}>
                        <Plus size={18} />
                        Set Favorite Images
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
              <div className="photos-title-section">
                <h1>Favorite Albums</h1>
                <p>
                  {filteredFavorites.albums?.length} Albums • Organize your
                  photos into beautiful collections
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setNewAlbum(true)}>
                <Plus size={18} />
                Create Album
              </button>
            </div>
          </div>

          <div className="albums-main-content">
            {filteredFavorites.albums?.length > 0 ? (
              <div className="albums-grid">
                {filteredFavorites.albums?.map((album) => (
                  <div
                    key={album._id}
                    className="album-card"
                    onClick={() => navigate(`/album-details/${album.albumId}`)}>
                    <div className="album-cover">
                      <div className="album-cover-overlay">
                        <span className="album-image-count">
                          <Image size={16} />
                          {album.totalImages || 0} photos
                        </span>
                      </div>

                      <div
                        className={`album-favorite-badge ${
                          album.isFavorite ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          albumToggleFavorite(album, fetchFavoriteAlbums);
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
                            fetchFavoriteAlbums
                          );
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
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#334155",
                  }}>
                  {search
                    ? "No albums found"
                    : "No favorite albums yet"}
                </h3>
                <p style={{ margin: 0, fontSize: "15px", color: "#64748b" }}>
                  {favoriteAlbums.length === 0
                    ? "You haven't marked any albums as favorite yet"
                    : "No albums match your search"}
                </p>

                <button
                  className="primary-button mt-2"
                  onClick={() => navigate("/albums")}>
                  <Plus size={18} />
                  Set Favorite Albums
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorite;
