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
    search,
    setSearch,
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
    setSearch("");
  }, []);

  const handleImageAdded = async () => {
    setNewImage(false);
    await fetchRecentImages();
  };

  const handleAlbumAdded = async () => {
    setNewAlbum(false);
    await fetchRecentAlbums();
  };

  const searchValue = search?.trim().toLowerCase() || "";
  const filteredFavorites = !searchValue
    ? { images: recentImages, albums: recentAlbums }
    : {
        images: (recentImages || []).filter((img) =>
          img.name?.toLowerCase().includes(searchValue)
        ),
        albums: (recentAlbums || []).filter((album) =>
          album.name?.toLowerCase().includes(searchValue)
        ),
      };

      console.log(filteredFavorites.albums)

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage onClose={handleImageAdded} />}
      {newAlbum && <AddNewAlbum onClose={handleAlbumAdded} />}
      <ImagePreview images={recentImages} />

      <div className="favorite-main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Recently Added Images</h1>
                <p>
                  {filteredFavorites.images.length} new memories captured this week
                </p>
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
            {filteredFavorites.images.length > 0 ? (
              <div className="photo-grid">
                {filteredFavorites.images.map((image) => (
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
                <div className="empty-albums">
                  <Image size={64} color="#cbd5e1" />
                  <h3>No images found</h3>
                  <p>
                    {search
                      ? "No images match with your search"
                      : "Add some photos to see them here"}
                  </p>
                </div>
              )
            )}
          </div>

          <div className="albums-header">
            <div className="albums-header-content">
              <div className="photos-title-section">
                <h1>Recently Added Albums</h1>
                <p>{filteredFavorites.albums.length} new albums created this week</p>
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
            {filteredFavorites.albums.length > 0 ? (
              <div className="albums-grid">
                {filteredFavorites.albums.map((album) => (
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
              <div className="empty-albums">
                <FolderOpen size={40} color="#3b82f6" />
                <h3>No albums found</h3>
                <p>
                  {search
                    ? "No albums match with your search"
                    : "Add some albums to see them here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentlyAdded;
