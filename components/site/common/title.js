import React from "react";

const Title = ({ heading, className }) => {
  return (
    <div>
      <h1
        className={`text-center uppercase secondaryText text-text italic font-bold ${className}`}
      >
        {heading}
      </h1>
    </div>
  );
};

export default Title;
