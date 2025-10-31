import Navbar from "../components/Navbar";
import { Plus, Image, Heart, Trash2 } from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";
import "./photos/photo.css";
import Loading from "../components/Loading";
import AddNewImage from "./photos/AddNewPhoto";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ImagePreview from "./photos/PhotoPreview";

const Favorite = () => {
  const {
    backendUrl,
    setImagePreview,
    imageToggleFavorite,
    imageDeleteHandler,
  } = useImageContext();

  const [newImage, setNewImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteImages, setFavoriteImages] = useState([]);

  const fetchFavoriteImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/images/favorites/all`, {
        withCredentials: true,
      });

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
  }, []);

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchFavoriteImages();
  };

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage onClose={handleImageAdded} />}
      <ImagePreview />

      {/* Favorite Images */}
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Favorite Photos</h1>
                <p>{favoriteImages?.length || 0} photos you love</p>
              </div>

              <div className="photos-header-actions">
                <button
                  className="view-toggle-btn"
                  onClick={() => setNewImage(true)}>
                  <Plus size={18} />
                  Add an Image
                </button>
              </div>
            </div>
          </div>

          <div className="photos-main">
            {favoriteImages && favoriteImages.length > 0 ? (
              <div className="photo-grid">
                {favoriteImages.map((image) => (
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
                        imageDeleteHandler(image.imageId);
                        fetchFavoriteImages();
                      }}>
                      <Trash2 size={20} />
                    </div>
                    <div className="photo-overlay">
                      <h4 className="photo-title">{image.name || "Untitled"}</h4>
                      <p className="photo-tags">
                        {image.tags?.length ? image.tags.join(", ") : "No tags added"}
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
                    <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600", color: "#334155" }}>
                      No favorites yet
                    </h3>
                    <p style={{ margin: 0, fontSize: "15px", color: "#64748b" }}>
                      Mark some photos as favorites to see them here
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Favorite Albums */}

    </>
  );
};

export default Favorite;
