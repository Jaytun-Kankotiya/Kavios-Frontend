
import { Link, useLocation } from "react-router-dom";
import { Images, Album, Star, Clock4, Trash2, Camera, Users } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/photos", label: "Photos", icon: <Images size={20} /> },
    { path: "/albums", label: "Albums", icon: <Album size={20} /> },
    { path: "/favorites", label: "Favorites", icon: <Star size={20} /> },
    { path: "/shared-with-me", label: "Shared with me", icon: <Users size={20} /> },
    {
      path: "/recently_added",
      label: "Recently Added",
      icon: <Clock4 size={20} />,
    },
    { path: "/trash", label: "Trash", icon: <Trash2 size={20} /> },
  ];

  return (
    <div>
      <nav className="sidebar" aria-label="Main navigation">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <Link className="navbrand-link" to="/photos">
              <span className="brand-icon">
                <Camera size={20} />
              </span>
              <span className="brand-text">Kavios Photos</span>
            </Link>
          </div>

          <ul className="sidebar-list">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.path}
                  className={`sidebar-item ${isActive ? "active" : ""}`}>
                  <Link to={item.path} className="sidebar-link">
                    <span className="icon-wrapper">{item.icon}</span>
                    <span className="label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
