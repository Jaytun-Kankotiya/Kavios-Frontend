import { Plus, User, Home, Image } from "lucide-react";
import '../index.css'
import './Navbar.css'
import '../Feature Pages/Sidebar/Sidebar.css'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-2 py-2">
      <div className="container-fluid">
        <div className="search-box">
          <input
            className=" me-2 search-input"
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
          </div>

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
              <Link className="nav-link" to='/photos'>
                <Home size={20} className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/add'>
                <Plus size={20} className="me-1" /> Add
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/profile'>
                <User size={20} className="me-1" /> My Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
