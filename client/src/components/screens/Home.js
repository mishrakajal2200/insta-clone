import React from "react";
import Card from "./Card";

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen mx-auto px-32 sm:px-10 lg:px-96 sm:mx-auto bg-gray-100">
      <Card
        title="Card Title"
        description="This is a description of the card. It can be a short summary or any content you want to include."
        imageUrl=""
      />
    </div>
  );
};

export default Home;
