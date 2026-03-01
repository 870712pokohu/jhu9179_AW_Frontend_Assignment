/*
 * File:        Navbar.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Top navigation bar with logo, page links, and user name.
 */

import { Link, useLocation } from "react-router-dom";

/*
 * Function:    Navbar
 * Description: Renders the navigation bar with links and user badge.
 * Parameters:  userName {string} - The display name of the logged-in user.
 * Return:      {JSX.Element} The navigation bar element.
 */
export default function Navbar({ userName }) {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          cr<span className="logo-accent">ed</span>dit
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          Browse
        </Link>
        <Link
          to="/favourites"
          className={`nav-link ${pathname === "/favourites" ? "active" : ""}`}
        >
          Favourites
        </Link>
      </div>

      <div className="navbar-right">
        {userName ? (
          <span className="username-badge">
            <span className="username-dot" />
            {userName}
          </span>
        ) : (
          <span className="username-badge loading">loading...</span>
        )}
      </div>
    </nav>
  );
}
