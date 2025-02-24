import React from "react";

const Timeline = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute h-full w-0.5 bg-gray-200 dark:bg-gray-700 left-6 top-8"></div>
      <div className="space-y-6 relative">{children}</div>
    </div>
  );
};

export default Timeline;
