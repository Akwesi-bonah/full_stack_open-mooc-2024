import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import Togglable from "./components/Togglabe";
import Blog from "./components/Blog";
import BlogForm from './components/BlogForm'
import blogService from "./services/blogs";
import loginService from "./services/login";

import "./index.css";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
 

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes)) // Sort blogs by likes
    );
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      // Attempt to log in the user
      const user = await loginService.login({
        username,
        password,
      });
  
      // Handle successful login
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
  
      setSuccessMessage("Login successful");
      setTimeout(() => setSuccessMessage(null), 5000);
  
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password");
      } else if (error.response && error.response.status === 400) {
        setErrorMessage("Missing username or password");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
  
      setTimeout(() => setErrorMessage(null), 5000);
      console.error("Login error:", error);
    }
  };
  
  
  const handleAddBlog = async (newBlog) => {
    if (!user) {
      setErrorMessage("You must be logged in to create a blog");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
  
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setSuccessMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage("Failed to create a new blog");
      setTimeout(() => setErrorMessage(null), 5000);
      console.error(error);
    }
  };
  const handleUpdateBlog = async (updatedBlog) => {
    try {
      const response = await blogService.update(updatedBlog.id, updatedBlog);
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? response : blog))
      );
    } catch (error) {
      setErrorMessage("Failed to update blog likes");
      setTimeout(() => setErrorMessage(null), 5000);
      console.error(error);
    }
  };

  const handleDeleteBlog = async (blogToDelete) => {
    try {
      await blogService.remove(blogToDelete.id);
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== blogToDelete.id)
      );
      setSuccessMessage(`Deleted blog: ${blogToDelete.title}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage("Failed to delete blog");
      setTimeout(() => setErrorMessage(null), 5000);
      console.error(error);
    }
  };
  
  // Pass the function to Blog component
  {blogs.map((blog) => (
    <Blog key={blog.id} 
    blog={blog} 
    updateBlog={handleUpdateBlog} 
    deleteBlog={handleDeleteBlog}
    currentUser={user} 
    
    />
  ))}
  

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
    setSuccessMessage("Logout Successfully");
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const LoginForm = () => {
    return (
      <form onSubmit={handleLogin} className="loginForm">
        <h2>Login in to application</h2>
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            name="username"
            data-testid='username'
            onChange={({ target }) => setUsername(target.value)}
          ></input>
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            name="password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          ></input>
        </div>
        <button type="submit"> Login</button>
      </form>
    );
  };


  
  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      {!user && LoginForm()}
      {user && (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in{" "}
            <button type="button" onClick={handleLogout}>
              Logout
            </button>{" "}
          </p>

          <Togglable buttonLabel="create">
          <BlogForm 
          createBlog={handleAddBlog}/>
          </Togglable>
          <br></br>
          {blogs.map((blog) => (
            <Blog 
            key={blog.id} 
            blog={blog}
            deleteBlog={handleDeleteBlog}  
            updateBlog={handleUpdateBlog}
            currentUser={user}
             />
          ))}
        </>
      )}
    </div>
  );
};


export default App;

