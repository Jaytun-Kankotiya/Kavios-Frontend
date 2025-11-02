import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const ImageContext = createContext();

export const useImageContext = () => useContext(ImageContext);

const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [imageTrash, setImageTrash] = useState([]);
  const [albumTrash, setAlbumTrash] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAlbum, setNewAlbum] = useState(false);
  const [newImage, setNewImage] = useState(false);
  const [addNewSharing, setAddNewSharing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/images`, {
        withCredentials: true,
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch images");
        return;
      }

      setImages(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/albums`, {
        withCredentials: true,
      });
      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch albums");
      }
      setAlbums(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteAlbums = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/albums/favorites/all`,
        { withCredentials: true }
      );

      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch favorite albums");
      }
      setFavoriteAlbums(data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageToggleFavorite = async (image, onSuccessFetch) => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/images/${image.imageId}`,
        { isFavorite: !image.isFavorite },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(
          !image.isFavorite
            ? `Added "${image.name}" to favorites`
            : `Removed "${image.name}" from favorites`
        );
        if (onSuccessFetch) onSuccessFetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageDeleteHandler = async (imageId, onSuccessFetch) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/images/${imageId}`,
        { withCredentials: true }
      );
      if (!data.success) {
        toast.error(data.message);
      }
      if(onSuccessFetch) onSuccessFetch()
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const albumToggleFavorite = async (album, onSuccessFetch) => {
    try {
      const updatedFavorite = !album.isFavorite;
      const { data } = await axios.patch(
        `${backendUrl}/api/albums/${album.albumId}`,
        { isFavorite: updatedFavorite },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(
        updatedFavorite
          ? `Added "${album.name}" to favorites`
          : `Removed "${album.name}" from favorites`
      );
      if (onSuccessFetch) onSuccessFetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const albumDeleteHandler = async (
    albumId,
    albumName,
    imageCount,
    onSuccessFetch
  ) => {
    const confirmDelete = window.confirm(
      imageCount > 0
        ? `Are you sure you want to delete "${albumName}"?\n\nThis album contains ${imageCount} image${imageCount > 1 ? 's' : ''}. Please delete all images first.`
        : `Are you sure you want to delete "${albumName}"?`
    );
    if (!confirmDelete) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/albums/${albumId}`,
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (onSuccessFetch) onSuccessFetch();
      toast.success(data.message);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const value = {
    backendUrl,

    images,
    setImages,
    fetchImages,
    imageToggleFavorite,
    imageDeleteHandler,
    favoriteImages,
    setFavoriteImages,
    imageTrash,
    setImageTrash,
    newImage,
    setNewImage,
    imagePreview,
    setImagePreview,
    toggleImageSelection,

    albums,
    setAlbums,
    fetchAlbums,
    favoriteAlbums,
    newAlbum,
    setNewAlbum,
    albumTrash,
    setAlbumTrash,
    setFavoriteAlbums,
    fetchFavoriteAlbums,
    albumToggleFavorite,
    albumDeleteHandler,

    addNewSharing, setAddNewSharing,
    recentlyAdded,
    setRecentlyAdded,

    sharedWithMe,
    setSharedWithMe,

    loading,
    setLoading,
    search, setSearch
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageProvider;
