import React from "react";

const Text = ({ content, className }) => {
  return (
    <div>
      <h1
        className={`primaryText italic font-medium uppercase leading-[1.7] ${className}`}
      >
        {content}
      </h1>
    </div>
  );
};

export default Text;
