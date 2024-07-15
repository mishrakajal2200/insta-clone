import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
const Signup = () => {
  const navigate = useNavigate("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(undefined);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadpic = async () => {
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

  // Function to validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const uploadFields = async () => {
    // Check if email is valid
    if (!validateEmail(email)) {
      M.toast({
        html: "Invalid email address",
        classes: "#e53935 red darken-1",
      });
      return;
    }
    try {
      console.log("Sending data:", { name, email, password, photo: url });
      const response = await fetch(
        "https://instagram-clone-mern-2.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            photo: url,
          }),
        }
      );

      // Parse the JSON response
      const data = await response.json();

      // Check if the response status is not okay (not in the range of 2xx)
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Handle success
      M.toast({ html: data.message, classes: "#81c784 green lighten-2" });
      navigate("/signin");
    } catch (err) {
      // Handle errors
      M.toast({ html: err.message, classes: "#e53935 red darken-1" });
    }
  };
  const PostData = async () => {
    if (image) {
      uploadpic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mx-auto content-center bg-gradient-to-r from-indigo-800 to-rose-500 shadow-2xl lg:w-96 bg-white-900 rounded-xl  p-4">
        <img
          className="w-32 mx-auto"
          src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-2010-2013.png"
          alt="Workflow"
        />

        <form
          className="grid mx-auto space-y-3 mb-3 rounded-sm"
          onSubmit={(e) => {
            e.preventDefault();
            PostData();
          }}
        >
          <input
            required
            type="text"
            placeholder="Enter name"
            className="p-2 mx-12 font-bold rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="Email"
            className="p-2 font-bold mx-12 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="password"
            className="p-2 mx-12 font-bold rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              <span className="text-white">upload picture</span>
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-200 font-bold p-2 mx-12 rounded-lg"
          >
            Sign Up
          </button>
          <hr />
          <span className="mt-6 text-white">OR</span>
          <div className="flex mx-auto justify-center content-center">
            <Link to="https://www.facebook.com/r.php/">
              <img
                src="https://logodownload.org/wp-content/uploads/2014/09/facebook-logo-5-1.png"
                alt=""
                className="h-6 w-6"
              />
            </Link>
            <h1 className="text-lg text-white">Sign Up with Facebook</h1>
          </div>
          <p className="text-lg mx-auto">
            <span className="text-white">Already have an account ?</span>{" "}
            <Link to="/signin" className="text-indigo-600">
              <span className="text-white">Log In</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
