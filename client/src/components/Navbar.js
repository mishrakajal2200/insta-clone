import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState();
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  const renderList = () => {
    if (state) {
      return [
        <Link to="/profile">
          <span className="text-gray-300 hover:bg-gray-700 justify-center content-center hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            profile
          </span>
        </Link>,
        <Link to="/create">
          <span className="text-gray-300 hover:bg-gray-700 justify-center content-center hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Create post
          </span>
        </Link>,
        <Link to="/myfollowingpost">
          <span className="text-gray-300 hover:bg-gray-700 justify-center content-center hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            myFollowingPost
          </span>
        </Link>,
        <button
          type="submit"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            navigate("/signin");
          }}
        >
          <span className="bg-rose-500 rounded-lg p-2 text-center red darken-3">
            Log out
          </span>
        </button>,
      ];
    } else {
      return [
        <Link
          to="/signup"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Signup
        </Link>,

        <Link
          to="/signin"
          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Login
        </Link>,
      ];
    }
  };
  return (
    <nav className="bg-indigo-500 shadow-lg">
      <div className="max-w-7xl mx-auto  px-1 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex  justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link to={state ? "/" : "/signin"}>
                <img
                  className="w-32"
                  src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-2010-2013.png"
                  alt="Workflow"
                />
              </Link>
            </div>
            <div className="hidden content-center  sm:block sm:ml-6">
              <div className="flex flex-row space-x-4">{renderList()}</div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3">
          <Link
            to="/profile"
            href="#"
            className="text-gray-300 hover:text-black  block px-3 py-1  rounded-md text-base font-medium"
          >
            Profile
          </Link>
          <Link
            to="/signup"
            href="#"
            className="text-gray-300 hover:text-black block px-3 py-1 rounded-md text-base font-medium"
          >
            Signup
          </Link>
          <Link
            to="/create"
            href="#"
            className="text-gray-300 hover:text-black block px-3 py-1 rounded-md text-base font-medium"
          >
            CreatePost
          </Link>
          <Link
            to="/myfollowingpost"
            className="text-gray-300 hover:text-black block px-3 py-1  rounded-md text-base font-medium"
          >
            Followings
          </Link>
          <button
            type="submit"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
          >
            <span className="bg-rose-500 rounded-lg ml-3 p-2 text-center red darken-3">
              LogOut
            </span>
          </button>
          ,
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
