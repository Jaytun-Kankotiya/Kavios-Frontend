import Sidebar from "./Sidebar/Sidebar";
import './Sidebar/Sidebar.css'

const Favorite = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <h1>Favorites</h1>
        <p>Welcome to your photo library.</p>
      </div>
    </div>
  );
};

export default Favorite;
