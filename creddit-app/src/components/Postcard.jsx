/*
 * File:        PostCard.jsx
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Card component for displaying a single Creddit post.
 */

/*
 * Function:    PostCard
 * Description: Renders a post card with title, content, stats, and save button.
 * Parameters:  post {object}              - The post data object.
 *              isFavourite {boolean}       - Whether the post is currently saved.
 *              onToggleFavourite {function} - Callback when save button is clicked.
 * Return:      {JSX.Element} The post card element.
 */
export default function PostCard({ post, isFavourite, onToggleFavourite }) {
  const { id, title, content, author, totalLikes, totalRead, forum } = post;

  const contentPreview =
    content && content.length > 220
      ? content.slice(0, 220).trimEnd() + "…"
      : (content ?? "");

  return (
    <div className={`post-card ${isFavourite ? "post-card--fav" : ""}`}>
      <div className="post-card-meta">
        {forum && <span className="post-forum">c/{forum}</span>}
        <span className="post-author">u/{author}</span>
      </div>

      <h3 className="post-title">{title}</h3>

      {contentPreview && <p className="post-content">{contentPreview}</p>}

      <div className="post-footer">
        <div className="post-stats">
          <span className="post-score">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {totalLikes?.toLocaleString() ?? 0}
          </span>
          <span className="post-reads">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {totalRead?.toLocaleString() ?? 0}
          </span>
        </div>

        <button
          className={`fav-btn ${isFavourite ? "fav-btn--active" : ""}`}
          onClick={() => onToggleFavourite(id)}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
        >
          {isFavourite ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}
