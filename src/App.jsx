import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import GoogleCallback from "./pages/GoogleCallback";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Photos from "./Feature Pages/photos/Photos";
import AlbumDetails from "./Feature Pages/albums/AlbumDetails";
import Favorite from "./Feature Pages/Favorites";
import RecentlyAdded from "./Feature Pages/RecentlyAdded";
import Trash from "./Feature Pages/Trash";
import SharedAlbums from "./Feature Pages/SharedAlbums";
import Albums from "./Feature Pages/albums/Albums";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        top="2.5rem"
        autoClose={3000}
        pauseOnHover
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
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
