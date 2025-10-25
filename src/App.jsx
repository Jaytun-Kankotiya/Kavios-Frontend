import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import GoogleCallback from "./pages/GoogleCallback";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Photos from "./Feature Pages/Photos";
import AlbumDetails from "./Feature Pages/AlbumDetails";
import Favorite from "./Feature Pages/Favorites";
import RecentlyAdded from "./Feature Pages/RecentlyAdded";
import Trash from "./Feature Pages/Trash";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
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
          <Route path="/albums" element={<AlbumDetails />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/recently_added" element={<RecentlyAdded />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
