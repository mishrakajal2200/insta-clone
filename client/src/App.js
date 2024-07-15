import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";

import Home from "./components/screens/Home";
import Navbar from "./components/Navbar";
import Createpost from "./components/screens/Createpost";

import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUser from "./components/screens/SubscibeUser";

// import EmailForm from "./components/screens/EmailForm";
export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: "user" });
    } else {
      navigate("/signin");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/signin" element={<Login />} />

        <Route exact path="/profile" element={<Profile />} />

        <Route path="/create" element={<Createpost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowingpost" element={<SubscribeUser />} />
      </Routes>
      ;
    </>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
