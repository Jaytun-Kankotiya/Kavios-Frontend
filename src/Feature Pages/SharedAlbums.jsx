import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import './Sidebar/Sidebar.css'

const SharedAlbums = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <h1>Shared with me</h1>
        <p>Welcome to your photo library.</p>
      </div>
    </div>
  );
};

export default SharedAlbums;
