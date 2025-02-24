import React from "react";

function ChartCard({ children, title, action }) {
  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
          {title}
        </p>
        {action && <div className="flex items-center">{action}</div>}
      </div>
      <div className="relative h-[300px]">{children}</div>
    </div>
  );
}

export default ChartCard;
