import React from "react";

const FaceRegonition = ({ imageURL, box }) => {
  return (
    <div className="center ma">
      <div className="absolute ma2">
        <img
          id="inputimage"
          alt=""
          src={imageURL}
          width="500px"
          height="auto"
        />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol
          }}
        />
      </div>
    </div>
  );
};

export default FaceRegonition;
