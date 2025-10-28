import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import './Sidebar/Sidebar.css'

const AlbumDetails = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <h1>Albums</h1>
        <p>Welcome to your photo library.</p>
      </div>
    </div>
  );
};

export default AlbumDetails;
