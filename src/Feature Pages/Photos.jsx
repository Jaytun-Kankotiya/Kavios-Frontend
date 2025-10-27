import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import "./Sidebar/Sidebar.css";

const Photos = () => {

    const [images, setImages] = useState([])
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div></div>
      </div>
    </div>
  );
};

export default Photos;
