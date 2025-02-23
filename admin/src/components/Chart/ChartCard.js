import React from 'react'

function Chart({ children, title }) {
  return (
    <div className="min-w-0 p-6 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <p className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-300">{title}</p>
      <div className="relative w-full h-72">
        {children}
      </div>
    </div>
  )
}

export default Chart
