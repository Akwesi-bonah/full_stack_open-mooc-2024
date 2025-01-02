import { useState } from "react";


const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
    }
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateBlog(updatedBlog);
  };

  return (
    <div style={blogStyle}>
      <div className="blogDiv">
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? "Hide" : "View"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes}{" "}
            <button onClick={handleLike}>Like</button>
          </p>
          <p>Posted by: {blog.user?.name || "Unknown"}</p>
          {currentUser && currentUser.id === blog.user.id && (
            <button onClick={handleDelete} style={{ color: "red" }}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};


export default Blog;
