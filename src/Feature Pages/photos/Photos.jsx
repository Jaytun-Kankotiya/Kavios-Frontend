import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./photo.css";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import { useEffect } from "react";

const Photos = () => {
  const { loading, images, fetchImages } = useImageContext();

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <div className="photos-main">
            {images && images.length > 0 ? (
              <div className="photo-grid">
                {images.map((image) => (
                  <div className="photo-card" key={image._id}>
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.name}
                      className="photo-img"
                    />
                    <div className="photo-overlay">
                      <h4 className="photo-title">{image.name}</h4>
                      <p className="photo-tags">
                        {image.tags?.length
                          ? image.tags.join(", ")
                          : "No tags added"}
                      </p>
                      <span className="photo-size">{image.formattedSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-photos">No images found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Photos;
