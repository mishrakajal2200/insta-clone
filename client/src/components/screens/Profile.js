import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          "https://instagram-clone-mern-2.onrender.com/mypost",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && Array.isArray(result.mypost)) {
          setPics(result.mypost || []);
        } else {
          console.error("Unexpected response structure:", result);
          setPics([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPics([]);
      }
    };

    fetchPosts();
  }, [url]);

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
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

          const updateResponse = await fetch(
            "https://instagram-clone-mern-2.onrender.com/updatephoto",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: state._id, // Assuming state._id contains the user ID
                photo: uploadData.secure_url,
              }),
            }
          );

          const updateData = await updateResponse.json();
          if (!updateResponse.ok) {
            throw new Error(updateData.error || "Something went wrong");
          }

          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, photo: uploadData.secure_url })
          );
          dispatch({ type: "UPDATEPHOTO", payload: uploadData.secure_url });

          M.toast({
            html: "Image uploaded successfully!",
            classes: "green darken-1",
          });
        } catch (err) {
          console.error("Error uploading image:", err);
          M.toast({ html: err.message, classes: "red darken-3" });
        }
      }
    };
    uploadImage();
  }, [image]);

  const updatephoto = async (file) => {
    setImage(file);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 lg:p-8 bg-gray-100">
      <div className="text-center mx-auto shadow-2xl rounded-lg  bg-white-800 justify-center content-center">
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div className="flex justify-around my-18px border-b-2 p-1 border-gray-500 ">
            <div>
              <img
                src={
                  state && state.photo
                    ? state.photo
                    : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg" // Default image URL
                }
                alt="Profile"
                className="w-108px h-108px rounded-80px my-5"
              />
              {state && (
                <input
                  type="file"
                  onChange={(e) => {
                    updatephoto(e.target.files[0]);
                  }}
                />
              )}
            </div>
            <div className="content-center">
              <h2 className="font-bold text-2xl">
                {state ? state.name : "Guest"}
              </h2>
              <h2 className="font-light text-xl">
                {state ? state.email : "guest@example.com"}
              </h2>
              <div className="flex justify-between my-5">
                <h6 style={{ fontWeight: "600", marginRight: "3px" }}>
                  {mypics.length} posts
                </h6>
                <h6 style={{ fontWeight: "600", marginRight: "3px" }}>
                  {state && state.followers ? state.followers.length : "0"}{" "}
                  followers
                </h6>
                <h6 style={{ fontWeight: "600", marginRight: "3px" }}>
                  {state && state.following ? state.following.length : "0"}{" "}
                  following
                </h6>
              </div>
            </div>
          </div>
          <div className="flex justify-around">
            {mypics.length > 0 ? (
              mypics.map((item) => (
                <img
                  key={item._id} // Ensure each mapped item has a unique key
                  src={item.photo}
                  alt={item.title}
                  className="w-1/5 p-2 mx-auto"
                />
              ))
            ) : (
              <p className="bg-rose-500 text-dark-500 p-2 w-full font-bold text-center">
                No posts available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
