import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  const [showfollow, setShowFollow] = useState(
    state && state.followers ? !state.following.includes(userid) : true
  );
  useEffect(() => {
    if (!state) return; // Ensure state is defined before proceeding
    fetch(`https://instagram-clone-mern-2.onrender.com/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setProfile(result);
      });
  }, [userid, state]);

  const followUser = () => {
    const token = localStorage.getItem("jwt");
    fetch("https://instagram-clone-mern-2.onrender.com/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Follow successful:", data);
        // Optionally, update local state or dispatch an action
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.error("Error following user:", err);
        // Handle error: show a message to the user, retry, etc.
      });
  };

  const unfollowUser = () => {
    const token = localStorage.getItem("jwt");
    fetch("https://instagram-clone-mern-2.onrender.com/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("unFollow successful:", data);
        // Optionally, update local state or dispatch an action
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => {
        console.error("Error unfollowing user:", err);
        // Handle error: show a message to the user, retry, etc.
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid gray",
            }}
          >
            <div>
              <img
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.photo}
                alt=""
                className="mt-3 mr-4"
              />
            </div>
            <div>
              <h4 className="font-bold mt-6">{userProfile.user.name}</h4>
              <h5 className="mt-2 mb-2">{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>

              {showfollow ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery w-64 mx-auto">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item mt-5"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </div>
  );
};

export default UserProfile;
