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
  const [imagePreview, setImagePreview] = useState(null);

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
      setFavoriteAlbums(favoriteAlbums);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // const imageToggleFavorite = async (image, onSuccessFetch) => {
  //   setLoading(true);
  //   console.log(image.imageId);
  //   try {
  //     const { data } = await axios.patch(
  //       `${backendUrl}/api/images/${image.imageId}`,
  //       { isFavorite: !image.isFavorite },
  //       { withCredentials: true }
  //     );
  //     if (!data.success) {
  //       toast.error(data.message);
  //     }
  //     fetchImages();
  //     toast.success(
  //       !image.isFavorite
  //         ? `Added "${image.name}" to favorites ❤️`
  //         : `Removed "${image.name}" from favorites 💔`
  //     );
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
            ? `Added "${image.name}" to favorites ❤️`
            : `Removed "${image.name}" from favorites 💔`
        );
        if (onSuccessFetch) onSuccessFetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageDeleteHandler = async (imageId) => {
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

  const value = {
    backendUrl,

    images,
    setImages,
    fetchImages,
    imageToggleFavorite,

    albums,
    setAlbums,
    fetchAlbums,

    favoriteImages,
    setFavoriteImages,
    fetchFavoriteAlbums,

    favoriteAlbums,
    setFavoriteAlbums,

    recentlyAdded,
    setRecentlyAdded,
    imageTrash,
    setImageTrash,
    albumTrash,
    setAlbumTrash,
    sharedWithMe,
    setSharedWithMe,
    loading,
    setLoading,
    newAlbum,
    setNewAlbum,
    newImage,
    setNewImage,
    imagePreview,
    setImagePreview,
    imageDeleteHandler
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageProvider;
