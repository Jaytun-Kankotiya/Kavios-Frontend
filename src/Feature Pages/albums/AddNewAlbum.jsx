import { X } from "lucide-react";
import "./AddNewAlbum.css";
import { useState } from "react";
import { useImageContext } from "../../context/ImageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axios";

const AddNewAlbum = () => {
  const { backendUrl, loading, setLoading, fetchAlbums, setNewAlbum } = useImageContext();
  const [albumData, setAlbumData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setAlbumData((prev) => ({ ...prev, [name]: value }));
  };

  const addAlbumSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(
        `${backendUrl}/api/albums`,
        albumData,
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      fetchAlbums();
      setNewAlbum(false);
      navigate("/albums");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addalbum-outer">
      <div className="addAlbum-main">
        <div className="addAlbum-header">
          <p>Create an Album</p>
          <X
            size={22}
            className="close-icon"
            onClick={() => setNewAlbum(false)}
          />
        </div>

        <form onSubmit={addAlbumSubmitHandler}>
          <div className="addalbum-inputs">
            <input
              type="text"
              placeholder="Album Name"
              name="name"
              value={albumData.name}
              onChange={changeHandler}
              required
            />
            <input
              type="text"
              placeholder="Description"
              name="description"
              value={albumData.description}
              onChange={changeHandler}
              required
            />
          </div>

          <button className="addAlbum-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Album"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAlbum;
