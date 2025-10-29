import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import GoogleCallback from "./pages/GoogleCallback";
import { Bounce, Flip, ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Photos from "./Feature Pages/photos/Photos";
import Favorite from "./Feature Pages/Favorites";
import RecentlyAdded from "./Feature Pages/RecentlyAdded";
import Trash from "./Feature Pages/Trash";
import SharedAlbums from "./Feature Pages/SharedAlbums";
import Albums from "./Feature Pages/albums/Albums";
import AlbumDetails from "./Feature Pages/albumDetails/AlbumDetails";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        pauseOnFocusLoss={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        transition={Bounce}
        style={{ top: "4rem", right: "1rem", position: "fixed" }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/album-details/:albumId" element={<AlbumDetails />} />
          <Route path="/shared-with-me" element={<SharedAlbums />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/recently_added" element={<RecentlyAdded />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
