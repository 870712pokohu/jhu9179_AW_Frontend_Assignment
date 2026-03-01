/*
 * File:        useFavourites.js
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Custom hook for managing favourite post IDs in localStorage.
 */

import { useState } from "react";

const STORAGE_KEY = "creddit_favourites";

/*
 * Function:    useFavourites
 * Description: Manages a list of favourite post IDs in localStorage.
 * Parameters:  None.
 * Return:      {object} An object with favourites, addFavourite,
 *              removeFavourite, and isFavourite.
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addFavourite = (postId) => {
    setFavourites((prev) => {
      if (prev.includes(postId)) return prev;
      const updated = [...prev, postId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavourite = (postId) => {
    setFavourites((prev) => {
      const updated = prev.filter((id) => id !== postId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavourite = (postId) => favourites.includes(postId);

  return { favourites, addFavourite, removeFavourite, isFavourite };
}
