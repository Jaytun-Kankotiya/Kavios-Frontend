import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  Download,
  Grid,
  List,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AlbumDetails.css";
import axios from "axios";
import { toast } from "react-toastify";

const AlbumDetails = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading, fetchAlbums, albums, backendUrl } =
    useImageContext();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);

  useEffect(() => {
    (async () => {
      await fetchAlbums();
    })();
  }, []);

  useEffect(() => {
    if (albums.length > 0 && albumId) {
      const album = albums.find((a) => a.albumId === albumId);
      if (album) {
        setCurrentAlbum(album);
        fetchAlbumImages(albumId);
      } else {
        console.warn("Album not found for ID:", albumId);
      }
    }
  }, [albums, albumId]);

  const fetchAlbumImages = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/albums/${id}/images`,
        {
          withCredentials: true,
        }
      );
      if (!data.success) {
        toast.error(error.response?.data?.message || error.message);
      }
      setAlbumImages(data.data || []);
    } catch (error) {
      console.error("Error fetching album images:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBack = () => navigate(-1);

  if (loading) return <Loading />;

  if (!currentAlbum) {
    return (
      <div className="album-container">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="album-main-content">
            <p>Album not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="album-container">
      <Sidebar />
      <div className="content-area">
        <Navbar />

        <div className="album-header">
          <div className="album-header-content">
            <div className="header-left">
              <button className="back-button" onClick={handleBack}>
                <ArrowLeft size={20} color="#475569" />
              </button>
              <div>
                <h1 className="header-title">{currentAlbum.name}</h1>
                <p className="header-subtitle">
                  {currentAlbum.imageCount || albumImages.length} photos
                  {currentAlbum.isFavorite && " • Favorite"}
                </p>
              </div>
            </div>

            <div className="header-actions">
              <button className="action-button">
                <Share2 size={16} />
                Share
              </button>
              <button className="action-button">
                <Download size={16} />
                Download All
              </button>
            </div>
          </div>
        </div>

        <div
          className="album-cover"
          style={{
            background: currentAlbum.coverImage
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${currentAlbum.coverImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="cover-content">
            <h2>{currentAlbum.description || "No description"}</h2>
            <p>
              Created{" "}
              {new Date(currentAlbum.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {currentAlbum.formattedSize &&
              currentAlbum.formattedSize !== "0 Bytes" && (
                <p>Total size: {currentAlbum.formattedSize}</p>
              )}
          </div>
        </div>

        <div className="album-toolbar">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode("grid")}
              className={`view-button ${viewMode === "grid" ? "active" : ""}`}>
              <Grid size={16} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`view-button ${viewMode === "list" ? "active" : ""}`}>
              <List size={16} />
              List
            </button>
          </div>

          {selectedImages.length > 0 && (
            <div className="selection-badge">
              {selectedImages.length} selected
            </div>
          )}
        </div>

        {albumImages.length > 0 ? (
          viewMode === "grid" ? (
            <div className="images-grid">
              {albumImages.map((image) => (
                <div
                  key={image._id}
                  onClick={() => toggleImageSelection(image._id)}
                  className={`image-card ${
                    selectedImages.includes(image._id) ? "selected" : ""
                  }`}>
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.name || "Album image"}
                  />
                  <div className="image-overlay">
                    <h3>{image.name || "Untitled"}</h3>
                    {image.tags && image.tags.length > 0 && (
                      <p>{image.tags.join(", ")}</p>
                    )}
                    <span>{image.formattedSize || "Unknown size"}</span>
                  </div>
                  {selectedImages.includes(image._id) && (
                    <div className="selection-checkmark">✓</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="images-list">
              {albumImages.map((image) => (
                <div
                  key={image._id}
                  onClick={() => toggleImageSelection(image._id)}
                  className={`list-item ${
                    selectedImages.includes(image._id) ? "selected" : ""
                  }`}>
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image._id)}
                    onChange={() => toggleImageSelection(image._id)}
                  />
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.name || "Album image"}
                  />
                  <div className="list-item-content">
                    <h4 className="list-item-title">
                      {image.name || "Untitled"}
                    </h4>
                    <p className="list-item-meta">
                      {image.tags?.length ? image.tags.join(", ") : "No tags"} •{" "}
                      {image.formattedSize || "Unknown size"}
                    </p>
                  </div>
                  <button className="list-item-menu">
                    <MoreVertical size={18} color="#64748b" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="empty-album">
            <div className="empty-album-content">
              <Grid size={48} color="#cbd5e1" />
              <h3>No photos yet</h3>
              <p>This album is empty. Add some photos to get started.</p>
              <button className="action-button">
                <Download size={16} />
                Upload Photos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetails;
