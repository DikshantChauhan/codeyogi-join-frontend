import { FC, memo, useContext } from "react";
import { NavLink } from "react-router-dom";
import { NAVBAR_NAMES } from "../../constants.routes";
import { allowedRoutesContext } from "../../Contexts/allowedRoutes.context";

interface NavlistProps {}

const Navlist: FC<NavlistProps> = ({}) => {
  const { allowedRoutes } = useContext(allowedRoutesContext);

  return (
    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
      {allowedRoutes.map((route) => {
        return (
          <NavLink
            to={route}
            className={({ isActive }) =>
              isActive
                ? "block py-2 pl-3 pr-4 border-b  md:text-white bg-gray-700 text-white md:bg-transparent w-30 border-gray-700 md:border-0 md:p-0"
                : "block py-2 pl-3 pr-4 text-gray-400 border-b border-gray-700 md:border-0 md:p-0 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent w-30"
            }
          >
            {NAVBAR_NAMES[route] && NAVBAR_NAMES[route]}
          </NavLink>
        );
      })}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "block py-2 pl-3 pr-4 border-b  md:text-white bg-gray-700 text-white md:bg-transparent w-30 border-gray-700 md:border-0 md:p-0"
            : "block py-2 pl-3 pr-4 text-gray-400 border-b border-gray-700 md:border-0 md:p-0 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent w-30"
        }
      >
        Profile
      </NavLink>
    </ul>
  );
};

export default memo(Navlist);
