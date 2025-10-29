import { useEffect } from "react";
import { Image, Filter, Grid3x3, Plus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./photo.css";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import AddNewImage from "./AddNewPhoto";

const Photos = () => {
  const { loading, images, fetchImages, newImage, setNewImage } = useImageContext();

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      {loading && <Loading />}
      {newImage && <AddNewImage />}
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
                <button className="view-toggle-btn">
                  <Filter size={18} />
                  Filter
                </button>
                <button className="view-toggle-btn active">
                  <Grid3x3 size={18} />
                  Grid
                </button>
                <button className="view-toggle-btn active" onClick={() => setNewImage(true)}>
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
                  >
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.name || 'Photo'}
                      className="photo-img"
                    />
                    <div className="photo-overlay">
                      <h4 className="photo-title">{image.name || 'Untitled'}</h4>
                      <p className="photo-tags">
                        {image.tags?.length
                          ? image.tags.join(", ")
                          : "No tags added"}
                      </p>
                      <span className="photo-size">{image.formattedSize || 'Unknown'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="no-photos">
                  <Image size={64} color="#cbd5e1" strokeWidth={1.5} />
                  <div>
                    <h3 style={{ 
                      margin: '0 0 8px', 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#334155' 
                    }}>
                      No photos yet
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '15px', 
                      color: '#64748b' 
                    }}>
                      Upload your first photo to get started
                    </p>
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