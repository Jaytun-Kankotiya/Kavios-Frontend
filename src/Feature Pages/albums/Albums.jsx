import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Heart, Image, Calendar } from "lucide-react";
import Navbar from "../../components/Navbar";
import "./Album.css";
import { useImageContext } from "../../context/ImageContext";
import Loading from "../../components/Loading";
import Sidebar from "../Sidebar/Sidebar";

const Albums = () => {
  const navigate = useNavigate();
  const {
    loading,
    fetchAlbums,
    albums,
    favoriteImages,
    setFavoriteImages,
    fetchFavoriteAlbums,
  } = useImageContext();
  const [filter, setFilter] = useState("all");
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    fetchAlbums();
    fetchFavoriteAlbums();
  }, []);

  useEffect(() => {
    if (albums) {
      if (filter === "favorite") {
        setFilteredAlbums(albums.filter((album) => album.isFavorite));
      } else {
        setFilteredAlbums(albums);
      }
    }
  }, [albums, filter]);

  const handleAlbumClick = (album) => {
    navigate(`/album-details/${album.albumId}`);
  };

  const toggleFavorite = (e, albumId) => {
    e.stopPropagation();
    // Add your favorite toggle logic here
    console.log("Toggle favorite for album:", albumId);
  };

  const getFavoriteCount = () => {
    return albums?.filter((album) => album.isFavorite).length || 0;
  };

  return (
    <>
      {loading && <Loading />}
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />

          <div className="albums-container">
            <div className="albums-header">
              <div className="albums-header-content">
                <div className="albums-title-section">
                  <h1>Albums</h1>
                  <p>Organize your photos into beautiful collections</p>
                </div>

                <button className="primary-button">
                  <Plus size={18} />
                  Create Album
                </button>
              </div>
            </div>

            <div className="albums-main-content">
              <div className="albums-filter">
                <button
                  className={`filter-button ${
                    filter === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilter("all")}>
                  All Albums ({albums?.length || 0})
                </button>
                <button
                  className={`filter-button ${
                    filter === "favorite" ? "active" : ""
                  }`}
                  onClick={() => setFilter("favorite")}>
                  Favorites ({getFavoriteCount()})
                </button>
              </div>

              {filteredAlbums && filteredAlbums.length > 0 ? (
                <div className="albums-grid">
                  {filteredAlbums.map((album) => (
                    <div
                      key={album._id}
                      className="album-card"
                      onClick={() => handleAlbumClick(album)}>
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
                          onClick={(e) => toggleFavorite(e, album._id)}>
                          <Heart
                            size={20}
                            fill={album.isFavorite ? "white" : "none"}
                            color={album.isFavorite ? "white" : "#64748b"}
                          />
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
                  <div className="empty-albums-icon">
                    <FolderOpen size={40} color="#3b82f6" />
                  </div>
                  <h3>No albums found</h3>
                  <p>
                    {filter === "favorite"
                      ? "You haven't marked any albums as favorite yet"
                      : "Create your first album to organize your photos"}
                  </p>
                  <button className="primary-button">
                    <Plus size={18} />
                    Create Album
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Albums;
