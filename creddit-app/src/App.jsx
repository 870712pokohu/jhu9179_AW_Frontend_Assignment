/*
 * File:        App.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Root component with routing and user name display.
 */

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ForumPage from "./pages/ForumPage";
import FavouritesPage from "./pages/FavouritesPage";
import { useFavourites } from "./hooks/useFavourites";
import { getCurrentUser } from "./api/creddit";
import "./App.css";

/*
 * Function:    App
 * Description: Renders the router, navbar, and page routes.
 * Parameters:  None.
 * Return:      {JSX.Element} The rendered application.
 */
export default function App() {
  const [userName, setUserName] = useState("");
  const favouritesState = useFavourites();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        const displayName =
          `${user.firstName} ${user.lastName}`.trim() || user.username;
        setUserName(displayName);
      })
      .catch((error) => {
        console.error("Couldn't load user info:", error);
        setUserName("—");
      });
  }, []);

  return (
    <BrowserRouter basename="/creddit-app">
      <Navbar userName={userName} />
      <Routes>
        <Route path="/" element={<ForumPage {...favouritesState} />} />
        <Route
          path="/favourites"
          element={<FavouritesPage {...favouritesState} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
