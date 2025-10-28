import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import './Sidebar/Sidebar.css'

const RecentlyAdded = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div>
        <h1>Recently Added</h1>
        <p>Welcome to your photo library.</p>
        </div>
      </div>
    </div>
  );
};

export default RecentlyAdded;
