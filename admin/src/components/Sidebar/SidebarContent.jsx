import React from "react";
import routes from "../../routes/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Button } from "@windmill/react-ui";
import { useAuth } from "../../context/AuthContext";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

function SidebarContent() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleItemClick = (route) => {
    if (route.path === "/app/logout") {
      logout();
      return;
    }
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a
        className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
        href="#"
      >
        E-Commerce
      </a>
      <ul className="mt-6">
        {routes.slice(0, -3).map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                to={route.path}
                onClick={() => handleItemClick(route)}
                className={({ isActive }) =>
                  `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                    isActive ? "text-gray-800 dark:text-gray-100" : ""
                  }`
                }
              >
                {location.pathname === route.path && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}

        <hr className="customeDivider mx-4 my-5" />

        {routes.slice(-3).map((route) => (
          <li className="relative px-6 py-3" key={route.name}>
            {route.path === "/app/logout" ? (
              <button
                onClick={logout}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </button>
            ) : (
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                    isActive ? "text-gray-800 dark:text-gray-100" : ""
                  }`
                }
              >
                {location.pathname === route.path && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="px-6 my-6">
        <Button>
          Generate Report
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div>
    </div>
  );
}

export default SidebarContent;
