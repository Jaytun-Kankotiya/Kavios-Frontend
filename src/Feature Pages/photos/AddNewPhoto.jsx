import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useImageContext } from "../../context/ImageContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/axios";

const AddNewImage = ({onClose, defaultAlbumId  }) => {
  const {
    backendUrl,
    loading,
    setLoading,
    albums,
    fetchAlbums,
    fetchImages,
  } = useImageContext();

  const [imageData, setImageData] = useState({
    name: "",
    albumId: defaultAlbumId || "",
    tags: "",
    person: "",
    comments: "",
    image: null,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setImageData((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    setImageData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const addImageSubmitHandler = async (e) => {
  e.preventDefault();

  if (!imageData.image) {
    toast.error("Please select an image file to upload");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("image", imageData.image);
    formData.append("name", imageData.name);
    formData.append("albumId", imageData.albumId);
    formData.append("comments", imageData.comments || "");
    formData.append("tags", imageData.tags || "");
    formData.append("person", imageData.person || "");

    const { data } = await api.post(`${backendUrl}/api/images/upload`, formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    fetchImages();
    toast.success(data.message);
    onClose()
    setImageData({
      name: "",
      albumId: "",
      tags: "",
      person: "",
      comments: "",
      image: null,
    });
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="addalbum-outer">
        <div className="addAlbum-main">
          <div className="addAlbum-header">
            <p>Upload an Image</p>
            <X
              size={22}
              className="close-icon"
              onClick={onClose}
            />
          </div>

          <form onSubmit={addImageSubmitHandler}>
            <div className="addalbum-inputs">
              <input
                type="text"
                placeholder="Image Name"
                name="name"
                value={imageData.name}
                onChange={changeHandler}
                required
              />

              <select
                name="albumId"
                value={imageData.albumId}
                onChange={changeHandler}
                disabled={defaultAlbumId}
                required>
                <option value="">Select Album</option>
                {albums.map((album) => (
                  <option key={album._id} value={album.albumId}>
                    {album.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Tags (comma separated) (Optional)"
                name="tags"
                value={imageData.tags}
                onChange={changeHandler}
              />

              <input
                type="text"
                placeholder="Person (Optional)"
                name="person"
                value={imageData.person}
                onChange={changeHandler}
              />

              <input
                type="text"
                placeholder="Comments (Optional)"
                name="comments"
                value={imageData.comments}
                onChange={changeHandler}
              />

              <input
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
                required
              />
            </div>

            <button
              className="addAlbum-button"
              type="submit"
              disabled={loading}>
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewImage;
