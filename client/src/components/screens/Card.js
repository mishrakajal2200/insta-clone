import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

const Card = () => {
  const [data, setPosts] = useState([]);
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Get the token from local storage
    if (!token) {
      console.error("No token found");
      return;
    }

    fetch("https://instagram-clone-mern-2.onrender.com/allpost", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        setPosts(result.posts || []); // Ensure data is an array even if result.posts is undefined
      })
      .catch((err) => {
        console.error("Fetch error: ", err);
        setPosts([]); // Ensure data is an empty array in case of an error
      });
  }, [navigate]);

  const likePost = (id) => {
    const token = localStorage.getItem("jwt");
    fetch("https://instagram-clone-mern-2.onrender.com/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.error("Error liking post:", err);
      });
  };

  const unlikePost = (id) => {
    const token = localStorage.getItem("jwt");
    fetch("https://instagram-clone-mern-2.onrender.com/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.error("Error unliking post:", err);
      });
  };

  const makeComment = (text, postId) => {
    const token = localStorage.getItem("jwt");
    fetch("https://instagram-clone-mern-2.onrender.com/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.error("Error making comment:", err);
      });
  };

  const deletePost = (postId) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }
    fetch(`https://instagram-clone-mern-2.onrender.com/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== postId;
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      });
  };

  return (
    <div>
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h5 style={{ padding: "5px" }}>
            <Link
              to={
                item.postedBy
                  ? item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                  : "/"
              }
            >
              <i className="material-icons" style={{ verticalAlign: "middle" }}>
                arrow_forward
              </i>
              {item.postedBy ? item.postedBy.name : "Unknown User"}
            </Link>{" "}
            {item.postedBy && item.postedBy._id === state._id && (
              <i
                className="material-icons cursor-pointer"
                style={{ float: "right" }}
                onClick={() => deletePost(item._id)}
              >
                delete
              </i>
            )}
          </h5>
          <div className="card-image">
            <img src={item.photo} alt="" />
          </div>
          <div className="card-content">
            <i
              className="material-icons cursor-pointer"
              style={{ color: "red" }}
            >
              favorite
            </i>
            {item.likes.includes(state && state._id) ? (
              <i
                className="material-icons cursor-pointer"
                onClick={() => unlikePost(item._id)}
              >
                thumb_down
              </i>
            ) : (
              <i
                className="material-icons cursor-pointer"
                onClick={() => likePost(item._id)}
              >
                thumb_up
              </i>
            )}
            <h6>{item.likes.length} likes</h6>
            <h6>{item.title}</h6>
            <p>{item.body}</p>
            {item.comments.map((record) => (
              <h6 key={record._id}>
                <span style={{ fontWeight: "500" }}>
                  {record.postedBy ? record.postedBy.name : "Unknown User"}
                </span>{" "}
                {record.text}
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                makeComment(e.target[0].value, item._id);
              }}
            >
              <input type="text" placeholder="add a comment hit enter" />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;