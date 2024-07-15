import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const Signin = async () => {
    // Check if email is valid
    if (!validateEmail(email)) {
      M.toast({
        html: "Invalid email address",
        classes: "#e53935 red darken-1",
      });
      return;
    }
    try {
      console.log("Sending request to /signin with:", { email, password });
      const response = await fetch(
        "https://instagram-clone-mern-2.onrender.com/signin",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Check if the response status is not okay (not in the range of 2xx)
      if (!response.ok) {
        const errData = await response.json();
        // throw new Error(data.error || "Something went wrong");
        throw new Error(errData.error || "Something went wrong");
      } else {
        // Parse the JSON response
        const data = await response.json();

        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });

        // Handle success
        M.toast({
          html: "Signed in successfully",
          classes: "#81c784 green lighten-2",
        });
        navigate("/");
      }
    } catch (err) {
      // Handle errors
      console.error("Error during sign in:", err);
      M.toast({ html: err.message, classes: "#e53935 red darken-1" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center mx-auto shadow-2xl lg:w-1/4 px-2 bg-gradient-to-r from-indigo-800 to-rose-500 p-4 rounded-xl justify-center content-center">
        <img
          className="w-32 mx-auto"
          src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-2010-2013.png"
          alt="Workflow"
        />
        <form
          action=""
          className="grid mx-auto space-y-3 mb-3 rounded-lg"
          onSubmit={(e) => {
            e.preventDefault();
            Signin();
          }}
        >
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mx-auto text-black font-bold rounded-lg lg:w-3/4 md:w-1/2 "
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mx-auto rounded-lg font-bold lg:w-3/4 md:w-1/2 "
          />
          <button
            type="submit"
            className="bg-indigo-100 p-2 bg-cyan-200 mx-auto rounded-lg lg:w-3/4"
          >
            <span className="font-bold">Log In</span>
          </button>
          <span className="mt-6 text-white">OR</span>
          <div className="flex mx-auto justify-center content-center">
            <Link to="https://www.facebook.com/login.php/">
              <img
                src="https://logodownload.org/wp-content/uploads/2014/09/facebook-logo-5-1.png"
                alt=""
                className="h-6 w-6"
              />
            </Link>
            <h1 className="text-lg text-white">Log in with Facebook</h1>
          </div>
          <p className="text-lg mx-auto">
            <span className="text-white">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-rose-100">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
