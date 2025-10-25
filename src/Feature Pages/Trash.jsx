import Sidebar from "./Sidebar/Sidebar";
import './Sidebar/Sidebar.css'

const Trash = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <h1>Trash</h1>
        <p>Welcome to your photo library.</p>
      </div>
    </div>
  );
};

export default Trash;
