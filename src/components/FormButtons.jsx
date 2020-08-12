import React, { useRef } from "react";
export const FormButtons = ({ text }) => {
  const thisDOM = useRef();
  const Hover = (e) => {
    var leftOffset = thisDOM.current.getBoundingClientRect().left;
    var btnWidth = thisDOM.current.offsetWidth;
    var myPosX = e.pageX;
    var newClass = "";
    if (myPosX < leftOffset + 0.3 * btnWidth) {
      newClass = "btn-left";
    } else {
      if (myPosX > leftOffset + 0.65 * btnWidth) {
        newClass = "btn-right";
      } else {
        newClass = "btn-center";
      }
    }
    var clearedClassList = thisDOM.current.className
      .replace(/btn-center|btn-right|btn-left/gi, "")
      .trim();
    thisDOM.current.className = clearedClassList + " " + newClass;
  };
  const handleClickExit = (e) => {
    var newClass = "btn-center";
    var clearedClassList = thisDOM.current.className
      .replace(/btn-center|btn-right|btn-left/gi, "")
      .trim();
    thisDOM.current.className = clearedClassList + " " + newClass;
  };
  return (
    <div>
      <div className="wrapper">
        <div role="button" className="retro-btn sm primary">
          <button
            className="btn"
            style={{
              width: "95%",
            }}
            ref={thisDOM}
            onMouseMove={(e) => Hover(e)}
            onClick={(e) => handleClickExit(e)}
            onMouseLeave={(e) => handleClickExit(e)}
          >
            <span className="btn-inner">
              <span className="content-wrapper">
                <span className="btn-content">
                  <span className="btn-content-inner" label={text}></span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
