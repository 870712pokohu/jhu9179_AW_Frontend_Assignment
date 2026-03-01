/*
 * File:        ForumPage.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Landing page for browsing and searching Creddit forums.
 */

import { useState, useEffect, useRef } from "react";
import { getForumPosts, getForums } from "../api/creddit";
import PostCard from "../components/Postcard";

const FALLBACK_FORUMS = [
  "funny",
  "todayilearned",
  "worldnews",
  "gaming",
  "science",
  "technology",
  "movies",
  "music",
  "books",
  "sports",
];

/*
 * Function:    ForumPage
 * Description: Renders the forum browsing page with search and post list.
 * Parameters:  isFavourite {function}     - Checks if a post ID is saved.
 *              addFavourite {function}    - Adds a post ID to favourites.
 *              removeFavourite {function} - Removes a post ID from favourites.
 * Return:      {JSX.Element} The forum page element.
 */
export default function ForumPage({
  isFavourite,
  addFavourite,
  removeFavourite,
}) {
  const [forumInput, setForumInput] = useState("");
  const [activeForum, setActiveForum] = useState("");
  const [posts, setPosts] = useState([]);
  const [forums, setForums] = useState(FALLBACK_FORUMS);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    getForums()
      .then((data) => {
        const forumList = Array.isArray(data)
          ? data
          : (data.forums ?? data.data ?? data.results ?? []);
        if (forumList.length > 0) {
          setForums(
            forumList.map((forum) =>
              typeof forum === "string" ? forum : (forum.slug ?? forum.name),
            ),
          );
        }
      })
      .catch(() => {
        // Keep using the fallback list
      });
  }, []);

  /*
   * Function:    handleSearch
   * Description: Handles form submission to search for a forum's posts.
   * Parameters:  event {Event} - The form submit event.
   * Return:      None.
   */
  const handleSearch = async (event) => {
    event.preventDefault();
    const forumName = forumInput.trim();
    if (!forumName) return;

    setStatus("loading");
    setErrorMessage("");
    setPosts([]);
    setActiveForum(forumName);

    try {
      const data = await getForumPosts(forumName);
      const postList = Array.isArray(data)
        ? data
        : (data.posts ?? data.data ?? data.results ?? []);
      setPosts(postList.slice(0, 10));
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error.message ??
          "Something went wrong. Check the forum name and try again.",
      );
    }
  };

  /*
   * Function:    handleSelectForum
   * Description: Loads posts when a forum chip is clicked.
   * Parameters:  name {string} - The forum name/slug to load.
   * Return:      None.
   */
  const handleSelectForum = (name) => {
    setForumInput(name);
    setStatus("loading");
    setErrorMessage("");
    setPosts([]);
    setActiveForum(name);

    getForumPosts(name)
      .then((data) => {
        const postList = Array.isArray(data)
          ? data
          : (data.posts ?? data.data ?? data.results ?? []);
        setPosts(postList.slice(0, 10));
        setStatus("done");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error.message ?? "Couldn't load that forum.");
      });
  };

  /*
   * Function:    handleToggleFavourite
   * Description: Adds or removes a post from favourites.
   * Parameters:  postId {string} - The ID of the post to toggle.
   * Return:      None.
   */
  const handleToggleFavourite = (postId) => {
    if (isFavourite(postId)) {
      removeFavourite(postId);
    } else {
      addFavourite(postId);
    }
  };

  return (
    <main className="page forum-page">
      <section className="search-section">
        <h1 className="page-heading">Browse a Forum</h1>
        <p className="page-subheading">
          Type a forum name or pick one below to see the top 10 hot posts.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="e.g. funny, worldnews, gaming..."
            value={forumInput}
            onChange={(event) => setForumInput(event.target.value)}
            aria-label="Forum name"
          />
          <button
            className="search-btn"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading…" : "Go"}
          </button>
        </form>

        <div className="forum-chips">
          {forums.map((forum) => (
            <button
              key={forum}
              className={`forum-chip ${activeForum === forum ? "forum-chip--active" : ""}`}
              onClick={() => handleSelectForum(forum)}
            >
              c/{forum}
            </button>
          ))}
        </div>
      </section>

      <section className="posts-section">
        {status === "error" && (
          <div className="status-banner status-banner--error">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {status === "loading" && (
          <div className="posts-grid loading-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="post-card post-card--skeleton" />
            ))}
          </div>
        )}

        {status === "done" && posts.length === 0 && (
          <p className="empty-state">
            No posts found for <strong>c/{activeForum}</strong>.
          </p>
        )}

        {status === "done" && posts.length > 0 && (
          <>
            <h2 className="section-heading">
              c/{activeForum}{" "}
              <span className="post-count">— {posts.length} posts</span>
            </h2>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isFavourite={isFavourite(post.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
