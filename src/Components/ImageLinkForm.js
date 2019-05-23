import React from "react";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3 center">{`This Magic Brain Will detect Face in your images.Just give it a try`}</p>
      <div className="center">
        <div className=" center pa4 br3 shadow-5 form">
          <input className="f4 pa1 w-60" type="tex" onChange={onInputChange} />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageLinkForm;
