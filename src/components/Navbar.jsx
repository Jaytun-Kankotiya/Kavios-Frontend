import { Plus, User, Home, Image } from "lucide-react";
import '../index.css'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light px-2">
      <div className="container-fluid">

        {/* Left: Search Bar */}
        <form className="d-flex me-auto" role="search" style={{ width: "450px" }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        {/* Right: Nav Items */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Home size={20} className="me-1" /> Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Image size={20} className="me-1" /> Gallery
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Plus size={20} className="me-1" /> Add
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <User size={20} className="me-1" /> My Profile
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
