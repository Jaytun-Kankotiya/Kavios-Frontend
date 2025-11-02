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
    imageToggleFavorite,
    imageDeleteHandler,
    search,
    setSearch,
  } = useImageContext();

  useEffect(() => {
    fetchImages();
    setSearch("");
  }, []);

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchImages();
  };

  const searchValue = search?.trim().toLowerCase() || "";
  const filteredPhotos = !searchValue
    ? images
    : images.filter((img) => img.name?.toLowerCase().includes(searchValue));

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage onClose={handleImageAdded} />}
      {<ImagePreview images={images} />}
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>All Photos</h1>
                <p>{filteredPhotos?.length || 0} photos in your library</p>
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
            {filteredPhotos && filteredPhotos.length > 0 ? (
              <div className="photo-grid">
                {filteredPhotos.map((image, index) => (
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
                      data-tooltip="Favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        imageToggleFavorite(image, fetchImages);
                      }}>
                      <Heart
                        size={20}
                        fill={image.isFavorite ? "white" : "none"}
                        color={image.isFavorite ? "white" : "#64748b"}
                      />
                    </div>
                    <div
                      className="image-trash-badge"
                      data-tooltip="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        imageDeleteHandler(image.imageId, fetchImages);
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
