import React from "react";

const Toggle = ({ enabled, onChange, name }) => {
  return (
    <div className="relative inline-block w-12 mr-2 align-middle select-none">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={enabled}
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={name}
        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </label>
    </div>
  );
};

export default Toggle;
