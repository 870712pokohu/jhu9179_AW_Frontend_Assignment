/*
 * File:        creddit.js
 * Author:      Jin Ci Hu
 * Date:        2026-03-01
 * Description: Handles Creddit API authentication and data fetching.
 */

const BASE_URL = "https://awf-api.lvl99.dev";
const CREDENTIALS = {
  username: "jhu9179",
  password: "8819179",
};

let cachedToken = null;
let tokenExpiry = null;
let cachedUser = null;

/*
 * Function:    getToken
 * Description: Logs in and returns a JWT token, or returns the cached token.
 * Parameters:  None.
 * Return:      {Promise<string>} The JWT access token.
 */
async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!response.ok) throw new Error("Login failed — check your credentials");

  const data = await response.json();
  cachedToken = data.access_token;
  cachedUser = data.user;
  tokenExpiry = Date.now() + 55 * 60 * 1000;
  return cachedToken;
}

/*
 * Function:    authenticatedFetch
 * Description: Sends an authenticated request to the Creddit API.
 * Parameters:  endpoint {string} - The API endpoint path.
 *              options {object}   - Optional fetch config (method, body, headers).
 * Return:      {Promise<object>} The parsed JSON response.
 */
async function authenticatedFetch(endpoint, options = {}) {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!response.ok)
    throw new Error(`Request failed: ${response.status} ${endpoint}`);
  return response.json();
}

/*
 * Function:    getCurrentUser
 * Description: Returns the authenticated user object from cache or API.
 * Parameters:  None.
 * Return:      {Promise<object>} The user object (id, username, firstName, lastName).
 */
export async function getCurrentUser() {
  if (cachedUser) return cachedUser;
  await getToken();
  return cachedUser;
}

/*
 * Function:    getForums
 * Description: Fetches the list of all available forums.
 * Parameters:  None.
 * Return:      {Promise<Array>} An array of forum objects.
 */
export const getForums = () => authenticatedFetch("/forums");

/*
 * Function:    getForumPosts
 * Description: Fetches the top 10 hot posts from a forum.
 * Parameters:  forumSlug {string} - The forum name/slug.
 * Return:      {Promise<Array>} An array of post objects.
 */
export const getForumPosts = (forumSlug) =>
  authenticatedFetch(`/forums/${forumSlug}?sortBy=hot&limit=10`);

/*
 * Function:    getPostsByIds
 * Description: Fetches multiple posts by their IDs.
 * Parameters:  ids {Array<string>} - An array of post ID strings.
 * Return:      {Promise<Array>} An array of matching post objects.
 */
export const getPostsByIds = (ids) =>
  authenticatedFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
