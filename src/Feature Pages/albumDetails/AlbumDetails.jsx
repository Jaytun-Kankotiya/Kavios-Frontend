import { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import {
  Share2,
  Download,
  Grid,
  List,
  ArrowLeft,
  Heart,
  Trash2,
  Plus,
} from "lucide-react";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AlbumDetails.css";
import axios from "axios";
import { toast } from "react-toastify";
import AddNewImage from "../photos/AddNewPhoto";
import "../albums/Album.css";

const AlbumDetails = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const {
    fetchAlbums,
    albums,
    backendUrl,
    setImagePreview,
    imageToggleFavorite,
  } = useImageContext();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [newImage, setNewImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAlbumById = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/albums/${albumId}`, {
        withCredentials: true,
      });
      if (!data.success) {
        toast.error(data.message);
      }
      setCurrentAlbum(data.data || []);
    } catch (error) {
      toast.error(data.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/albums/${albumId}/images`,
        {
          withCredentials: true,
        }
      );
      if (!data.success) {
        toast.error(error.response?.data?.message || error.message);
      }
      setAlbumImages(data.data || null);
    } catch (error) {
      console.error("Error fetching album images:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAlbumById(), fetchAlbumImages()]);
      setLoading(false);
    };

    fetchData();
  }, [albumId]);

  const toggleImageSelection = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBack = () => navigate(-1);

  // if (loading) {
  //   return <Loading />;
  // }

  if (!currentAlbum) {
    return (
      <div className="albumDetails-container">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="albumDetails-main-content text-center mt-3 fs-4 ">
            <p>Album not found</p>
          </div>
        </div>
      </div>
    );
  }

  const imageDeleteHandler = async () => {
    console.log("Bulk delete endpoint hit!");
    if (selectedImages.length === 0) {
      toast.warning("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/bulk-delete`,
        {
          data: { imageIds: selectedImages },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      fetchAlbumImages();
      setSelectedImages([]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchAlbumImages();
  };

  return (
    <>
      {newImage && (
        <AddNewImage onClose={handleImageAdded} defaultAlbumId={albumId} />
      )}
      {loading && <Loading />}
      <div className="albumDetails-container">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="albumDetails-header">
            <div className="albumDetails-header-content">
              <div className="header-left">
                <button className="back-button" onClick={handleBack}>
                  <ArrowLeft size={20} color="#475569" />
                </button>
                <div>
                  <h1 className="header-title">{currentAlbum.name}</h1>
                  <p className="header-subtitle">
                    {albumImages.length} photos
                    {currentAlbum.isFavorite && " • Favorite"}
                  </p>
                </div>
              </div>

              <div className="header-actions">
                <button className="action-button">
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  className={`action-button ${
                    selectedImages.length > 0 && `download`
                  }`}>
                  <Download size={16} />
                  Download All
                </button>
              </div>
            </div>
          </div>

          <div className="details-container">
            <div
              className="albumDetails-cover"
              style={{
                background: currentAlbum.coverImage
                  ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${currentAlbum.coverImage})`
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
              <div className="maincover-content">
                <h2>{currentAlbum.description || "No description"}</h2>
                <p>
                  Created{" "}
                  {new Date(currentAlbum.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                {currentAlbum.formattedSize &&
                  currentAlbum.formattedSize !== "0 Bytes" && (
                    <p>Total size: {currentAlbum.formattedSize}</p>
                  )}
              </div>
            </div>

            <div className="albumDetails-toolbar">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`view-button ${
                    viewMode === "grid" ? "active" : ""
                  }`}>
                  <Grid size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`view-button ${
                    viewMode === "list" ? "active" : ""
                  }`}>
                  <List size={16} />
                  List
                </button>
              </div>

              {selectedImages.length > 0 && (
                <div className="d-flex gap-2">
                  <button
                    className="action-button trash"
                    onClick={imageDeleteHandler}>
                    <Trash2 size={16} /> Move to Trash
                  </button>
                  <div className="selection-badge">
                    {selectedImages.length} selected
                  </div>
                  <button
                    className="action-button"
                    onClick={() => setSelectedImages([])}>
                    Cancel
                  </button>
                </div>
              )}

              <div className="photos-header-actions">
                <button
                  className="view-toggle-btn"
                  onClick={() => setNewImage(true)}>
                  <Plus size={18} />
                  Add an Image
                </button>
              </div>
            </div>

            {albumImages.length > 0 ? (
              viewMode === "grid" ? (
                <div className="images-grid">
                  {albumImages.map((image) => (
                    <div
                      key={image._id}
                      onClick={() => toggleImageSelection(image.imageId)}
                      className={`image-card ${
                        selectedImages.includes(image.imageId) ? "selected" : ""
                      }`}>
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.name || "Album image"}
                      />
                      <div
                        className={`album-favorite-badge ${
                          image.isFavorite ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          imageToggleFavorite(image, fetchAlbumImages);
                        }}>
                        <Heart
                          size={20}
                          fill={image.isFavorite ? "white" : "none"}
                          color={image.isFavorite ? "white" : "#64748b"}
                        />
                      </div>
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
                      onClick={() => toggleImageSelection(image.imageId)}
                      className={`list-item ${
                        selectedImages.includes(image.imageId) ? "selected" : ""
                      }`}>
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.name || "Album image"}
                        onClick={() => setImagePreview(image)}
                      />
                      <div className="list-item-content">
                        <h4 className="list-item-title">
                          {image.name || "Untitled"}
                        </h4>
                        <p className="list-item-meta">
                          {image.tags?.length
                            ? image.tags.join(", ")
                            : "No tags"}{" "}
                          • {image.formattedSize || "Unknown size"}
                        </p>
                      </div>
                      <div>
                        <h4 className="list-item-title">{image.person}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="empty-album text-center mt-3">
                <div className="empty-album-content">
                  <Grid size={48} color="#cbd5e1" />
                  <h3>No photos yet</h3>
                  <p>This album is empty. Add some photos to get started.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbumDetails;
