import React from "react";

const TimelineItem = ({ icon: Icon, date, children }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-12">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500 text-purple-600 dark:text-purple-100">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="ml-4">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {children}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{date}</div>
      </div>
    </div>
  );
};

export default TimelineItem;
