/*
 * File:        FavouritesPage.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Page that displays and manages the user's saved posts.
 */

import { useReducer, useEffect } from "react";
import { getPostsByIds } from "../api/creddit";
import PostCard from "../components/Postcard";
import { Link } from "react-router-dom";

/*
 * Function:    favouritesReducer
 * Description: Reducer for the favourites page loading state.
 * Parameters:  state {object}  - Current state (posts, loading, error).
 *              action {object} - Dispatched action (type, payload).
 * Return:      {object} The updated state.
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { posts: [], loading: true, error: "" };
    case "SUCCESS":
      return { posts: action.payload, loading: false, error: "" };
    case "ERROR":
      return { posts: [], loading: false, error: action.payload };
    case "REMOVE":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.id),
      };
    default:
      return state;
  }
}

const initialState = { posts: [], loading: false, error: "" };

/*
 * Function:    FavouritesPage
 * Description: Renders the favourites page with saved posts.
 * Parameters:  favourites {Array<string>}  - List of saved post IDs.
 *              removeFavourite {function}  - Removes a post ID from favourites.
 * Return:      {JSX.Element} The favourites page element.
 */
export default function FavouritesPage({ favourites, removeFavourite }) {
  const [{ posts, loading, error }, dispatch] = useReducer(
    favouritesReducer,
    initialState,
  );

  const favouriteIds = favourites.join(",");

  useEffect(() => {
    if (favourites.length === 0) {
      return;
    }

    dispatch({ type: "LOADING" });

    getPostsByIds(favourites)
      .then((data) => {
        const postList = Array.isArray(data)
          ? data
          : (data.posts ?? data.data ?? []);
        dispatch({ type: "SUCCESS", payload: postList });
      })
      .catch((error) => {
        dispatch({
          type: "ERROR",
          payload: error.message ?? "Failed to load your favourites.",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favouriteIds]);

  /*
   * Function:    handleRemove
   * Description: Removes a post from favourites and the displayed list.
   * Parameters:  postId {string} - The ID of the post to remove.
   * Return:      None.
   */
  const handleRemove = (postId) => {
    removeFavourite(postId);
    dispatch({ type: "REMOVE", id: postId });
  };

  if (favourites.length === 0) {
    return (
      <main className="page favourites-page">
        <h1 className="page-heading">Favourites</h1>
        <div className="empty-state-box">
          <p className="empty-state">You haven't saved any posts yet.</p>
          <Link to="/" className="empty-cta">
            Browse forums →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page favourites-page">
      <div className="favourites-header">
        <h1 className="page-heading">Favourites</h1>
        <span className="fav-count">{favourites.length} saved</span>
      </div>

      {loading && (
        <div className="posts-grid loading-grid">
          {favourites.map((id) => (
            <div key={id} className="post-card post-card--skeleton" />
          ))}
        </div>
      )}

      {error && (
        <div className="status-banner status-banner--error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isFavourite={true}
              onToggleFavourite={handleRemove}
            />
          ))}
        </div>
      )}
    </main>
  );
}
