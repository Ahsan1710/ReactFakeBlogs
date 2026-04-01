import { createContext, useContext, useMemo, useState } from "react";
import createRandomPost from "./FakePosts";

// 1) Create Context
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);
  return (
    // 2) Provide value to child components
    // <PostContext.Provider
    //   value={{
    //     posts: searchedPosts,
    //     onClearPosts: handleClearPosts,
    //     onAddPost: handleAddPost,
    //     searchQuery: searchQuery,
    //     setSearchQuery: setSearchQuery,
    //   }}
    // >

    // 3) Memoize the value to prevent unnecessary re-renders
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("Context is used outside of Context Provider");
  return context;
}

export { PostProvider, usePosts };
