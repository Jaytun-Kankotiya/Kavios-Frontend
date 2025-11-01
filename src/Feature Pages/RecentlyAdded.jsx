import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import AddNewAlbum from "./albums/AddNewAlbum";
import AddNewImage from "./photos/AddNewPhoto";
import ImagePreview from "./photos/PhotoPreview";

import { Plus, FolderOpen, Image, Calendar, Heart, Trash2 } from "lucide-react";

import { useImageContext } from "../context/ImageContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RecentlyAdded = () => {
  const {
    loading,
    setLoading,
    backendUrl,
    newImage,
    setNewImage,
    newAlbum,
    setNewAlbum,
    imageToggleFavorite,
    albumToggleFavorite,
    imageDeleteHandler,
    albumDeleteHandler,
    setImagePreview,
  } = useImageContext();

  const [recentImages, setRecentImages] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  // const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const fetchRecentImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/images/recent`, {
        withCredentials: true,
      });
      if (!data.success) toast.error(data.message);
      else setRecentImages(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAlbums = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/albums/recent`, {
        withCredentials: true,
      });
      if (!data.success) toast.error(data.message);
      else setRecentAlbums(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentImages();
    fetchRecentAlbums();
  }, []);

  console.log(recentAlbums);

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchRecentImages();
  };

  const handleAlbumAdded = async () => {
    setNewAlbum(false);
    await fetchRecentAlbums();
  };

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage onClose={handleImageAdded} />}
      {newAlbum && <AddNewAlbum onClose={handleAlbumAdded} />}
      <ImagePreview images={recentImages}/>

      <div className="favorite-main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Recently Added Images</h1>
                <p>{recentImages.length} new memories captured this week</p>
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
            {recentImages.length > 0 ? (
              <div className="photo-grid">
                {recentImages.map((image) => (
                  <div key={image._id} className="photo-card">
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.name || "Photo"}
                      className="photo-img"
                      onClick={() => setImagePreview(image)}
                    />
                    <div
                      className={`album-favorite-badge ${
                        image.isFavorite ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        imageToggleFavorite(image, fetchRecentImages);
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
                        imageDeleteHandler(image.imageId, fetchRecentImages);
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
                <div className="no-photos text-center">
                  <Image size={64} color="#cbd5e1" />
                  <h3>No images found</h3>
                  <p>Add some photos to see them here</p>
                </div>
              )
            )}
          </div>

          {/* Recently Added Albums */}
          <div className="albums-header">
            <div className="albums-header-content">
              <div className="photos-title-section">
                <h1>Recently Added Albums</h1>
                <p>{recentAlbums.length} new albums created this week</p>
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
            {recentAlbums.length > 0 ? (
              <div className="albums-grid">
                {recentAlbums.map((album) => (
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
                          albumToggleFavorite(album, fetchRecentAlbums);
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
                            fetchRecentAlbums
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
              <div className="empty-albums text-center">
                <FolderOpen size={40} color="#3b82f6" />
                <h3>No albums found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentlyAdded;
