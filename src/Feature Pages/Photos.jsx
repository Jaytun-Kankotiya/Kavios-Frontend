import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";
import { useImageContext } from "../context/ImageContext";
import Loading from "../components/Loading";

const Photos = () => {
    const {loading} = useImageContext()

  return (
    <div className="main-layout">
        {loading && <Loading />}
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div>

        </div>
      </div>
    </div>
  );
};

export default Photos;
