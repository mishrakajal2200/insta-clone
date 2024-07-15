import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router";

const Createpost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      createPost();
    }
  });

  const uploadImage = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram-clone");
      data.append("cloud_name", "kajalmishra");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/kajalmishra/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadData = await response.json();
      if (uploadData.error) {
        throw new Error(uploadData.error.message);
      }
      setUrl(uploadData.secure_url);
    } catch (err) {
      console.error("Error uploading image:", err);
      M.toast({ html: err.message, classes: "red darken-3" });
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("User is not logged in");
      }

      const postResponse = await fetch(
        "https://instagram-clone-mern-2.onrender.com/createpost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            body,
            photo: url,
          }),
        }
      );

      const postData = await postResponse.json();

      if (postData.error) {
        M.toast({ html: postData.error, classes: "red darken-3" });
      } else {
        M.toast({
          html: "Created post successfully",
          classes: "green darken-3",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      M.toast({ html: err.message, classes: "red darken-3" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body || !image) {
      M.toast({
        html: "Please fill in all fields",
        classes: "red darken-3",
      });
      return;
    }
    uploadImage();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg bg-gradient-to-r from-indigo-600 to-rose-600 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-white">Create Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              <span className="text-white">Title</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow font-bold appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter title"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="body"
            >
              <span className="text-white">Body</span>
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="shadow font-bold appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter body"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              <span className="text-white">File/Folder</span>
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createpost;
