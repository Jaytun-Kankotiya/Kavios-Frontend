import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import "./albumDetails/AlbumDetails.css";
import {
  Plus,
  Image,
  Heart,
  Trash2,
  FolderOpen,
  Calendar,
  History,
  Hourglass,
} from "lucide-react";
import { useImageContext } from "../context/ImageContext";
import ImagePreview from "./photos/PhotoPreview";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Trash = () => {
  const {
    loading,
    setLoading,
    backendUrl,
    setImagePreview,
    search,
    setSearch,
  } = useImageContext();

  const navigate = useNavigate();
  const [trashImages, setTrashImages] = useState([]);
  const [trashAlbums, setTrashAlbums] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedAlbums, setSelectedAlbums] = useState([]);

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
        toast.error(data.message || "Failed to fetch trashed albums");
        return;
      }

      setTrashAlbums(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const toggleAlbumSelection = (albumId) => {
    setSelectedAlbums((prev) => {
      if (prev.includes(albumId)) {
        return prev.filter((id) => id !== albumId);
      } else {
        return [...prev, albumId];
      }
    });
  };

  const restoreImage = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/images/trash/${id}/restore`,
        {},
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      return false;
    }
  };

  const restoreAlbum = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/albums/trash/${id}/restore`,
        {},
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
        return false;
      }
      toast.success(data.message);
      fetchAlbumTrash();
      fetchImageTrash();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      return false;
    }
  };

  const restoreSelectedImages = async () => {
    if (selectedImages.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        selectedImages.map((imageId) => restoreImage(imageId))
      );

      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(
          `Successfully restored ${successCount} image${
            successCount > 1 ? "s" : ""
          }`
        );
      }

      setSelectedImages([]);
      await fetchImageTrash();
    } catch (error) {
      toast.error("Failed to restore images");
    } finally {
      setLoading(false);
    }
  };

  const restoreSelectedAlbums = async () => {
    if (selectedAlbums.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        selectedAlbums.map((albumId) => restoreAlbum(albumId))
      );

      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(
          `Successfully restored ${successCount} album${
            successCount > 1 ? "s" : ""
          }`
        );
      }

      setSelectedAlbums([]);
      await fetchAlbumTrash();
      await fetchImageTrash();
    } catch (error) {
      toast.error("Failed to restore albums");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${
        selectedImages.length
      } image${
        selectedImages.length > 1 ? "s" : ""
      }? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        selectedImages.map(async (imageId) => {
          try {
            const { data } = await axios.delete(
              `${backendUrl}/api/images/trash/${imageId}/permanent`,
              { withCredentials: true }
            );
            return data.success;
          } catch (error) {
            return false;
          }
        })
      );

      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(
          `Successfully deleted ${successCount} image${
            successCount > 1 ? "s" : ""
          }`
        );
      }

      setSelectedImages([]);
      await fetchImageTrash();
    } catch (error) {
      toast.error("Failed to delete images");
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedAlbums = async () => {
    if (selectedAlbums.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${
        selectedAlbums.length
      } album${
        selectedAlbums.length > 1 ? "s" : ""
      }? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        selectedAlbums.map(async (albumId) => {
          try {
            const { data } = await axios.delete(
              `${backendUrl}/api/albums/trash/${albumId}/permanent`,
              { withCredentials: true }
            );
            return data.success;
          } catch (error) {
            return false;
          }
        })
      );

      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(
          `Successfully deleted ${successCount} album${
            successCount > 1 ? "s" : ""
          }`
        );
      }

      setSelectedAlbums([]);
      await fetchAlbumTrash();
      await fetchImageTrash();
    } catch (error) {
      toast.error("Failed to delete albums");
    } finally {
      setLoading(false);
    }
  };

  const emptyAlbumTrash = async () => {
    const confirmDelete = window.confirm(
      trashAlbums.length > 1
        ? `Are you sure you want to empty your album trash?\n\nIt contains ${trashAlbums.length} albums`
        : `Are you sure you want to empty your album trash?`
    );

    if (!confirmDelete) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/albums/trash/empty`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      fetchAlbumTrash();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const emptyImageTrash = async () => {
    const confirmDelete = window.confirm(
      trashImages.length > 1
        ? `Are you sure you want to empty your trash?\n\nIt contains ${trashImages.length} images`
        : `Are you sure you want to empty your image trash?`
    );
    if (!confirmDelete) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/trash/empty`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      fetchImageTrash();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImagePermanently = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this image? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/trash/${id}/permanent`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      fetchImageTrash();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbumPermanently = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this album? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/albums/trash/${id}/permanent`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
      fetchAlbumTrash();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageCleanup = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/trash/cleanup`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Image cleanup error:", error);
    }
  };

  const albumCleanup = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/albums/trash/cleanup`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Album cleanup error:", error);
    }
  };

  useEffect(() => {
    const initializeTrash = async () => {
      await Promise.all([imageCleanup(), albumCleanup()]);
      await Promise.all([fetchImageTrash(), fetchAlbumTrash()]);
    };

    initializeTrash();
    setSearch("");
  }, []);

  const searchValue = search?.trim().toLowerCase() || "";
  const filteredTrash = !searchValue
    ? { images: trashImages, albums: trashAlbums }
    : {
        images: (trashImages || []).filter((img) =>
          img.name?.toLowerCase().includes(searchValue)
        ),
        albums: (trashAlbums || []).filter((album) =>
          album.name?.toLowerCase().includes(searchValue)
        ),
      };

      console.log(filteredTrash.images)

  return (
    <>
      {loading && <Loading />}
      <ImagePreview />

      {/* Trashed Images */}
      <div className="favorite-main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="photos-header">
            <div className="photos-header-content">
              <div className="photos-title-section">
                <h1>Trashed Images</h1>
                <p>{filteredTrash?.images.length || 0} images in trash</p>
              </div>

              {selectedImages.length === 0 ? (
                <div className="photos-header-actions">
                  {filteredTrash?.images.length > 0 && (
                    <button
                      className="view-toggle-btn trash"
                      onClick={emptyImageTrash}>
                      <Trash2 size={18} />
                      Empty Image Trash
                    </button>
                  )}
                </div>
              ) : (
                <div className="photos-header-actions">
                  <button
                    className="action-button download"
                    onClick={restoreSelectedImages}>
                    <History size={16} /> Restore ({selectedImages.length})
                  </button>
                  <button
                    className="action-button trash"
                    onClick={deleteSelectedImages}>
                    <Trash2 size={16} /> Delete Permanently (
                    {selectedImages.length})
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={() => setSelectedImages([])}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="photos-main">
            {filteredTrash?.images.length > 0 ? (
              <div className="photo-grid">
                {filteredTrash.images.map((image) => (
                  <div
                    className={`photo-card ${
                      selectedImages.includes(image.imageId) ? "selected" : ""
                    }`}
                    key={image._id}
                    onClick={() => toggleImageSelection(image.imageId)}>
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.name || "Photo"}
                      className="photo-img"
                    />
                    {selectedImages.includes(image.imageId) && (
                      <div className="selection-checkmark">✓</div>
                    )}

                    {selectedImages.length === 0 && (
                      <>
                        <div
                          className={`album-favorite-badge`}
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreImage(image.imageId).then((success) => {
                              if (success) {
                                toast.success("Image restored successfully");
                                fetchImageTrash();
                              }
                            });
                          }}>
                          <History size={20} />
                        </div>

                        <div
                          className="image-trash-badge"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImagePermanently(image.imageId);
                          }}>
                          <Trash2 size={20} />
                        </div>
                      </>
                    )}

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
                      No trashed images
                    </h3>
                    <p
                      style={{ margin: 0, fontSize: "15px", color: "#64748b" }}>
                      Deleted images will appear here
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Trashed Albums */}
      <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "0" }} />

      <div className="favorite-main-layout">
        <div className="content-area">
          <div className="albums-header">
            <div className="albums-header-content">
              <div className="photos-title-section">
                <h1>Trashed Albums</h1>
                <p>{trashAlbums?.length || 0} albums in trash</p>
              </div>

              {selectedAlbums.length === 0 ? (
                <div className="photos-header-actions">
                  {trashAlbums?.length > 0 && (
                    <button
                      className="view-toggle-btn trash"
                      onClick={emptyAlbumTrash}>
                      <Trash2 size={18} />
                      Empty Album Trash
                    </button>
                  )}
                </div>
              ) : (
                <div className="photos-header-actions">
                  <button
                    className="action-button download"
                    onClick={restoreSelectedAlbums}>
                    <History size={16} /> Restore ({selectedAlbums.length})
                  </button>
                  <button
                    className="action-button trash"
                    onClick={deleteSelectedAlbums}>
                    <Trash2 size={16} /> Delete Permanently (
                    {selectedAlbums.length})
                  </button>
                  <button
                    className="action-button"
                    onClick={() => setSelectedAlbums([])}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="albums-main-content">
            {filteredTrash?.albums.length > 0 ? (
              <div className="albums-grid">
                {filteredTrash?.albums.map((album) => (
                  <div
                    key={album._id}
                    className={`album-card ${
                      selectedAlbums.includes(album.albumId) ? "selected" : ""
                    }`}
                    onClick={() => toggleAlbumSelection(album.albumId)}>
                    <div className="album-cover">
                      <div className="album-cover-overlay d-flex justify-content-between">
                        <span className="album-image-count">
                          <Image size={16} />
                          {album.imageCount || 0} photos
                        </span>
                        <span className="album-image-count">
                          <Hourglass size={16} />
                          {album.daysUntilDeletion || 0} days
                        </span>
                      </div>

                      {selectedAlbums.includes(album.albumId) && (
                        <div className="selection-checkmark">✓</div>
                      )}

                      {selectedAlbums.length === 0 && (
                        <>
                          <div
                            className={`album-favorite-badge`}
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreAlbum(album.albumId).then((success) => {
                                if (success) {
                                  toast.success("Album restored successfully");
                                  fetchAlbumTrash();
                                }
                              });
                            }}>
                            <History size={20} />
                          </div>

                          <div
                            className="album-trash-badge"
                            title="Delete Permanently"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAlbumPermanently(album.albumId);
                            }}>
                            <Trash2 size={20} />
                          </div>
                        </>
                      )}
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
                          {new Date(album.deletedAt).toLocaleDateString(
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
              !loading && (
                <div className="empty-albums">
                  <div className="empty-albums-icon">
                    <FolderOpen size={40} color="#3b82f6" />
                  </div>
                  <h3>No trashed albums</h3>
                  <p>Deleted albums will appear here</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trash;
