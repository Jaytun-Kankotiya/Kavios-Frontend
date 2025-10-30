import { useEffect, useState } from "react";
import { Image, Heart, Plus, Trash2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./photo.css";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import AddNewImage from "./AddNewPhoto";
import ImagePreview from "./PhotoPreview";
import axios from "axios";
import { toast } from "react-toastify";

const Photos = () => {
  const {
    loading,
    setLoading,
    backendUrl,
    images,
    fetchImages,
    newImage,
    setNewImage,
    imagePreview,
    setImagePreview,
  } = useImageContext();

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteHandler = async (imageId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/${imageId}`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      }
      fetchImages();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (image) => {
    setLoading(true);
    console.log(image.imageId);
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/images/${image.imageId}`,
        { isFavorite: !image.isFavorite },
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      }
      fetchImages();
      toast.success(
        !image.isFavorite
          ? `Added "${image.name}" to favorites ❤️`
          : `Removed "${image.name}" from favorites 💔`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(images)

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage />}
      {<ImagePreview />}
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>All Photos</h1>
                <p>{images?.length || 0} photos in your library</p>
              </div>

              <div className="photos-header-actions">
                <button
                  className="view-toggle-btn active"
                  onClick={() => setNewImage(true)}>
                  <Plus size={18} />
                  Add an Image
                </button>
              </div>
            </div>
          </div>

          <div className="photos-main">
            {images && images.length > 0 ? (
              <div className="photo-grid">
                {images.map((image, index) => (
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
                        toggleFavorite(image);
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
                        deleteHandler(image.imageId);
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
                      No photos yet
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "#64748b",
                      }}>
                      Upload your first photo to get started
                    </p>
                    <button
                      className="view-toggle-btn active mt-3"
                      onClick={() => setNewImage(true)}>
                      <Plus size={18} />
                      Add an Image
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Photos;
